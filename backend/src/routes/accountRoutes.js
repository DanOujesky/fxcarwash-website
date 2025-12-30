import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder } from "../controllers/accountController.js";
import { orderLimiter } from "../utils/authLimiter.js";

const router = express.Router();

router.post("/create-order", orderLimiter, authMiddleware, createOrder);

export default router;
