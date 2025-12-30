import { sendOrderEmail } from "../utils/mailer.js";
import { prisma } from "../config/db.js";

export const createOrder = async (req, res) => {
  const { user, orderData } = req.body;
  const { street, quantity, shipping } = orderData;

  if (shipping === "cp") {
    try {
      const availableCard = await prisma.card.findFirst({
        where: { userId: null },
      });

      if (!availableCard) {
        return res.status(404).json({
          error: "Bohužel již nemáme žádné volné karty skladem.",
        });
      }

      const updatedCard = await prisma.card.update({
        where: { id: availableCard.id },
        data: { userId: user.id },
      });

      await sendOrderEmail(user);

      res.status(200).json({
        status: "success",
        cardNumber: updatedCard.number,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to send email",
        status: "failed",
        details: error.message,
      });
    }
  } else if (shipping === "op") {
  } else {
    return res.status(400).json({ error: "Shipping is in wrong format" });
  }
};
