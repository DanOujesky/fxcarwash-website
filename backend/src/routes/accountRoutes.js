import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder, getCard } from "../controllers/accountController.js";
import { orderLimiter } from "../utils/authLimiter.js";
import { orderSchema } from "../validators/accountValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/create-order",
  orderLimiter,
  validateRequest(orderSchema),
  authMiddleware,
  createOrder
);

router.get("/get-card", authMiddleware, getCard);

export default router;
