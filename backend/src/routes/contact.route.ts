import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";

interface ContactRequest {
  email: string;
  telephone: string;
  message: string;
}

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("telephone")
      .matches(/^[0-9+ ]{7,15}$/)
      .withMessage("Telephone must be 7–15 digits, can include + and spaces"),
    body("message")
      .isLength({ min: 5 })
      .withMessage("Message must be at least 5 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    const { email, telephone, message } = req.body as ContactRequest;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        replyTo: email,
        to: process.env.GMAIL_USER,
        subject: "Message from fxcarwash-website",
        text: `Email: ${email}\nTelefon: ${telephone}\nMessage: ${message}`,
      });

      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("❌ Email send failed:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  }
);

export default router;
