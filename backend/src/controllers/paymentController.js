import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { prisma } from "../config/db.js";
export const payment = async (req, res) => {
  const { number, money } = req.body;
  const userId = req.user.id;

  try {
    const card = await prisma.card.findFirst({
      where: {
        number: number,
        userId: userId,
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
            product_data: { name: `Dobití karty: ${card.number}` },
            unit_amount: Math.round(money * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: userId,
        cardId: card.id,
        creditsAmount: money,
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
