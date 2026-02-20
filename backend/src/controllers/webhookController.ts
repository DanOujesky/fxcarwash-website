import Stripe from "stripe";
import { prisma } from "../config/db.js";
import { Request, Response } from "express";
import * as nayax from "../services/nayaxService.js";
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

    const memberId = await nayax.ensureMemberExists(order.user);

    for (const item of order.items) {
      try {
        let card;

        if (item.delivery) {
          card = await prisma.$transaction(async (tx) => {
            return await nayax.assignCardFromPool(tx, order.userId);
          });
          await nayax.createCardInNayax(memberId, card.identifier);
        } else {
          card = await prisma.card.findUnique({
            where: { number: item.cardNumber! },
          });
        }

        if (card && item.credit) {
          const newBalance = await nayax.topupCardInNayax(
            card.identifier,
            item.credit,
          );

          await prisma.$transaction([
            prisma.card.update({
              where: { id: card.id },
              data: { credit: newBalance },
            }),
            prisma.creditLog.create({
              data: {
                cardId: card.id,
                memberId: memberId,
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
