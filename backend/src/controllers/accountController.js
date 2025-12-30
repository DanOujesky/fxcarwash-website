import {
  noCardsAvailableEmail,
  sendOrderEmailToCompany,
  sendOrderEmailToUser,
} from "../utils/mailer.js";
import { prisma } from "../config/db.js";

export const getCard = async (req, res) => {
  try {
    const availableCard = await prisma.card.findFirst({
      where: { userId: null },
    });

    if (!availableCard) {
      await noCardsAvailableEmail();
      return res.status(404).json({
        error: "Bohužel již nemáme žádné volné karty skladem.",
      });
    }
    return res.status(200).json({
      cardNumber: availableCard.number,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get card",
      status: "failed",
      details: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  const { email, cardNumber, orderData } = req.body;
  const { street, quantity, shipping, credit } = orderData;

  if (shipping === "cp") {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({
        error: "Žádný uživatel nebyl nenalezen s tímto emailem",
      });
    }
    const availableCard = await prisma.card.findUnique({
      where: { number: cardNumber },
    });

    if (!availableCard) {
      return res.status(400).json({
        error: "Žádná karta nebyla nalezena s tímto číslem",
      });
    }

    const updatedCard = await prisma.card.update({
      where: { id: availableCard.id },
      data: { userId: user.id },
    });

    res.status(200).json({
      status: "success",
    });
  } else if (shipping === "op") {
  } else {
    return res.status(400).json({ error: "Shipping is in wrong format" });
  }
};
