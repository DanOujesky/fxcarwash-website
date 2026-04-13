import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";

const BASE_URL = process.env.NAYAX_BASE_URL;
const NAYAX_TOKEN = process.env.NAYAX_TOKEN;
const ACTOR_ID = Number(process.env.NAYAX_ACTOR_ID);

export const fetchNayax = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${NAYAX_TOKEN}`,
  };

  logger.info(
    { url, method: options.method || "GET" },
    "Nayax API → odesílám request",
  );

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  const responseText = await response.text();

  if (!response.ok) {
    logger.error(
      {
        url,
        status: response.status,
        responseBody: responseText?.substring(0, 2000),
      },
      "Nayax API ← chyba",
    );
    throw new Error(
      `Nayax API Error [${response.status}]: ${responseText || response.statusText}`,
    );
  }

  // Handle empty responses (204 No Content etc.)
  if (!responseText || !responseText.trim()) {
    logger.info({ url, status: response.status }, "Nayax API ← prázdná odpověď");
    return null;
  }

  try {
    const parsed = JSON.parse(responseText);
    logger.info(
      {
        url,
        status: response.status,
        hasCardDetails: !!parsed?.CardDetails,
        cardID: parsed?.CardDetails?.CardID ?? null,
      },
      "Nayax API ← odpověď OK",
    );
    return parsed;
  } catch {
    logger.warn(
      { url, responseText: responseText.substring(0, 500) },
      "Nayax API ← odpověď není JSON",
    );
    return responseText;
  }
};

export const getAvailableCardCount = async (): Promise<number> => {
  return prisma.card.count({
    where: { userId: null, status: "IN_STOCK" },
  });
};

export const assignCardFromPool = async (tx: any, userId: string) => {
  const card = await tx.card.findFirst({
    where: { userId: null, status: "IN_STOCK" },
    orderBy: { createdAt: "asc" },
  });

  if (!card) return null;

  await tx.card.update({
    where: { id: card.id, userId: null, status: "IN_STOCK" },
    data: { userId },
  });

  return card;
};

export const getCardByIdentifier = async (identifier: string) => {
  return fetchNayax(
    `/operational/v1/cards?CardUniqueIdentifier=${encodeURIComponent(identifier)}`,
    { method: "GET" },
  );
};

export const createCardInNayax = async (
  user: any,
  credit: number,
  card: any,
) => {
  const requestBody = {
    CardDetails: {
      ActorID: ACTOR_ID,
      CardUniqueIdentifier: card.identifier,
      CardDisplayNumber: card.number,
      CardTypeID: 33,
      PhysicalTypeID: 30000530,
      Notes: null,
      Status: 1,
      ExternalApplicationUserID: null,
    },
    CardHolderDetails: {
      CardHolderName: `${user.firstName} ${user.lastName}`,
      UserIdentity: null,
      CountryID: null,
      MobileNumber: user.phone || null,
      Email: user.email,
      MemberTypeID: null,
    },
    CardCreditAttributes: {
      CurrencyID: null,
      Credit: credit,
      RevalueCredit: 0,
      CreditTypeMoneyBit: true,
      CreditAccumulateBit: true,
      CreditSingleUseBit: false,
      RevalueCashBit: true,
      RevalueCreditCardBit: true,
      AmountMonthlyReload: 0,
      TransactionsMonthlyReload: 0,
      DiscountTypeBit: 0,
      DiscountValue: 0,
    },
    CardCreditLimits: {
      AmountDailyLimit: 0,
      AmountWeeklyLimit: 0,
      AmountMonthlyLimit: 0,
      TransactionsDailyLimit: 0,
      TransactionsWeeklyLimit: 0,
      TransactionsMonthlyLimit: 0,
      DiscountTransactionsTotalLimit: 0,
      MaxRevalueAmountLimit: 0,
      WeekDayLimitEnabledBit: false,
      WeekDayAmountLimit: "0",
      WeekDayTransactionLimit: "0",
    },
    CardDateRules: {
      ActivationDate: null,
      ExpirationDate: null,
      RevalueExpirationDate: null,
      SetSingleUseDate: null,
      RemoveSingleUseDate: null,
    },
  };
  // NOTE: GroupLocationLimits and CardRevalueRewardRules intentionally omitted —
  // sending them (even as []) causes Nayax to throw "Card Groups items is not the same as server"

  logger.info(
    {
      cardIdentifier: card.identifier,
      cardNumber: card.number,
      actorId: ACTOR_ID,
      credit,
      email: user.email,
    },
    "Nayax: vytváříme kartu — request body",
  );

  return fetchNayax(`/operational/v2/cards`, {
    method: "POST",
    body: JSON.stringify(requestBody),
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

  const requestBody = {
    CardDetails: {
      ...existingCard.CardDetails,
      Status: 1,
    },
    CardHolderDetails: {
      ...existingCard.CardHolderDetails,
      CardHolderName: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      MobileNumber: user.phone || null,
      MemberTypeID: null,
    },
    CardCreditAttributes: {
      ...existingCard.CardCreditAttributes,
      Credit: credit,
    },
    CardCreditLimits: existingCard.CardCreditLimits || {},
    CardDateRules: existingCard.CardDateRules || null,
    CardRevalueRewardRules: existingCard.CardRevalueRewardRules || null,
    GroupLocationLimits: existingCard.GroupLocationLimits || null,
  };

  logger.info(
    {
      cardId: card.cardId,
      cardIdentifier: card.identifier,
      credit,
    },
    "Nayax: aktualizujeme kartu — request body",
  );

  return fetchNayax(`/operational/v2/cards/${card.cardId}`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
  });
};

export const createOrUpdateCardInNayax = async (
  user: any,
  credit: number,
  card: any,
) => {
  try {
    logger.info(
      {
        cardId: card.id,
        cardIdentifier: card.identifier,
        cardNumber: card.number,
        existingCardId: card.cardId,
        credit,
        userEmail: user.email,
      },
      "createOrUpdateCardInNayax: start",
    );

    // ── LOOKUP ─────────────────────────────────────────────────────────────
    let existingCard: any = null;
    try {
      const existingCardResponse = await getCardByIdentifier(card.identifier);

      logger.info(
        {
          cardIdentifier: card.identifier,
          responseIsArray: Array.isArray(existingCardResponse),
          responseLength: Array.isArray(existingCardResponse)
            ? existingCardResponse.length
            : "N/A",
          responseType: typeof existingCardResponse,
        },
        "Nayax lookup: výsledek",
      );

      if (Array.isArray(existingCardResponse) && existingCardResponse.length > 0) {
        existingCard = existingCardResponse[0];
      }
    } catch (lookupErr: any) {
      if (lookupErr.message?.includes("[404]")) {
        logger.info(
          { cardIdentifier: card.identifier },
          "Karta nenalezena v Nayax (404) — vytvoříme novou",
        );
      } else {
        logger.error(
          { cardIdentifier: card.identifier, error: lookupErr.message },
          "Nayax lookup: neočekávaná chyba",
        );
        throw lookupErr;
      }
    }

    const cardExists = !!existingCard;
    let resolvedNayaxCardId: string;

    if (!cardExists) {
      // ── CREATE ───────────────────────────────────────────────────────────
      logger.info(
        { cardIdentifier: card.identifier },
        "Karta neexistuje v Nayax — vytváříme novou",
      );

      const createResponse = await createCardInNayax(user, credit, card);

      logger.info(
        {
          cardIdentifier: card.identifier,
          responseCardID: createResponse?.CardDetails?.CardID,
          responseStatus: createResponse?.CardDetails?.Status,
          responseCredit: createResponse?.CardCreditAttributes?.Credit,
        },
        "Nayax CREATE: odpověď",
      );

      let cardIdFromResponse = createResponse?.CardDetails?.CardID;

      // Fallback: re-fetch from Nayax if POST didn't return CardID
      if (cardIdFromResponse == null) {
        logger.warn(
          { cardIdentifier: card.identifier },
          "CREATE response missing CardID — re-fetching",
        );
        const refetch = await getCardByIdentifier(card.identifier);
        const refetchedCard = Array.isArray(refetch) ? refetch[0] : refetch;
        cardIdFromResponse = refetchedCard?.CardDetails?.CardID;

        logger.info(
          { cardIdentifier: card.identifier, refetchedCardID: cardIdFromResponse },
          "Re-fetch výsledek",
        );
      }

      if (cardIdFromResponse == null) {
        throw new Error(
          `Cannot resolve Nayax CardID for newly created card (identifier: ${card.identifier})`,
        );
      }

      resolvedNayaxCardId = String(cardIdFromResponse);
    } else {
      // ── UPDATE ───────────────────────────────────────────────────────────
      const knownCardId =
        card.cardId ?? existingCard?.CardDetails?.CardID;

      if (!knownCardId) {
        throw new Error(
          `Card exists in Nayax but CardID is missing (identifier: ${card.identifier})`,
        );
      }

      logger.info(
        { cardIdentifier: card.identifier, nayaxCardId: knownCardId },
        "Karta existuje v Nayax — aktualizujeme",
      );

      const updateResponse = await updateCardInNayax(
        user,
        credit,
        { ...card, cardId: knownCardId },
        existingCard,
      );

      // Use CardID from update response if available, otherwise use pre-known ID
      resolvedNayaxCardId = String(
        updateResponse?.CardDetails?.CardID ?? knownCardId,
      );
    }

    // ── PERSIST TO DB ──────────────────────────────────────────────────────
    logger.info(
      {
        cardDbId: card.id,
        cardIdentifier: card.identifier,
        resolvedNayaxCardId,
        credit,
      },
      "Ukládáme kartu do DB",
    );

    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        cardId: resolvedNayaxCardId,
        email: user.email,
        assignedAt: new Date(),
        status: "ASSIGNED",
        userId: user.id,
        credit: credit,
      },
    });

    logger.info(
      {
        cardDbId: updatedCard.id,
        cardId: updatedCard.cardId,
        status: updatedCard.status,
        credit: updatedCard.credit,
        assignedAt: updatedCard.assignedAt,
      },
      "Karta úspěšně uložena do DB",
    );

    return updatedCard;
  } catch (error: any) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        cardDbId: card.id,
        cardIdentifier: card.identifier,
      },
      "CHYBA: createOrUpdateCardInNayax selhalo",
    );
    throw new Error(`Failed to sync card with Nayax: ${error.message}`);
  }
};

export const addCreditToCard = async (
  cardIdentifier: string,
  credit: number,
) => {
  const data = await fetchNayax(
    `/operational/v1/cards/${encodeURIComponent(cardIdentifier)}/credit/add?CardCredit=${credit}`,
    { method: "POST" },
  );

  logger.info(
    { cardIdentifier, credit, responseValue: data?.value },
    "addCreditToCard: odpověď",
  );

  // Nayax returns { value: <newBalance> }
  if (data?.value != null) return Math.round(data.value);

  // Fallback: re-fetch current balance from Nayax
  logger.warn(
    { cardIdentifier },
    "addCreditToCard: response missing value — re-fetching balance",
  );

  const cardData = await getCardByIdentifier(cardIdentifier);
  const fetched = Array.isArray(cardData) ? cardData[0] : cardData;
  const balance = fetched?.CardCreditAttributes?.Credit;

  if (balance == null) {
    throw new Error(
      `Cannot determine new balance for card ${cardIdentifier} after credit add`,
    );
  }

  return Math.round(balance);
};
