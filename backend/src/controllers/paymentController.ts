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

    const result = await prisma.$transaction(async (tx) => {
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
          userId: userId as string,
          totalPrice: serverTotal,
          orderIdentifier: Number(identifierNumber),
          orderNumberCount: nextNumber,
          orderFullNumber: fullNumber,
          address: order.address,
          city: order.city,
          zipCode: order.zipCode,
          country: order.country,
          phone: order.phone,
          companyName: order.companyName,
          companyAddress: order.companyAddress,
          companyCity: order.companyCity,
          companyDIC: order.companyDIC,
          companyICO: order.companyICO,
          companyZipCode: order.companyZipCode,
          status: "PENDING",
          items: {
            create: resolvedItems.map((i) => ({
              productId: i.original.id || null,
              name: i.safeName,
              price: i.safePrice,
              credit: i.safeCredit,
              quantity: Number(i.original.quantity) || 1,
              delivery: !!i.original.delivery,
              cardNumber: i.original.cardNumber || null,
              shipping: i.original.shipping || null,
            })),
          },
        },
      });

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
          orderId: newOrder.id,
          userId: String(userId),
        },
        success_url: `${process.env.FRONTEND_URL}/payment/success?id=${newOrder.orderIdentifier}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      });

      await tx.order.update({
        where: { id: newOrder.id },
        data: { stripeId: session.id },
      });

      logger.info(
        { orderId: newOrder.id, total: serverTotal, userId },
        "Objednávka vytvořena, Stripe session zahájena",
      );

      return session.url;
    });

    res.json({ url: result });
  } catch (error) {
    logger.error({ error, userId }, "Chyba při inicializaci platby");
    res.status(500).json({ error: "Chyba při inicializaci platby" });
  }
};
