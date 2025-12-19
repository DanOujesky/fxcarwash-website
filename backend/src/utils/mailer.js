import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Váš ověřovací kód",
    text: `Váš kód pro obnovení hesla je: ${code}`,
    html: `<b>Váš kód pro obnovení hesla je: ${code}</b>`,
  });
};
