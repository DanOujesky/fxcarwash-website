import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import { logger } from "../utils/logger.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Pouze obrázky"));
  },
}).array("images", 10);

export const uploadImages = (req: Request, res: Response) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const files = (req.files as Express.Multer.File[]) ?? [];
    const urls = files.map((f) => f.filename);
    return res.json({ urls });
  });
};

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
      cancelled: 0,
      refunded: 0,
      shipped: 0,
      totalRevenue: 0,
    };

    for (const group of orderGroups) {
      // Nezahrnovat PENDING objednávky (nezaplacené) do statistik
      if (group.status === "PENDING") continue;
      const count = group._count;
      orderStats.total += count;
      if (group.status === "PAID") {
        orderStats.paid = count;
        orderStats.totalRevenue = group._sum.totalPrice ?? 0;
      } else if (group.status === "CANCELLED") orderStats.cancelled = count;
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
      where: { order: { status: { not: "PENDING" } } },
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
      where: { status: { not: "PENDING" } },
      take: 15,
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

const LEGACY_NEWS = [
  {
    title: "Slavnostní otevření mycího centra v sobotu 18.4.2026 od 10 hodin",
    text: "Přijeďte se k nám podívat, klobásy z grilu a nápoje zdarma pro všechny zákazníky do vyčerpání zásob. Rádi se s vámi setkáme osobně. Těšíme se na vás!",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"],
  },
  {
    title: "Online nákup a dobití fx karet",
    text: "Již brzy pro vás spustíme možnost nakoupit si online zvýhodněné věrnostní fx karty.",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"],
  },
  {
    title: "Máme otevřeno!",
    text: "Po týdnu zkušebního provozu máme otevřeno pro všechny zákazníky nonstop. Můžete u nás platit v hotovosti i platební kartou. Mycí centrum je vybaveno měničkou peněz. K dispozici je výkonný vysavač a možnost doplnění nemrznoucí směsi do ostřikovačů ( -20 °C).",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"],
  },
  {
    title: "Otevření se blíží",
    text: "Už finišujeme, ladíme poslední detaily a testujeme kvalitu mytí pro 100% spokojenost našich budoucích zákazníků. Předběžný termín otevření mycího centra je 17.12.2025.",
    images: ["Image-10.jpg", "Image-12.jpg", "Image-16.jpg", "Image-13.jpg", "Image-15.jpg"],
  },
  {
    title: "Práce finišují. Plán dokončení: prosinec 2025",
    text: "Vše běží dle plánu a v prosinci 2025 bychom měli mít kompletně hotovo. Čeká nás dodávka samotné konstrukce mycího centra a její napojení na sítě. Finalizujeme také úpravy okolí, které bychom Vám rádi zpříjemnili. O termínu otevření Vás budeme brzy informovat.",
    images: ["IMG_2523.jpg", "image_3.jpg", "image_1.jpg", "image_2.jpg", "image_5.jpg"],
  },
  {
    title: "Zahájení výstavby mycího centra",
    text: "Projekt výstavby mycího centra v Horní Bříze začal v průběhu roku 2024, kdy jsme se intenzivně věnovali výběru kvalitního a spolehlivého partnera pro realizaci výstavby. Tímto partnerem se pro nás stala společnost MY WASH Technology s.r.o. Stavební práce přímo na místě začaly v létě 2025 a již koncem srpna se podařilo dokončit a kompletně připravit základy. Už to pro Vás chystáme!",
    images: ["car-news-image-2.jpg", "car-news-image-1.jpg"],
  },
];

export const seedLegacyNews = async (req: Request, res: Response) => {
  try {
    const creatorId = req.user?.id;
    if (!creatorId) return res.status(401).json({ error: "Unauthorized" });

    const existing = await prisma.news.count();
    if (existing > 0) return res.json({ skipped: true, message: "DB již obsahuje novinky" });

    for (const item of LEGACY_NEWS) {
      await prisma.news.create({
        data: {
          title: item.title,
          text: item.text,
          imagePath: JSON.stringify(item.images),
          creatorId,
        },
      });
    }
    return res.json({ imported: LEGACY_NEWS.length });
  } catch (error) {
    logger.error({ error }, "seedLegacyNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, text: true, imagePath: true, createdAt: true },
    });
    const mapped = news.map((n) => ({
      id: n.id,
      title: n.title,
      text: n.text,
      image: (() => { try { return JSON.parse(n.imagePath); } catch { return [n.imagePath]; } })(),
      createdAt: n.createdAt,
    }));
    return res.json(mapped);
  } catch (error) {
    logger.error({ error }, "getNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, text, images } = req.body as { title: string; text: string; images: string[] };
    if (!title?.trim() || !text?.trim()) {
      return res.status(400).json({ error: "Název a text jsou povinné" });
    }
    const creatorId = req.user?.id;
    if (!creatorId) return res.status(401).json({ error: "Unauthorized" });

    const news = await prisma.news.create({
      data: {
        title: title.trim(),
        text: text.trim(),
        imagePath: JSON.stringify(Array.isArray(images) && images.length ? images : []),
        creatorId,
      },
    });
    return res.json({ success: true, id: news.id });
  } catch (error) {
    logger.error({ error }, "createNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, text, images } = req.body as { title: string; text: string; images: string[] };
    if (!title?.trim() || !text?.trim()) {
      return res.status(400).json({ error: "Název a text jsou povinné" });
    }
    await prisma.news.update({
      where: { id: String(id) },
      data: {
        title: title.trim(),
        text: text.trim(),
        imagePath: JSON.stringify(Array.isArray(images) ? images : []),
      },
    });
    return res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "updateNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({ where: { id: String(id) } });
    return res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "deleteNews error");
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
