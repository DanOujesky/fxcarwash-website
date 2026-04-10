import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";
import { sendWaitlistAvailabilityEmail } from "../mails/orderMail.js";

export const joinWaitlist = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Uživatel není autentizován" });
  }

  const { email, firstName, lastName, id: userId } = req.user as any;

  try {
    const existing = await prisma.cardWaitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return res
        .status(200)
        .json({ message: "Již jste v pořadníku.", alreadyJoined: true });
    }

    await prisma.cardWaitlist.create({
      data: { email, firstName, lastName, userId },
    });

    logger.info({ email }, "Uživatel přidán do pořadníku na karty");
    return res
      .status(201)
      .json({ message: "Byl(a) jste přidán(a) do pořadníku." });
  } catch (error) {
    logger.error({ error, email }, "Chyba při přidávání do pořadníku");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const notifyWaitlist = async (req: Request, res: Response) => {
  if (!req.user || (req.user as any).role !== "ADMIN") {
    return res.status(403).json({ error: "Přístup odepřen" });
  }

  try {
    const waitlist = await prisma.cardWaitlist.findMany();

    if (waitlist.length === 0) {
      return res.status(200).json({ message: "Pořadník je prázdný.", sent: 0 });
    }

    let sent = 0;
    const errors: string[] = [];

    for (const entry of waitlist) {
      try {
        await sendWaitlistAvailabilityEmail(entry.firstName, entry.email);
        sent++;
      } catch (err) {
        logger.error(
          { err, email: entry.email },
          "Nepodařilo se odeslat email z pořadníku",
        );
        errors.push(entry.email);
      }
    }

    await prisma.cardWaitlist.deleteMany();
    logger.info({ sent }, "Pořadník byl notifikován a vymazán");

    return res.status(200).json({
      message: `Odesláno ${sent} emailů, pořadník byl vymazán.`,
      sent,
      errors,
    });
  } catch (error) {
    logger.error({ error }, "Chyba při notifikaci pořadníku");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
