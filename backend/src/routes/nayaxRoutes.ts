import express from "express";
import { refreshCards, toggleCardStatus } from "../controllers/nayaxController";
import { authMiddleware, softAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/refreshCards", authMiddleware, refreshCards);
router.post("/toggleCardStatus/:cardId", authMiddleware, toggleCardStatus);

export default router;
