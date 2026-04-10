import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAdminStats, importCards, reclaimCard } from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminStats);
router.post("/cards/import", importCards);
router.post("/cards/reclaim", reclaimCard);

export default router;
