import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { registerSchema } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
