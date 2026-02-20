import Stripe from "stripe";
import { prisma } from "../config/db.js";
import {
  sendOrderEmailToUser,
  sendOrderEmailToCompany,
} from "../mails/orderMail.js";
import { Request, Response } from "express";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const NAYAX_BASE_URL = process.env.NAYAX_BASE_URL!;
const NAYAX_TOKEN = process.env.NAYAX_TOKEN!;
const OPERATOR_ID = process.env.NAYAX_OPERATOR_ID!;

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret)
    return res.status(400).send("Webhook Error: Missing signature/secret");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature failure: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) return res.status(400).send("No orderId in metadata");

  try {
    await prisma.$transaction(
      async (tx) => {
        // Načti objednávku, uživatele a položky
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true, user: true },
        });

        if (!order || !order.user || order.status === "PAID") return;

        // Označ objednávku jako zaplacenou
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // Projdi všechny položky
        for (const item of order.items) {
          if (!item.credit) continue;

          if (item.delivery) {
            // Fyzické karty – vytvořit nové karty
            const quantity = item.quantity || 1;
            const lastCard = await tx.card.findFirst({
              orderBy: { createdAt: "desc" },
            });
            let nextNumber = lastCard ? parseInt(lastCard.number) + 1 : 10;

            for (let i = 0; i < quantity; i++) {
              if (nextNumber > 10000) {
                console.error("Dosáhli jsme maximálního limitu čísel karet!");
                break;
              }

              // Vytvoření karty v DB
              const newCard = await tx.card.create({
                data: {
                  userId: order.userId,
                  number: String(nextNumber),
                  credit: item.credit,
                  identifier: `card-${order.id}-${nextNumber}`,
                  status: "ACTIVE",
                },
              });

              // Top-up do Nayaxu
              try {
                const topUpResponse = await axios.post(
                  `${NAYAX_BASE_URL}/operational/v1/cards`,
                  {
                    ActorID: OPERATOR_ID,
                    MemberID: order.user.memberId,
                    CardUniqueIdentifier: newCard.identifier,
                    Status: 1,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${NAYAX_TOKEN}`,
                      "Content-Type": "application/json",
                    },
                  },
                );

                await tx.creditLog.create({
                  data: {
                    cardId: newCard.id,
                    memberId: order.user.memberId,
                    amount: item.credit,
                    balanceAfter: item.credit, // po vytvoření karty se rovná top-upu
                    createdAt: new Date(),
                  },
                });
              } catch (nayaxError) {
                console.error("Nayax card creation/top-up failed:", nayaxError);
              }

              nextNumber++;
            }
          } else {
            // Non-delivery – existující karta
            if (!item.cardNumber) {
              console.error("Missing cardNumber for credit item");
              continue;
            }

            const card = await tx.card.findUnique({
              where: { number: item.cardNumber },
            });
            if (!card) {
              console.error("Card not found for top-up:", item.cardNumber);
              continue;
            }

            // Top-up Nayax + aktualizace DB
            try {
              const topUpResponse = await axios.post(
                `${NAYAX_BASE_URL}/operational/v1/topup`,
                {
                  CardUniqueIdentifier: card.identifier,
                  Amount: item.credit,
                  ActorID: OPERATOR_ID,
                },
                {
                  headers: {
                    Authorization: `Bearer ${NAYAX_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                },
              );

              const newBalance = topUpResponse.data.Balance;

              await tx.card.update({
                where: { id: card.id },
                data: { credit: newBalance },
              });

              await tx.creditLog.create({
                data: {
                  cardId: card.id,
                  memberId: order.user.memberId,
                  amount: item.credit,
                  balanceAfter: newBalance,
                  createdAt: new Date(),
                },
              });
            } catch (nayaxError) {
              console.error("Nayax top-up failed:", nayaxError);
            }
          }
        }

        // Emailové notifikace
        try {
          await sendOrderEmailToUser(order.user, order);
          await sendOrderEmailToCompany(order.user, order);
        } catch (emailError) {
          console.error("Email failed but payment is saved:", emailError);
        }
      },
      { timeout: 20000 },
    );

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook DB/Nayax transaction error:", err);
    res.status(500).send("Database/Nayax Update Failed");
  }
};
