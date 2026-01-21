import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/accountController.js";
import { orderLimiter } from "../utils/authLimiter.js";
import { orderSchema } from "@shared/index";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/create-order",
  orderLimiter,
  validateRequest(orderSchema),
  authMiddleware,
  createOrder,
);

export default router;
