import Stripe from "stripe";
import { prisma } from "../config/db.js";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const payment = async (req: Request, res: Response) => {
  const { cardNumber, credit, action, shipping, street } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Uživatel není autentizován" });
  }

  const userId = req.user.id;
  const amount = Math.round(parseFloat(credit) * 100);

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Neplatná částka" });
  }

  try {
    const card = await prisma.card.findFirst({
      where: { number: cardNumber },
    });

    if (!card) {
      return res.status(404).json({
        error: "Karta s tímto číslem nebyla nalezena",
        cardNotFound: true,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new Error("FRONTEND_URL není definován v .env");
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
        creditsAmount: String(credit),
        action: String(action),
        userId: String(userId),
        shipping: shipping ? String(shipping) : "",
        street: street ? String(street) : "",
      },
      success_url: `${frontendUrl}/payment/success`,
      cancel_url: `${frontendUrl}/payment/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    const err = error as Error;
    console.error("Stripe Error:", err.message);
    res.status(500).json({ error: "Nepodařilo se vytvořit platební relaci" });
  }
};
