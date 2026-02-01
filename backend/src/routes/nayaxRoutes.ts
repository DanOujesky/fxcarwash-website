import express from "express";
import { refreshCards } from "../controllers/nayaxController";
import { softAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/refreshCards", softAuth, refreshCards);

export default router;
