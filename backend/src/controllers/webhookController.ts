import Stripe from "stripe";
import { prisma } from "../config/db.js";
import { Request, Response } from "express";
import {
  addCreditToCard,
  assignCardFromPool,
  createOrUpdateCardInNayax,
} from "../services/nayaxService.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../mails/orderMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) return res.status(400).send("No orderId in metadata");

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order || order.status === "PAID") {
      return res
        .status(200)
        .json({ message: "Already processed or not found" });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    for (const item of order.items) {
      try {
        let card;
        let newBalance: number;

        if (item.delivery) {
          card = await prisma.$transaction(async (tx) => {
            return await assignCardFromPool(tx, order.userId);
          });

          if (!card) {
            console.error(
              `CRITICAL: Žádná karta v poolu pro order ${orderId}, item ${item.id}`,
            );
            await sendOrderEmailToCompany(order.user, {
              ...order,
              // přidej flag že karta nebyla přiřazena
            });
            continue;
          }
          const cardCreated = await createOrUpdateCardInNayax(
            order.user,
            item.credit!,
            card,
          );

          newBalance = cardCreated.credit;
        } else {
          card = await prisma.card.findUnique({
            where: { number: item.cardNumber! },
          });
          if (
            !card ||
            card.userId !== order.userId ||
            !card.identifier ||
            item.credit === null
          ) {
            console.error(
              `CRITICAL: Card not found or invalid for order ${orderId}, item ${item.id}`,
            );
            continue;
          }
          newBalance = await addCreditToCard(card.identifier, item.credit);

          await prisma.card.update({
            where: { id: card!.id },
            data: {
              credit: newBalance,
            },
          });
        }

        if (item.credit) {
          await prisma.$transaction([
            prisma.creditLog.create({
              data: {
                cardId: card.id,
                orderId: order.id,
                userId: order.userId,
                amount: item.credit,
                balanceAfter: newBalance,
              },
            }),
          ]);
        }
      } catch (error) {
        console.error(
          `CRITICAL: Failed to process item for order ${orderId}:`,
          error,
        );
      }
    }

    await Promise.allSettled([
      sendOrderEmailToUser(order.user, order),
      sendOrderEmailToCompany(order.user, order),
    ]);

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook processing failed:", err);
    res.status(500).send("Internal Server Error");
  }
};
