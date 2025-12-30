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
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Váš ověřovací kód",
    text: `Váš kód pro obnovení hesla je: ${code}`,
    html: `<b>Váš kód pro obnovení hesla je: ${code}</b>`,
  });
};

export const sendOrderEmailToUser = async (user) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Potvrzení objednávky",
    text: `${user.email}`,
    html: `<b>${user.email}</b>`,
  });
};
export const sendOrderEmailToCompany = async (user) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.FXCARWASH_EMAIL,
    subject: "Potvrzení objednávky",
    text: `${user.email}`,
    html: `<b>${user.email}</b>`,
  });
};

export const noCardsAvailableEmail = async () => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.FXCARWASH_EMAIL,
    subject: "Dosli dostupne karty",
    text: `Dosli karty`,
    html: `<b>Dosli karty</b>`,
  });
};
