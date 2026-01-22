import Stripe from "stripe";
import { prisma } from "../config/db.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../utils/mailer.js";
import { Request, Response } from "express";
import { z } from "zod";
import { getRandomValues } from "node:crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send("Missing stripe-signature or webhook secret");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) return res.status(400).send("No orderId in metadata");

    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: {
            items: true,
          },
        });
        if (!order || order.status === "PAID") return;

        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // credit mechanism can be added here if needed

        const getRandomInt = (min = 10, max = 100000): number => {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        order.items.forEach(async (orderItem) => {
          const item = await tx.product.findUnique({
            where: { id: orderItem.productId },
          });

          if (!item || !item.credit) return;

          if (item.delivery) {
            await tx.card.create({
              data: {
                userId: order.userId,
                number: getRandomInt().toString(),
                credit: item.credit,
              },
            });
          } else {
            await tx.card.update({
              where: { id: orderItem.productId },
              data: {
                credit: { increment: item.credit },
              },
            });
          }
        });

        //end

        const user = await tx.user.findUnique({ where: { id: order.userId } });
        if (user) {
          await sendOrderEmailToUser(user, order);
          await sendOrderEmailToCompany(user, order);
        }
      });
    } catch (err) {
      console.error("Webhook DB Error:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).json({ received: true });
};
