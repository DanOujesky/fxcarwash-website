import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAdminStats, importCards, reclaimCard, getNews, createNews, deleteNews, uploadImages } from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminStats);
router.post("/cards/import", importCards);
router.post("/cards/reclaim", reclaimCard);
router.get("/news", getNews);
router.post("/news", createNews);
router.delete("/news/:id", deleteNews);
router.post("/news/upload", uploadImages);

export default router;
