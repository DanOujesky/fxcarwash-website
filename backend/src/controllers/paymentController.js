import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { prisma } from "../config/db.js";
export const payment = async (req, res) => {
  const { cardNumber, credit, action, shipping, quantity, street } = req.body;
  const userId = req.user.id;

  const amount = Math.round(parseFloat(credit) * 100);

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Neplatná částka" });
  }
  try {
    const card = await prisma.card.findFirst({
      where: {
        number: cardNumber,
      },
    });

    if (!card) {
      return res.status(404).json({
        error: "Karta s timto cislem nebyla u vaseho uctu nalezena",
        cardNotFound: true,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: { name: `Číslo karty: ${card.number}` },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        cardId: card.id,
        creditsAmount: credit,
        action: action,
        userId: userId,
        shipping: shipping,
        street: street,
        quantity: quantity,
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Nepodařilo se vytvořit platební relaci" });
  }
};
