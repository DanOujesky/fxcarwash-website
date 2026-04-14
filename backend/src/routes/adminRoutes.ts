import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAdminStats, importCards, reclaimCard, getNews, createNews, updateNews, deleteNews, uploadImages, seedLegacyNews } from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminStats);
router.post("/cards/import", importCards);
router.post("/cards/reclaim", reclaimCard);
router.get("/news", getNews);
router.post("/news/seed", seedLegacyNews);
router.post("/news/upload", uploadImages);
router.post("/news", createNews);
router.put("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);

export default router;
