import express from "express";
import { joinWaitlist, notifyWaitlist } from "../controllers/waitlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/join", authMiddleware, joinWaitlist);
router.post("/notify", authMiddleware, notifyWaitlist);

export default router;
