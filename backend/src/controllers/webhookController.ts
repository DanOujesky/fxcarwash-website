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
  const metaUserId = session.metadata?.userId;

  if (!metaUserId) {
    logger.error(
      { sessionId: session.id },
      "Webhook: chybí userId v metadata",
    );
    return res.status(400).send("Missing metadata");
  }

  try {
    // Idempotency: zkontrolovat jestli objednávka již existuje (duplikátní webhook)
    const existingOrder = await prisma.order.findUnique({
      where: { stripeId: session.id },
    });
    if (existingOrder) {
      logger.info({ sessionId: session.id }, "Webhook: objednávka již zpracována (duplikát)");
      return res.status(200).json({ message: "Already processed" });
    }

    // Načíst dočasná data objednávky
    const checkout = await (prisma as any).pendingCheckout.findUnique({
      where: { id: session.id },
    });

    if (!checkout) {
      logger.error({ sessionId: session.id }, "Webhook: PendingCheckout nenalezena");
      return res.status(200).json({ message: "Checkout not found" });
    }

    if (checkout.userId !== metaUserId) {
      logger.error(
        { sessionId: session.id, metaUserId, checkoutUserId: checkout.userId },
        "Webhook: userId v metadata neodpovídá checkoutu — možný podvod",
      );
      return res.status(400).send("User mismatch");
    }

    const orderData = JSON.parse(checkout.data);

    // Vytvořit objednávku v transakci + smazat PendingCheckout
    const order = await prisma.$transaction(async (tx) => {
      const yearShort = new Date().getFullYear().toString().slice(-2);
      const fullYear = new Date().getFullYear();

      const lastOrder = await tx.order.findFirst({
        where: { orderFullNumber: { startsWith: `${yearShort}FVE` } },
        orderBy: { orderNumberCount: "desc" },
        select: { orderNumberCount: true },
      });

      const nextNumber = (lastOrder?.orderNumberCount ?? 0) + 1;
      const paddedNumber = nextNumber.toString().padStart(4, "0");
      const identifierNumber = `${fullYear}${paddedNumber}`;
      const fullNumber = `${yearShort}FVE${paddedNumber}`;

      const newOrder = await tx.order.create({
        data: {
          userId: checkout.userId,
          totalPrice: orderData.totalPrice,
          orderIdentifier: Number(identifierNumber),
          orderNumberCount: nextNumber,
          orderFullNumber: fullNumber,
          stripeId: session.id,
          status: "PAID",
          address: orderData.address,
          city: orderData.city,
          zipCode: orderData.zipCode,
          country: orderData.country,
          phone: orderData.phone,
          companyName: orderData.companyName,
          companyAddress: orderData.companyAddress,
          companyCity: orderData.companyCity,
          companyDIC: orderData.companyDIC,
          companyICO: orderData.companyICO,
          companyZipCode: orderData.companyZipCode,
          items: {
            create: orderData.items.map((item: any) => ({
              productId: item.productId || null,
              name: item.name,
              price: item.price,
              credit: item.credit,
              quantity: item.quantity,
              delivery: item.delivery,
              cardNumber: item.cardNumber || null,
              shipping: item.shipping || null,
            })),
          },
        },
        include: { items: true, user: true },
      });

      // Smazat dočasná data
      await (tx as any).pendingCheckout.delete({ where: { id: session.id } });

      return newOrder;
    });

    logger.info(
      { orderId: order.id, userId: order.userId },
      "Objednávka vytvořena a označena jako PAID",
    );

    // Zpracovat položky (přiřadit karty, dobít kredit)
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
              { orderId: order.id, itemId: item.id },
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
            { orderId: order.id, cardId: card.id, cardNumber: card.number },
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
              { orderId: order.id, itemId: item.id, cardNumber: item.cardNumber },
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
            { orderId: order.id, cardId: card.id, addedCredit: item.credit, newBalance },
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
            orderId: order.id,
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
          { orderId: order.id, emailIndex: i, error: result.reason },
          "Nepodařilo se odeslat potvrzovací email",
        );
      }
    });

    logger.info({ orderId: order.id }, "Webhook zpracován úspěšně");
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error({ sessionId: session.id, err }, "Kritická chyba při zpracování webhooku");
    res.status(500).send("Internal Server Error");
  }
};
