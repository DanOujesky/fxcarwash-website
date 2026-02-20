import { Response, Request } from "express";
import { prisma } from "../config/db.js";
import { nayaxApi } from "../services/nayaxService.js";

export const refreshCards = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { memberId: true },
    });

    if (!user?.memberId) {
      return res.status(404).json({ message: "User or MemberID not found" });
    }

    const { data } = await nayaxApi.get("/operational/v1/cards", {
      params: { MemberID: user.memberId },
    });

    const nayaxCards = data.Cards || [];

    const identifiers = nayaxCards.map((c: any) => c.CardUniqueIdentifier);
    const existingCards = await prisma.card.findMany({
      where: { identifier: { in: identifiers } },
    });

    const updates = nayaxCards
      .map((nCard: any) => {
        const dbCard = existingCards.find(
          (c) => c.identifier === nCard.CardUniqueIdentifier,
        );
        if (dbCard) {
          return prisma.card.update({
            where: { id: dbCard.id },
            data: { credit: nCard.Balance },
          });
        }
        return null;
      })
      .filter(Boolean);

    const updatedCards = await prisma.$transaction(updates as any);

    return res.status(200).json({
      message: "Cards refreshed successfully",
      count: updatedCards.length,
    });
  } catch (error: any) {
    console.error("Refresh Error:", error.message);
    return res.status(500).json({ message: "Failed to refresh cards" });
  }
};

export const toggleCardStatus = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params as { cardId: string };

    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card)
      return res.status(404).json({ message: "Karta nebyla nalezena" });
    if (card.userId !== req.user?.id)
      return res.status(403).json({ message: "Neoprávněný přístup" });

    const isBlocking = card.status !== "BLOCKED";
    const nextDbStatus = isBlocking ? "BLOCKED" : "ASSIGNED";
    const nextNayaxStatus = isBlocking ? 0 : 1;

    try {
      await nayaxApi.put(`/operational/v1/cards/${card.identifier}`, {
        Status: nextNayaxStatus,
      });
    } catch (apiError: any) {
      console.error(
        `Nayax API toggle failure (to ${nextDbStatus}):`,
        apiError.response?.data || apiError.message,
      );
      return res.status(502).json({
        message: "Nepodařilo se změnit stav karty u poskytovatele (Nayax)",
        details: apiError.response?.data,
      });
    }

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: { status: nextDbStatus },
    });

    return res.status(200).json({
      message: `Karta byla úspěšně ${isBlocking ? "zablokována" : "aktivována"}`,
      status: updatedCard.status,
    });
  } catch (error: any) {
    console.error("Toggle Status Error:", error.message);
    return res.status(500).json({ message: "Chyba při přepínání stavu karty" });
  }
};
