import Stripe from "stripe";
import { prisma } from "../config/db.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../utils/mailer.js";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface SessionMetadata {
  cardId?: string;
  creditsAmount?: string;
  action?: "createCard" | "addCredit";
  userId?: string;
  shipping?: string;
  street?: string;
}

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

    const metadata = session.metadata as unknown as SessionMetadata;

    const { cardId, creditsAmount, action, userId } = metadata;

    if (!cardId || !creditsAmount || !userId) {
      console.error("Missing metadata in Stripe session");
      return res.status(400).json({ error: "Missing metadata" });
    }

    const amount = parseInt(creditsAmount, 10);

    let updateData: any = {};

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({
        error: "Žádný uživatel nebyl nenalezen",
      });
    }

    if (action === "createCard") {
      updateData = {
        userId: userId,
        credit: { increment: amount },
      };
    } else if (action === "addCredit") {
      updateData = {
        credit: { increment: amount },
      };
    }

    try {
      await prisma.card.update({
        where: { id: cardId },
        data: updateData,
      });

      if (action === "createCard") {
        await sendOrderEmailToUser(user);
        await sendOrderEmailToCompany(user);
      }
    } catch (err) {
      const error = err as Error;
      console.error(`Database Error: ${error.message}`);
      return res.status(500).json({ error: "Database update failed" });
    }
  }

  res.status(200).json({ received: true });
};
