import express from "express";
import { sendContactEmail } from "../controllers/contactController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { contactLimiter } from "../utils/authLimiter.js";
import { contactSchema } from "@shared/index";

const router = express.Router();

router.post("/", contactLimiter, validateRequest(contactSchema), sendContactEmail);

export default router;
