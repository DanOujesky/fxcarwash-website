import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const cardGroups = await prisma.card.groupBy({
      by: ["status"],
      _count: true,
    });

    const cardStats = {
      inStock: 0,
      assigned: 0,
      blocked: 0,
      lost: 0,
      total: 0,
    };

    for (const group of cardGroups) {
      const count = group._count;
      cardStats.total += count;
      if (group.status === "IN_STOCK") cardStats.inStock = count;
      else if (group.status === "ASSIGNED") cardStats.assigned = count;
      else if (group.status === "BLOCKED") cardStats.blocked = count;
      else if (group.status === "LOST") cardStats.lost = count;
    }

    const orderGroups = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: { totalPrice: true },
    });

    const orderStats = {
      total: 0,
      paid: 0,
      pending: 0,
      cancelled: 0,
      refunded: 0,
      shipped: 0,
      totalRevenue: 0,
    };

    for (const group of orderGroups) {
      const count = group._count;
      orderStats.total += count;
      if (group.status === "PAID") {
        orderStats.paid = count;
        orderStats.totalRevenue = group._sum.totalPrice ?? 0;
      } else if (group.status === "PENDING") orderStats.pending = count;
      else if (group.status === "CANCELLED") orderStats.cancelled = count;
      else if (group.status === "REFUNDED") orderStats.refunded = count;
      else if (group.status === "SHIPPED") orderStats.shipped = count;
    }

    const usersTotal = await prisma.user.count();
    const newLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ["name"],
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { name: "desc" } },
      take: 5,
    });

    const topProducts = topProductsRaw.map((p) => ({
      name: p.name,
      count: p._count,
      revenue: p._sum.price ?? 0,
    }));

    const recentOrdersRaw = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } },
    });

    const recentOrders = recentOrdersRaw.map((o) => ({
      orderFullNumber: o.orderFullNumber,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      userEmail: o.user.email,
    }));

    const creditAggregate = await prisma.creditLog.aggregate({
      _sum: { amount: true },
      _count: true,
    });

    const totalCreditIssued = creditAggregate._sum.amount ?? 0;
    const creditCount = creditAggregate._count;
    const avgCreditPerOrder = creditCount > 0 ? Math.round(totalCreditIssued / creditCount) : 0;

    return res.json({
      cards: cardStats,
      orders: orderStats,
      users: {
        total: usersTotal,
        newLast30Days,
      },
      topProducts,
      recentOrders,
      creditStats: {
        totalCreditIssued,
        avgCreditPerOrder,
      },
    });
  } catch (error) {
    logger.error({ error }, "getAdminStats error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const importCards = async (req: Request, res: Response) => {
  try {
    const { csv } = req.body as { csv: string };

    if (!csv || typeof csv !== "string") {
      return res.status(400).json({ error: "Chybí CSV data" });
    }

    const lines = csv
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let imported = 0;
    let skipped = 0;

    for (const line of lines) {
      if (line.toLowerCase().startsWith("number")) {
        continue;
      }

      const parts = line.split(",");
      if (parts.length < 2) {
        skipped++;
        continue;
      }

      const number = parts[0].trim();
      const identifier = parts[1].trim();

      if (!number || !identifier) {
        skipped++;
        continue;
      }

      try {
        await prisma.card.upsert({
          where: { number },
          create: { number, identifier, status: "IN_STOCK" },
          update: {},
        });
        imported++;
      } catch {
        skipped++;
      }
    }

    return res.json({ imported, skipped });
  } catch (error) {
    logger.error({ error }, "importCards error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const reclaimCard = async (req: Request, res: Response) => {
  try {
    const { cardNumber } = req.body as { cardNumber: string };

    if (!cardNumber) {
      return res.status(400).json({ error: "Chybí číslo karty" });
    }

    const card = await prisma.card.findUnique({
      where: { number: cardNumber },
    });

    if (!card) {
      return res.status(404).json({ error: "Karta nenalezena" });
    }

    if (!card.userId) {
      return res.status(400).json({ error: "Karta není přiřazena žádnému uživateli" });
    }

    const updatedCard = await prisma.card.update({
      where: { number: cardNumber },
      data: {
        status: "IN_STOCK",
        userId: null,
        assignedAt: null,
        credit: 0,
        email: null,
        name: null,
        cardId: null,
      },
    });

    return res.json({ success: true, card: updatedCard });
  } catch (error) {
    logger.error({ error }, "reclaimCard error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
