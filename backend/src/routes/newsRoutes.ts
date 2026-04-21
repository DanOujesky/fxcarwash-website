import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, text: true, images: true },
    });
    const mapped = news.map((n) => ({
      id: n.id,
      title: n.title,
      text: n.text,
      image: n.images,
    }));
    return res.json(mapped);
  } catch {
    return res.status(500).json({ error: "Chyba serveru" });
  }
});

export default router;
