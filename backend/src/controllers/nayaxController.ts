import { Response, Request } from "express";
import { prisma } from "../config/db.js";
import { fetchNayax } from "../services/nayaxService.js";

export const refreshCards = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cards = await fetchNayax(
      `/operational/v1/cards?CardEmail=${user.email}`,
      { method: "GET" },
    );

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: "No cards found for this email" });
    }

    for (const card of cards) {
      await prisma.card.update({
        where: { identifier: card.CardDetails.CardUniqueIdentifier },
        data: {
          credit: card.CardCreditAttributes.Credit,
        },
      });
    }
    const updatedCards = await prisma.card.findMany({
      where: { userId: user.id },
    });

    res.json({ cards: updatedCards });
  } catch (error: any) {
    console.error("Error refreshing cards:", error);
    res.status(500).json({ error: "Failed to refresh cards" });
  }
};

export const toggleCardStatus = async (req: Request, res: Response) => {
  try {
    const { cardNumber } = req.params;
    const user = req.user;

    const card = await prisma.card.findUnique({
      where: { number: String(cardNumber) },
    });

    if (!card || !user) {
      return res.status(404).json({ error: "User or Card not found" });
    }

    if (card.userId !== user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    console.log(
      `/operational/v1/cards/${card.identifier}/status/${card.status === "ASSIGNED" ? 2 : 1}`,
    );

    const nayaxResponse = await fetchNayax(
      `/operational/v1/cards/${card.identifier}/status/${card.status === "ASSIGNED" ? 2 : 1}`,
      { method: "POST" },
    );

    if (!nayaxResponse || nayaxResponse.Ok !== true) {
      throw new Error(
        `Nayax API failed: ${nayaxResponse?.Message || "Unknown error"}`,
      );
    }

    const updatedCard = await prisma.card.update({
      where: { number: String(cardNumber) },
      data: {
        status: card.status === "ASSIGNED" ? "BLOCKED" : "ASSIGNED",
      },
    });

    res.json({
      message: `Card status updated to ${updatedCard.status}`,
      newStatus: updatedCard.status,
    });
  } catch (error: any) {
    console.error("DETAILED ERROR:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to update card status" });
  }
};
