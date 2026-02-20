import express from "express";
import {
  refreshCards,
  createCard,
  deactivateCard,
} from "../controllers/nayaxController";
import { authMiddleware, softAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/refreshCards", authMiddleware, refreshCards);
router.post("/createCards", authMiddleware, createCard);
router.post("/deactivateCard/:cardId", authMiddleware, deactivateCard);

export default router;
