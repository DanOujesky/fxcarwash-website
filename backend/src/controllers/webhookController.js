import Stripe from "stripe";
import { prisma } from "../config/db.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../utils/mailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { cardId, creditsAmount, action, userId, shipping, street } =
      session.metadata;

    if (!cardId || !creditsAmount) {
      console.error("Missing metadata in Stripe session");
      return res.status(400).json({ error: "Missing metadata" });
    }

    const amount = parseInt(creditsAmount);
    let updateData = {};

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json({
        error: "Žádný uživatel nebyl nenalezen s tímto emailem",
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
      } else if (action === "addCredit") {
      }
    } catch (error) {
      console.error(`Database Error: ${error.message}`);
      return res.status(500).json({ error: "Database update failed" });
    }
  }
  res.status(200).json({ received: true });
};
