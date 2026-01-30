import Stripe from "stripe";
import { prisma } from "../config/db.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../mails/orderMail.js";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send("Webhook Error: Missing signature/secret");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Signature failure: ${(err as Error).message}`);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) return res.status(400).send("No orderId in metadata");

    try {
      await prisma.$transaction(
        async (tx) => {
          const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true, user: true },
          });

          if (!order || !order.user || order.status === "PAID") return;

          await tx.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });

          for (const item of order.items) {
            if (!item.credit) continue;

            if (item.delivery) {
              const quantity = item.quantity || 1;
              const lastCard = await tx.card.findFirst({
                orderBy: { createdAt: "desc" },
              });

              let nextNumber = lastCard ? parseInt(lastCard.number) + 1 : 10;

              for (let i = 0; i < quantity; i++) {
                if (nextNumber > 10000) {
                  console.error("Dosáhli jsme maximálního limitu čísel karet!");
                  break;
                }
                await tx.card.create({
                  data: {
                    userId: order.userId,
                    number: String(nextNumber),
                    credit: item.credit,
                  },
                });
                nextNumber++;
              }
            } else {
              if (!item.cardNumber) {
                console.error("Missing cardNumber for credit item");
                continue;
              }
              await tx.card.update({
                where: { number: item.cardNumber },
                data: { credit: { increment: item.credit } },
              });
            }
          }

          try {
            await sendOrderEmailToUser(order.user, order);
            await sendOrderEmailToCompany(order.user, order);
          } catch (e) {
            console.error("Email failed but payment is saved:", e);
          }
        },
        { timeout: 15000 },
      );
    } catch (err) {
      console.error("Webhook Database Error:", err);
      return res.status(500).send("Database Update Failed");
    }
  }

  res.status(200).json({ received: true });
};
