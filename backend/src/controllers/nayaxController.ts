import { Response, Request } from "express";
import { prisma } from "../config/db.js";
import { fetchNayax } from "../services/nayaxService.js";
import { logger } from "../utils/logger.js";

export const refreshCards = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cards = await fetchNayax(
      `/operational/v1/cards?CardEmail=${encodeURIComponent(user.email ?? "")}`,
      { method: "GET" },
    );

    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: "No cards found for this email" });
    }

    for (const card of cards) {
      await prisma.card.update({
        where: { identifier: card.CardDetails.CardUniqueIdentifier },
        data: { credit: Math.round(card.CardCreditAttributes.Credit) },
      });
    }

    const updatedCards = await prisma.card.findMany({
      where: { userId: user.id },
    });

    logger.info(
      { userId: user.id, count: updatedCards.length },
      "Karty synchronizovány z Nayax",
    );
    res.json({ cards: updatedCards });
  } catch (error: any) {
    logger.error({ error: error.message }, "Chyba při synchronizaci karet");
    res.status(500).json({ error: "Failed to refresh cards" });
  }
};

export const toggleCardStatus = async (req: Request, res: Response) => {
  try {
    const cardNumber = String(req.params.cardNumber);
    const user = req.user;

    if (!/^\d{1,20}$/.test(cardNumber)) {
      return res.status(400).json({ error: "Neplatný formát čísla karty" });
    }

    const card = await prisma.card.findUnique({
      where: { number: cardNumber },
    });

    if (!card || !user) {
      return res.status(404).json({ error: "User or Card not found" });
    }

    if (card.userId !== user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newStatusCode = card.status === "ASSIGNED" ? 2 : 1;
    logger.info(
      { cardNumber, currentStatus: card.status, newStatusCode },
      "Změna stavu karty v Nayax",
    );

    const nayaxResponse = await fetchNayax(
      `/operational/v1/cards/${card.identifier}/status/${newStatusCode}`,
      { method: "POST" },
    );

    if (!nayaxResponse || nayaxResponse.Ok !== true) {
      throw new Error(
        `Nayax API failed: ${nayaxResponse?.Message || "Unknown error"}`,
      );
    }

    const updatedCard = await prisma.card.update({
      where: { number: cardNumber },
      data: {
        status: card.status === "ASSIGNED" ? "BLOCKED" : "ASSIGNED",
      },
    });

    logger.info(
      { cardNumber, newStatus: updatedCard.status },
      "Stav karty úspěšně změněn",
    );

    res.json({
      message: `Card status updated to ${updatedCard.status}`,
      newStatus: updatedCard.status,
    });
  } catch (error: any) {
    logger.error({ error: error.message }, "Chyba při změně stavu karty");
    res
      .status(500)
      .json({ error: "Nepodařilo se změnit stav karty. Zkuste to prosím znovu." });
  }
};
