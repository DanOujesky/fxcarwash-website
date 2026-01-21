import express from "express";
import { paymentSchema } from "@shared/index";
import { payment } from "../controllers/paymentController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  validateRequest(paymentSchema),
  payment,
);

export default router;
