import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  requestPasswordReset,
  verifyResetCode,
  setNewPassword,
} from "../controllers/authController.js";
import {
  registerSchema,
  loginSchema,
  newPasswordSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "@shared/index";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware, softAuth } from "../middleware/authMiddleware.js";
import {
  registerLimiter,
  loginLimiter,
  requestResetLimiter,
  verifyCodeLimiter,
} from "../utils/authLimiter.js";

const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validateRequest(registerSchema),
  register,
);
router.post("/login", loginLimiter, validateRequest(loginSchema), login);
router.post("/logout", logout);
router.get("/me", softAuth, getMe);

router.post(
  "/email-verification",
  requestResetLimiter,
  validateRequest(forgetPasswordSchema),
  requestPasswordReset,
);
router.post(
  "/verify-reset-code",
  verifyCodeLimiter,
  validateRequest(resetPasswordSchema),
  verifyResetCode,
);
router.post("/newPassword", validateRequest(newPasswordSchema), setNewPassword);
export default router;
