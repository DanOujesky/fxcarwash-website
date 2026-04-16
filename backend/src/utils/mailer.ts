import nodemailer from "nodemailer";
import { Resend } from "resend";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const resend = new Resend(process.env.EMAIL_PASS);
