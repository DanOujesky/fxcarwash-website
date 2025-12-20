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
import { registerSchema } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware, softAuth } from "../middleware/authMiddleware.js";
import { authLimiter } from "../utils/authLimiter.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", softAuth, getMe);
router.post("/email-verification", authLimiter, requestPasswordReset);
router.post("/verify-reset-code", verifyResetCode);
router.post("/newPassword", setNewPassword);
export default router;
