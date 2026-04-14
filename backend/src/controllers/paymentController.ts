import Stripe from "stripe";
import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";
import {
  SHIPPING_FEES,
  LOW_STOCK_THRESHOLD,
  ALLOWED_CREDITS,
} from "../constants/products.js";
import { sendLowStockAlert } from "../mails/orderMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function resolveItemPrice(item: any, userDiscount: number) {
  const credit = Number(item.credit);

  let baseCredit = credit;

  if (!ALLOWED_CREDITS.includes(credit as any) && userDiscount > 0) {
    const derived = Math.round(credit / (1 + userDiscount / 100));
    if (ALLOWED_CREDITS.includes(derived as any)) {
      baseCredit = derived;
    }
  }

  if (!ALLOWED_CREDITS.includes(baseCredit as any)) {
    return null;
  }

  const shippingFee = item.delivery ? (SHIPPING_FEES[item.shipping] ?? 0) : 0;
  const safePrice = baseCredit + shippingFee;

  const safeCredit = Math.round(baseCredit * (1 + userDiscount / 100));

  return { safeName: item.name, safePrice, safeCredit };
}

export const payment = async (req: Request, res: Response) => {
  const { order } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Uživatel není autentizován" });
  }

  const userId = req.user.id;
  const userDiscount = req.user.discount ?? 0;

  const resolvedItems: Array<{
    original: any;
    safeName: string;
    safePrice: number;
    safeCredit: number | null;
  }> = [];

  for (const item of order.items) {
    const resolved = resolveItemPrice(item, userDiscount);
    if (!resolved) {
      return res
        .status(400)
        .json({ error: `Neplatná položka objednávky: ${item.name}` });
    }
    resolvedItems.push({ original: item, ...resolved });
  }

  const serverTotal = resolvedItems.reduce(
    (sum, i) => sum + i.safePrice * (Number(i.original.quantity) || 1),
    0,
  );

  const deliveryCount = resolvedItems
    .filter((i) => i.original.delivery)
    .reduce((sum, i) => sum + (Number(i.original.quantity) || 1), 0);

  if (deliveryCount > 0) {
    const availableCards = await prisma.card.count({
      where: { userId: null, status: "IN_STOCK" },
    });

    if (availableCards < deliveryCount) {
      logger.error(
        { availableCards, needed: deliveryCount },
        "Nedostatek karet v poolu",
      );
      return res.status(400).json({
        error:
          availableCards === 0
            ? "Karty momentálně nejsou na skladě."
            : `Na skladě zbývá pouze ${availableCards} ${availableCards === 1 ? "karta" : availableCards < 5 ? "karty" : "karet"}.`,
        availableCards,
        outOfStock: true,
      });
    }

    if (availableCards - deliveryCount <= LOW_STOCK_THRESHOLD) {
      logger.warn(
        { remaining: availableCards - deliveryCount },
        "Nízká zásoba karet",
      );
      sendLowStockAlert(availableCards - deliveryCount).catch((err: any) =>
        logger.error(
          { err },
          "Nepodařilo se odeslat upozornění na nízkou zásobu",
        ),
      );
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        phone: order.phone,
        address: order.address || undefined,
        city: order.city || undefined,
        zipCode: order.zipCode || undefined,
        country: order.country || undefined,
        companyName: order.companyName || undefined,
        companyICO: order.companyICO || undefined,
        companyDIC: order.companyDIC || undefined,
        companyAddress: order.companyAddress || undefined,
        companyCity: order.companyCity || undefined,
        companyZipCode: order.companyZipCode || undefined,
      },
    });

    // Stripe session vytvoříme BEZ uložení objednávky do DB.
    // Objednávka se vytvoří až po potvrzení platby webhookem.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: order.email,
      line_items: resolvedItems.map((i) => ({
        price_data: {
          currency: "czk",
          unit_amount: Math.round(i.safePrice * 100),
          product_data: { name: i.safeName },
        },
        quantity: Number(i.original.quantity) || 1,
      })),
      mode: "payment",
      metadata: {
        userId: String(userId),
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    // Uložíme data objednávky dočasně — webhook je použije po zaplacení
    await (prisma as any).pendingCheckout.create({
      data: {
        id: session.id,
        userId: userId as string,
        data: JSON.stringify({
          totalPrice: serverTotal,
          address: order.address || null,
          city: order.city || null,
          zipCode: order.zipCode || null,
          country: order.country || null,
          phone: order.phone || null,
          companyName: order.companyName || null,
          companyAddress: order.companyAddress || null,
          companyCity: order.companyCity || null,
          companyDIC: order.companyDIC || null,
          companyICO: order.companyICO || null,
          companyZipCode: order.companyZipCode || null,
          items: resolvedItems.map((i) => ({
            productId: i.original.id || null,
            name: i.safeName,
            price: i.safePrice,
            credit: i.safeCredit,
            quantity: Number(i.original.quantity) || 1,
            delivery: !!i.original.delivery,
            cardNumber: i.original.cardNumber || null,
            shipping: i.original.shipping || null,
          })),
        }),
      },
    });

    logger.info(
      { sessionId: session.id, total: serverTotal, userId },
      "Stripe session zahájena, čeká na platbu",
    );

    res.json({ url: session.url });
  } catch (error) {
    logger.error({ error, userId }, "Chyba při inicializaci platby");
    res.status(500).json({ error: "Chyba při inicializaci platby" });
  }
};
