import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

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
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email, telephone, message } = req.body;

    try {
      await sgMail.send({
        to: process.env.EMAIL_TO as string,
        from: {
          email: process.env.EMAIL_FROM as string,
          name: "FX Carwash Website",
        },
        replyTo: req.body.email,
        subject: "Message from fxcarwash-website",
        text: `Email: ${req.body.email}\nTelefon: ${req.body.telephone}\nMessage: ${req.body.message}`,
      });

      res.json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error("❌ Email send failed:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  }
);

export default router;
