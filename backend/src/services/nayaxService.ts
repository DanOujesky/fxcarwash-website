import axios, { AxiosError } from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const nayaxApi = axios.create({
  baseURL: process.env.NAYAX_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NAYAX_TOKEN}`,
    "Content-Type": "application/json",
  },
});

const OPERATOR_ID = process.env.NAYAX_OPERATOR_ID!;

export const ensureMemberExists = async (user: any) => {
  if (user.memberId) return user.memberId;

  try {
    const response = await nayaxApi.post("/operational/v1/members", {
      ActorID: OPERATOR_ID,
      FirstName: user.firstName,
      LastName: user.lastName,
      Email: user.email,
      Status: 1,
    });

    const memberId = response.data.MemberID;

    await prisma.user.update({
      where: { id: user.id },
      data: { memberId },
    });

    return memberId;
  } catch (error) {
    console.error(
      "Nayax: Failed to create member",
      (error as AxiosError).response?.data || (error as Error).message,
    );
    throw new Error("Nayax member creation failed");
  }
};

export const assignCardFromPool = async (tx: any, userId: string) => {
  const availableCard = await tx.card.findFirst({
    where: { userId: null },
    orderBy: { id: "asc" },
  });

  if (!availableCard) throw new Error("No available cards in pool");

  return await tx.card.update({
    where: { id: availableCard.id },
    data: { userId },
  });
};

export const createCardInNayax = async (
  memberId: string,
  identifier: string,
) => {
  try {
    await nayaxApi.post("/operational/v1/cards", {
      ActorID: OPERATOR_ID,
      MemberID: memberId,
      CardUniqueIdentifier: identifier,
      Status: 1,
    });
  } catch (error) {
    console.error(
      "Nayax: Failed to create card",
      (error as AxiosError).response?.data,
    );
    throw error;
  }
};

export const topupCardInNayax = async (identifier: string, amount: number) => {
  try {
    const response = await nayaxApi.post("/operational/v1/topup", {
      CardUniqueIdentifier: identifier,
      Amount: amount,
      ActorID: OPERATOR_ID,
    });
    return response.data.Balance;
  } catch (error) {
    console.error("Nayax: Topup failed", (error as AxiosError).response?.data);
    throw error;
  }
};
