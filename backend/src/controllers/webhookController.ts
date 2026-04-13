import Stripe from "stripe";
import { prisma } from "../config/db.js";
import { Request, Response } from "express";
import {
  addCreditToCard,
  assignCardFromPool,
  createOrUpdateCardInNayax,
} from "../services/nayaxService.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
  sendCardPoolEmptyAlert,
} from "../mails/orderMail.js";
import { logger } from "../utils/logger.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    logger.warn({ err: err.message }, "Stripe webhook - neplatný podpis");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;
  const metaUserId = session.metadata?.userId;

  if (!orderId || !metaUserId) {
    logger.error(
      { sessionId: session.id },
      "Webhook: chybí orderId nebo userId v metadata",
    );
    return res.status(400).send("Missing metadata");
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true },
    });

    if (!order) {
      logger.error({ orderId }, "Webhook: objednávka nenalezena");
      return res.status(200).json({ message: "Order not found" });
    }

    if (order.userId !== metaUserId) {
      logger.error(
        { orderId, metaUserId, actualUserId: order.userId },
        "Webhook: userId v metadata neodpovídá objednávce — možný podvod",
      );
      return res.status(400).send("User mismatch");
    }

    if (order.status === "PAID") {
      logger.info({ orderId }, "Webhook: objednávka již zpracována (duplikát)");
      return res.status(200).json({ message: "Already processed" });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    logger.info(
      { orderId, userId: order.userId },
      "Objednávka označena jako PAID",
    );

    for (const item of order.items) {
      try {
        let card;
        let newBalance: number;

        if (item.delivery) {
          card = await prisma.$transaction(async (tx) => {
            return await assignCardFromPool(tx, order.userId);
          });

          if (!card) {
            logger.error(
              { orderId, itemId: item.id },
              "KRITICKÉ: Žádná karta v poolu — zákazník zaplatil, karta nepřiřazena",
            );
            await sendCardPoolEmptyAlert(order, item).catch((mailErr: any) =>
              logger.error(
                { mailErr },
                "Nepodařilo se odeslat alert na prázdný pool",
              ),
            );
            continue;
          }

          const cardCreated = await createOrUpdateCardInNayax(
            order.user,
            item.credit!,
            card,
          );
          newBalance = cardCreated.credit;

          logger.info(
            { orderId, cardId: card.id, cardNumber: card.number },
            "Nová karta přiřazena a synchronizována s Nayax",
          );
        } else {
          card = await prisma.card.findUnique({
            where: { number: item.cardNumber! },
          });

          if (
            !card ||
            card.userId !== order.userId ||
            !card.identifier ||
            item.credit === null
          ) {
            logger.error(
              { orderId, itemId: item.id, cardNumber: item.cardNumber },
              "KRITICKÉ: Karta nenalezena nebo nepatří uživateli",
            );
            continue;
          }

          newBalance = await addCreditToCard(card.identifier, item.credit);

          await prisma.card.update({
            where: { id: card.id },
            data: { credit: newBalance },
          });

          logger.info(
            { orderId, cardId: card.id, addedCredit: item.credit, newBalance },
            "Kredit dobito na kartu",
          );
        }

        if (item.credit) {
          await prisma.creditLog.create({
            data: {
              cardId: card.id,
              orderId: order.id,
              userId: order.userId,
              amount: item.credit,
              balanceAfter: newBalance!,
            },
          });
        }
      } catch (itemError: any) {
        logger.error(
          {
            orderId,
            itemId: item.id,
            itemName: item.name,
            errorMessage: itemError?.message,
            errorStack: itemError?.stack,
          },
          "KRITICKÉ: Selhalo zpracování položky objednávky",
        );
      }
    }

    const emailResults = await Promise.allSettled([
      sendOrderEmailToUser(order.user, order),
      sendOrderEmailToCompany(order.user, order),
    ]);

    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        logger.error(
          { orderId, emailIndex: i, error: result.reason },
          "Nepodařilo se odeslat potvrzovací email",
        );
      }
    });

    logger.info({ orderId }, "Webhook zpracován úspěšně");
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error({ orderId, err }, "Kritická chyba při zpracování webhooku");
    res.status(500).send("Internal Server Error");
  }
};
