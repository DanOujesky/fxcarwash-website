import Stripe from "stripe";
import { Request, Response } from "express";
import { prisma } from "../config/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const payment = async (req: Request, res: Response) => {
  const { order } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: "Uživatel není autentizován" });
  }

  const userId = req.user.id;

  try {
    if (order.address) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone: order.phone,
          address: order.address,
          city: order.city,
          zipCode: order.zipCode,
          country: order.country,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId as string,
          totalPrice: Number(order.price),
          address: order.address,
          city: order.city,
          zipCode: order.zipCode,
          country: order.country,
          phone: order.phone,
          status: "PENDING",
          items: {
            create: order.items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              price: Number(item.price),
              credit: item.credit ? Number(item.credit) : null,
              quantity: Number(item.quantity),
              delivery: item.shipping ? true : false,
              cardNumber: item.cardNumber || null,
              shipping: item.shipping || null,
            })),
          },
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: order.email,
        line_items: order.items.map((item: any) => ({
          price_data: {
            currency: "czk",
            unit_amount: Math.round(Number(item.price) * 100),
            product_data: {
              name: item.name,
            },
          },
          quantity: Number(item.quantity || 1),
        })),
        mode: "payment",
        metadata: {
          orderId: newOrder.id,
          userId: String(userId),
        },
        success_url: `${process.env.FRONTEND_URL}/payment/success?id=${newOrder.id}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      });

      await tx.order.update({
        where: { id: newOrder.id },
        data: { stripeId: session.id },
      });

      return session.url;
    });

    res.json({ url: result });
  } catch (error) {
    console.error("Stripe/DB Error:", error);
    res.status(500).json({ error: "Chyba při inicializaci platby" });
  }
};
