import express from "express";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import { registerSchema } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { authMiddleware, softAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", softAuth, getMe);
export default router;
