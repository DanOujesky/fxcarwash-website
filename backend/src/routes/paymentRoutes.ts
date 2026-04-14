import express from "express";
import { paymentSchema } from "@shared/index.js";
import { payment, getOrderBySession } from "../controllers/paymentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { orderLimiter } from "../utils/authLimiter.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  orderLimiter,
  authMiddleware,
  validateRequest(paymentSchema),
  payment,
);

router.get("/order-by-session/:sessionId", authMiddleware, getOrderBySession);

export default router;
