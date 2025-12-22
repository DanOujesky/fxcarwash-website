import Stripe from "stripe";
import { prisma } from "../config/db.js";
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
    return res.status(400).send(`Webhook Error:  ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const cardId = session.metadata.cardId;
    const amount = parseInt(session.metadata.creditsAmount);

    if (cardId && amount) {
      try {
        const updatedCard = await prisma.card.update({
          where: {
            id: cardId,
          },
          data: {
            credit: {
              increment: amount,
            },
          },
        });
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  res.json({ received: true });
};
