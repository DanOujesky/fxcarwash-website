import { Router } from "express";
import { login, register } from "../controllers/authentication.controller";
import { authMiddleware } from "../middlewares/authentication.middleware";

const router = Router();

router.post("/register", authMiddleware, register);
router.post("/login", login);

export default router;
