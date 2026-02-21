import { prisma } from "../config/db.js";

const BASE_URL = process.env.NAYAX_BASE_URL;
const NAYAX_TOKEN = process.env.NAYAX_TOKEN;
const ACTOR_ID = process.env.NAYAX_ACTOR_ID;
const fetchNayax = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${NAYAX_TOKEN}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "No error body");
    throw new Error(
      `Nayax API Error [${response.status}]: ${errorBody || response.statusText}`,
    );
  }

  return response.json();
};

export const assignCardFromPool = async (tx: any, userId: string) => {
  const card = await tx.card.findFirst({
    where: {
      userId: null,
      status: "IN_STOCK",
    },
    orderBy: { createdAt: "asc" },
  });

  if (card) {
    return await tx.card.update({
      where: { id: card.id },
      data: { userId, assignedAt: new Date() },
    });
  }

  return null;
};

export const getCardByIdentifier = async (identifier: string) => {
  return fetchNayax(
    `/operational/v1/cards?CardUniqueIdentifier=${identifier}`,
    {
      method: "GET",
    },
  );
};

export const createCardInNayax = async (
  user: any,
  credit: number,
  card: any,
) => {
  return fetchNayax(`/operational/v2/cards`, {
    method: "POST",
    body: JSON.stringify({
      CardDetails: {
        ActorID: ACTOR_ID,
        CardUniqueIdentifier: card.identifier,
        CardDisplayNumber: card.number,
        CardTypeID: 33,
        PhysicalTypeID: 30000530,
        Status: 1,
      },
      CardHolderDetails: {
        CardHolderName: `${user.firstName} ${user.lastName}`,
        MobileNumber: user.phone,
        Email: user.email,
      },
      CardCreditAttributes: { Credit: credit },
      CardCreditLimits: {},
    }),
  });
};

export const updateCardInNayax = async (
  user: any,
  credit: number,
  card: any,
  existingCard: any,
) => {
  if (!card.cardId)
    throw new Error("Missing Nayax CardId for update operation.");

  return fetchNayax(`/operational/v2/cards/${card.cardId}`, {
    method: "PUT",
    body: JSON.stringify({
      CardDetails: {
        ...existingCard.CardDetails,
        Status: 1,
      },
      CardHolderDetails: {
        ...existingCard.CardHolderDetails,
        Email: user.email,
      },
      CardCreditAttributes: {
        ...existingCard.CardCreditAttributes,
        Credit: credit,
      },
      CardCreditLimits: existingCard.CardCreditLimits,
      CardDateRules: existingCard.CardDateRules,
      GroupLocationLimits: existingCard.GroupLocationLimits,
    }),
  });
};

export const createOrUpdateCardInNayax = async (
  user: any,
  credit: number,
  card: any,
) => {
  try {
    const existingCardResponse = await getCardByIdentifier(card.identifier);

    const existingCard = Array.isArray(existingCardResponse)
      ? existingCardResponse[0]
      : null;

    const cardExists = !!existingCard;

    let nayaxResponse;

    if (!cardExists) {
      nayaxResponse = await createCardInNayax(user, credit, card);
    } else {
      const nayaxCardId = card.cardId || existingCard?.CardDetails?.CardID;

      if (!nayaxCardId) {
        throw new Error("Card exists but CardId missing in Nayax response");
      }

      nayaxResponse = await updateCardInNayax(
        user,
        credit,
        {
          ...card,
          cardId: nayaxCardId,
        },
        existingCard,
      );
    }

    return await prisma.card.update({
      where: { id: card.id },
      data: {
        cardId: nayaxResponse?.CardDetails?.CardID,
        email: user.email,
        assignedAt: new Date(),
        status: "ASSIGNED",
        userId: user.id,
        credit: credit,
      },
    });
  } catch (error: any) {
    console.error("Nayax Sync Error:", error);
    throw new Error(`Failed to sync card with Nayax: ${error.message}`);
  }
};

export const addCreditToCard = async (
  cardIdentifier: string,
  credit: number,
) => {
  const data = await fetchNayax(
    `/operational/v1/cards/${cardIdentifier}/credit/add?CardCredit=${credit}`,
    { method: "POST" },
  );
  return data.NewCredit;
};
