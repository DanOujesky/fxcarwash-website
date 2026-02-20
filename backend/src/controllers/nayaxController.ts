import { Response, Request } from "express";
import axios from "axios";
import { prisma } from "../config/db.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const NAYAX_BASE_URL = process.env.NAYAX_BASE_URL;
const NAYAX_TOKEN = process.env.NAYAX_TOKEN;
const OPERATOR_ID = process.env.NAYAX_OPERATOR_ID;

export const refreshCards = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user || !user.memberId) {
      return res.status(404).json({ message: "User or MemberID not found" });
    }

    const nayaxResponse = await axios.get(
      `${NAYAX_BASE_URL}/operational/v1/cards`,
      {
        headers: {
          Authorization: `Bearer ${NAYAX_TOKEN}`,
          "Content-Type": "application/json",
        },
        params: {
          MemberID: user.memberId,
        },
      },
    );

    const nayaxCards = nayaxResponse.data.Cards || [];

    const updatePromises = nayaxCards.map(async (card: any) => {
      const { CardUniqueIdentifier, CardNumber, Balance } = card;

      const existingCard = await prisma.card.findUnique({
        where: { identifier: CardUniqueIdentifier },
      });

      if (existingCard) {
        return prisma.card.update({
          where: { id: existingCard.id },
          data: { credit: Balance },
        });
      } else {
        console.warn(
          `Card with identifier ${CardUniqueIdentifier} not found in database`,
        );
        return null;
      }
    });

    const updatedCards = await Promise.all(updatePromises);

    return res.status(200).json({
      message: "Cards refreshed successfully",
      cards: updatedCards,
    });
  } catch (error: any) {
    console.error(
      "Error refreshing cards:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Error refreshing cards",
      error: error.response?.data || error.message,
    });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let memberId = user.memberId;

    if (!memberId) {
      const createMemberResponse = await axios.post(
        `${NAYAX_BASE_URL}/operational/v1/members`,
        {
          ActorID: OPERATOR_ID,
          FirstName: user.firstName,
          LastName: user.lastName,
          Email: user.email,
          Status: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${NAYAX_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      memberId = createMemberResponse.data.MemberID;

      await prisma.user.update({
        where: { id: user.id },
        data: { memberId },
      });
    }
    const availableCard = await prisma.card.findFirst({
      where: { userId: null },
      orderBy: { id: "asc" },
    });

    if (!availableCard) {
      return res.status(404).json({ message: "No available cards" });
    }

    const createCardResponse = await axios.post(
      `${NAYAX_BASE_URL}/operational/v1/cards`,
      {
        ActorID: OPERATOR_ID,
        MemberID: memberId,
        CardUniqueIdentifier: availableCard.identifier,
        Status: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${NAYAX_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    await prisma.card.update({
      where: { id: availableCard.id },
      data: { userId: user.id },
    });

    return res.status(201).json({
      message: "Card assigned and created successfully",
    });
  } catch (error: any) {
    console.error("Nayax API error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Error creating card",
      error: error.response?.data || error.message,
    });
  }
};

export const deactivateCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({ message: "Card ID is required" });
    }

    const card = await prisma.card.findUnique({
      where: { id: String(cardId) },
      include: { user: true },
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (!req.user || card.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to deactivate this card" });
    }

    await prisma.$transaction(async (tx) => {
      await axios.put(
        `${NAYAX_BASE_URL}/operational/v1/cards/${card.identifier}`,
        { Status: 0 },
        {
          headers: {
            Authorization: `Bearer ${NAYAX_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      await tx.card.update({
        where: { id: card.id },
        data: { status: "BLOCKED" },
      });
    });

    return res.status(200).json({
      message: "Card deactivated successfully",
      cardId: card.id,
    });
  } catch (error: any) {
    console.error(
      "Error deactivating card:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message: "Error deactivating card",
      error: error.response?.data || error.message,
    });
  }
};
