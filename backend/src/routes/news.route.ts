import express from "express";
import { authMiddleware } from "../middlewares/authentication.middleware";
import {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller";

const router = express.Router();

router.get("/", getNews);

router.get("/:id", getSingleNews);

router.post("/", authMiddleware, createNews);

router.put("/:id", authMiddleware, updateNews);

router.delete("/:id", authMiddleware, deleteNews);

export default router;
