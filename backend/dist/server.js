// src/server.ts
import "dotenv/config";
import express9 from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path2 from "path";
import { fileURLToPath } from "url";

// src/utils/authLimiter.ts
import rateLimit from "express-rate-limit";
var spamLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "P\u0159\xEDli\u0161 mnoho po\u017Eadavk\u016F z t\xE9to IP adresy, zkuste to pros\xEDm pozd\u011Bji."
  },
  handler: (req, res, next, options) => {
    console.warn(`Rate limit p\u0159ekro\u010Den pro IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  }
});
var registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  message: { error: "P\u0159\xEDli\u0161 mnoho pokus\u016F, zkuste to pros\xEDm za 15 minut." }
});
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  message: { error: "P\u0159\xEDli\u0161 mnoho pokus\u016F, zkuste to pros\xEDm za 15 minut." }
});
var orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  message: { error: "P\u0159\xEDli\u0161 mnoho objedn\xE1vek, zkuste to pros\xEDm za 15 minut." }
});
var requestResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 3,
  message: { error: "P\u0159\xEDli\u0161 mnoho \u017E\xE1dost\xED o e-mail. Zkuste to za hodinu." }
});
var verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 3,
  message: { error: "P\u0159\xEDli\u0161 mnoho pokus\u016F, zkuste to pros\xEDm za 15 minut." }
});
var newPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 3,
  message: { error: "P\u0159\xEDli\u0161 mnoho pokus\u016F, zkuste to pros\xEDm za 15 minut." }
});
var contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 5,
  message: { error: "P\u0159\xEDli\u0161 mnoho zpr\xE1v, zkuste to pros\xEDm za hodinu." }
});

// src/utils/logger.ts
import pino from "pino";
var logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty" } : void 0
});

// src/routes/newsRoutes.ts
import express from "express";

// src/config/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
var connectionString = process.env.DATABASE_URL;
var pool = new Pool({ connectionString });
var adapter = new PrismaPg(pool);
var prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
var connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected via Prisma (using Postgres adapter)");
  } catch (error) {
    const err = error;
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};
var disconnectDB = async () => {
  await prisma.$disconnect();
};

// src/routes/newsRoutes.ts
var router = express.Router();
router.get("/", async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, text: true, imagePath: true }
    });
    const mapped = news.map((n) => ({
      id: n.id,
      title: n.title,
      text: n.text,
      image: (() => {
        try {
          return JSON.parse(n.imagePath);
        } catch {
          return [n.imagePath];
        }
      })()
    }));
    return res.json(mapped);
  } catch {
    return res.status(500).json({ error: "Chyba serveru" });
  }
});
var newsRoutes_default = router;

// src/routes/authRoutes.ts
import express2 from "express";

// src/controllers/authController.ts
import bcrypt from "bcrypt";
import crypto from "crypto";

// src/utils/generateToken.ts
import jwt from "jsonwebtoken";
var generateToken = (userId, res) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET nen\xED definov\xE1n v .env souboru!");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";
  const signOptions = {
    expiresIn
  };
  const token = jwt.sign(payload, secret, signOptions);
  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "30", 10);
  const maxAge = days * 24 * 60 * 60 * 1e3;
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
    maxAge
  });
  return token;
};

// src/utils/mailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: true
  }
});

// src/mails/verificationCodeMail.ts
var sendVerificationEmail = async (email, code) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";
  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Ov\u011B\u0159ovac\xED k\xF3d",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: ${darkBg}; padding: 30px; text-align: center;">
          <h2 style="color: white; margin: 0; letter-spacing: 2px;">FX CARWASH</h2>
        </div>

        <div style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
          <h3 style="color: #333; margin-bottom: 10px;">Ov\u011B\u0159en\xED identity</h3>
          <p style="color: #666; font-size: 15px; line-height: 1.5;">
            Obdr\u017Eeli jsme \u017E\xE1dost o obnovu hesla k Va\u0161emu \xFA\u010Dtu. <br> 
            Pro pokra\u010Dov\xE1n\xED pou\u017Eijte pros\xEDm n\xE1sleduj\xEDc\xED k\xF3d:
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px dashed ${brandColor};">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${darkBg}; font-family: monospace;">
              ${code}
            </span>
          </div>

          <p style="color: #999; font-size: 13px;">
            Platnost k\xF3du je \u010Dasov\u011B omezena. Pokud k\xF3d nevyu\u017Eijete, vypr\u0161\xED.
          </p>
        </div>

        <div style="padding: 20px 30px; background-color: #fff8f8; border-top: 1px solid #ffecec; text-align: left;">
          <p style="margin: 0; font-size: 12px; color: #cc5c5c;">
            <strong>Pozor:</strong> Pokud jste o zm\u011Bnu hesla ne\u017E\xE1dali, tento e-mail pros\xEDm ignorujte a doporu\u010Dujeme V\xE1m zm\u011Bnit si st\xE1vaj\xEDc\xED heslo. Nikomu tento k\xF3d nesd\u011Blujte.
          </p>
        </div>

        <div style="padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; color: #999;">
          <p>\xA9 2026 FX CarWash | Bezpe\u010Dnostn\xED upozorn\u011Bn\xED</p>
        </div>
      </div>
    `
  });
};

// src/controllers/authController.ts
var isCodeExpired = (expiration) => {
  if (!expiration) return true;
  return /* @__PURE__ */ new Date() > expiration;
};
var setNewPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user || user.resetCode !== code) {
    return res.status(400).json({ error: "Neplatn\xFD ov\u011B\u0159ovac\xED k\xF3d", valid: false });
  }
  if (isCodeExpired(user.resetCodeExpiration)) {
    return res.status(400).json({ error: "K\xF3d ji\u017E vypr\u0161el", valid: false });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiration: null
    }
  });
  res.status(200).json({
    status: "success",
    message: "Heslo bylo \xFAsp\u011B\u0161n\u011B zm\u011Bn\u011Bno"
  });
};
var verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user || user.resetCode !== code) {
    return res.status(400).json({ error: "Neplatn\xFD ov\u011B\u0159ovac\xED k\xF3d", valid: false });
  }
  if (isCodeExpired(user.resetCodeExpiration)) {
    return res.status(400).json({ error: "K\xF3d ji\u017E vypr\u0161el", valid: false });
  }
  res.status(200).json({ status: "success", valid: true });
};
var requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "Pokud je email registrov\xE1n, k\xF3d byl odesl\xE1n"
    });
  }
  const resetCode = crypto.randomInt(1e5, 1e6).toString();
  await prisma.user.update({
    where: { email },
    data: {
      resetCode,
      resetCodeExpiration: new Date(Date.now() + 10 * 60 * 1e3)
    }
  });
  try {
    await sendVerificationEmail(email, resetCode);
    res.status(200).json({
      status: "success",
      message: "Pokud je email registrov\xE1n, k\xF3d byl odesl\xE1n"
    });
  } catch (err) {
    res.status(500).json({
      error: "Nepoda\u0159ilo se odeslat ov\u011B\u0159ovac\xED e-mail. Zkuste to pros\xEDm znovu."
    });
  }
};
var register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const userExists = await prisma.user.findUnique({
    where: { email }
  });
  if (userExists) {
    return res.status(400).json({ error: "Registrace se nezda\u0159ila. Zkontrolujte zadan\xE9 \xFAdaje." });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword
    }
  });
  res.status(201).json({
    status: "success",
    data: { user: { email: newUser.email } }
  });
};
var login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = generateToken(user.id, res);
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email
      }
    }
  });
};
var logout = async (req, res) => {
  res.cookie("jwt", "", {
    expires: /* @__PURE__ */ new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({
    status: "success",
    message: "User logged out successfully"
  });
};
var getMe = (req, res) => {
  res.status(200).json({ status: "success", user: req.user });
};
var updateProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Nep\u0159ihl\xE1\u0161en\xFD u\u017Eivatel" });
  }
  const { firstName, lastName, email, phone, address, city, zipCode, country } = req.body;
  if (email && email !== req.user?.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Tento e-mail je ji\u017E pou\u017E\xEDv\xE1n jin\xFDm \xFA\u010Dtem" });
    }
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, ...email ? { email } : {}, phone, address, city, zipCode, country },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      zipCode: true,
      country: true,
      discount: true,
      companyName: true,
      companyICO: true,
      companyDIC: true,
      companyAddress: true,
      companyZipCode: true,
      companyCity: true
    }
  });
  res.status(200).json({ status: "success", user: updated });
};

// ../shared/src/schemas/auth.schema.ts
import { z } from "zod";
var registerSchema = z.object({
  firstName: z.string().min(2, "Jm\xE9no mus\xED m\xEDt aspo\u0148 2 znaky").max(50, "Jm\xE9no je p\u0159\xEDli\u0161 dlouh\xE9").trim().transform(
    (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  ),
  lastName: z.string().min(2, "P\u0159\xEDjmen\xED mus\xED m\xEDt aspo\u0148 2 znaky").max(50, "P\u0159\xEDjmen\xED je p\u0159\xEDli\u0161 dlouh\xE9").trim().transform(
    (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
  ),
  email: z.string().email("Zadejte platnou e-mailovou adresu"),
  password: z.string().min(8, "Heslo mus\xED m\xEDt alespo\u0148 8 znak\u016F").max(50, "Heslo je p\u0159\xEDli\u0161 dlouh\xE9").regex(/[0-9]/, "Heslo mus\xED obsahovat alespo\u0148 jedno \u010D\xEDslo")
});
var loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatn\xE1 emailov\xE1 adresa"),
  password: z.string().min(8, "Heslo mus\xED m\xEDt alespo\u0148 8 znak\u016F").max(50, "Heslo je p\u0159\xEDli\u0161 dlouh\xE9").regex(/[0-9]/, "Heslo mus\xED obsahovat alespo\u0148 jedno \u010D\xEDslo")
});
var forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatn\xE1 emailov\xE1 adresa")
});
var newPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatn\xE1 emailov\xE1 adresa"),
  code: z.string().length(6, "Neplatn\xFD ov\u011B\u0159ovac\xED k\xF3d"),
  newPassword: z.string().min(8, "Heslo mus\xED m\xEDt alespo\u0148 8 znak\u016F").max(50, "Heslo je p\u0159\xEDli\u0161 dlouh\xE9").regex(/[0-9]/, "Heslo mus\xED obsahovat alespo\u0148 jedno \u010D\xEDslo")
});
var resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatn\xE1 emailov\xE1 adresa"),
  code: z.string().length(6, "Neplatn\xFD ov\u011B\u0159ovac\xED k\xF3d")
});
var updateProfileSchema = z.object({
  firstName: z.string().min(2, "Jm\xE9no mus\xED m\xEDt aspo\u0148 2 znaky").max(50, "Jm\xE9no je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional(),
  lastName: z.string().min(2, "P\u0159\xEDjmen\xED mus\xED m\xEDt aspo\u0148 2 znaky").max(50, "P\u0159\xEDjmen\xED je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional(),
  email: z.string().email("Zadejte platnou e-mailovou adresu").optional(),
  phone: z.string().max(20, "Telefon je p\u0159\xEDli\u0161 dlouh\xFD").trim().optional().nullable(),
  address: z.string().max(100, "Adresa je p\u0159\xEDli\u0161 dlouh\xE1").trim().optional().nullable(),
  city: z.string().max(50, "M\u011Bsto je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable(),
  zipCode: z.string().max(10, "PS\u010C je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable(),
  country: z.string().max(50, "St\xE1t je p\u0159\xEDli\u0161 dlouh\xFD").trim().optional().nullable(),
  companyName: z.string().max(100, "N\xE1zev firmy je p\u0159\xEDli\u0161 dlouh\xFD").trim().optional().nullable(),
  companyICO: z.string().max(20, "I\u010CO je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable(),
  companyDIC: z.string().max(20, "DI\u010C je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable(),
  companyAddress: z.string().max(100, "Adresa firmy je p\u0159\xEDli\u0161 dlouh\xE1").trim().optional().nullable(),
  companyZipCode: z.string().max(10, "PS\u010C firmy je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable(),
  companyCity: z.string().max(50, "M\u011Bsto firmy je p\u0159\xEDli\u0161 dlouh\xE9").trim().optional().nullable()
});
var contactSchema = z.object({
  email: z.string().email("Zadejte platnou e-mailovou adresu"),
  telephone: z.string().trim().regex(/^[\d+() -]{7,20}$/, "Neplatn\xFD form\xE1t telefonu"),
  message: z.string().trim().min(5, "Zpr\xE1va mus\xED m\xEDt alespo\u0148 5 znak\u016F").max(2e3, "Zpr\xE1va je p\u0159\xEDli\u0161 dlouh\xE1")
});

// ../shared/src/schemas/order.schema.ts
import { z as z2 } from "zod";
var zipCodeValidation = z2.string().trim().transform((val) => val.replace(/\s+/g, "")).refine((val) => /^\d{5}$/.test(val), {
  message: "PS\u010C mus\xED m\xEDt 5 \u010D\xEDslic"
});
var addressValidation = z2.string().trim().min(5, "Zadejte pros\xEDm kompletn\xED adresu").refine((val) => /\d/.test(val), {
  message: "V adrese chyb\xED \u010D\xEDslo popisn\xE9 nebo orienta\u010Dn\xED"
});
var cityValidation = z2.string().trim().min(2, "M\u011Bsto mus\xED m\xEDt alespo\u0148 2 znaky");
var phoneValidation = z2.string().trim().regex(
  /^(\+?\d{1,3})?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/,
  "Neplatn\xFD form\xE1t telefonu"
);
var icoValidation = z2.string().trim().transform((val) => val.replace(/\s+/g, "")).refine((val) => /^\d{8}$/.test(val), {
  message: "I\u010CO mus\xED m\xEDt 8 \u010D\xEDslic"
});
var dicValidation = z2.string().trim().transform((val) => val.replace(/\s+/g, "")).refine((val) => /^CZ\d{8,10}$/.test(val), {
  message: "DI\u010C mus\xED b\xFDt ve form\xE1tu CZ12345678"
});
var orderFormSchema = z2.object({
  shipping: z2.enum(["cp", "op"], {
    message: "Vyberte zp\u016Fsob doru\u010Den\xED"
  }),
  quantity: z2.coerce.number({
    message: "Mno\u017Estv\xED mus\xED b\xFDt \u010D\xEDslo"
  }).int("Mno\u017Estv\xED mus\xED b\xFDt cel\xE9 \u010D\xEDslo").min(1, "Minim\xE1ln\xED mno\u017Estv\xED je 1").max(100, "Maxim\xE1ln\xED mno\u017Estv\xED je 100"),
  address: z2.string().optional(),
  city: z2.string().optional(),
  zipCode: z2.string().optional(),
  credit: z2.coerce.number({
    message: "Kredit mus\xED b\xFDt \u010D\xEDslo"
  }).min(10, "Minim\xE1ln\xED \u010D\xE1stka je 10 K\u010D").max(5e4, "Maxim\xE1ln\xED \u010D\xE1stka je 50 000 K\u010D")
}).superRefine((data, ctx) => {
  if (data.shipping === "cp") {
    const addressResult = addressValidation.safeParse(data.address);
    if (!addressResult.success) {
      for (const issue of addressResult.error.issues) {
        ctx.addIssue({
          code: z2.ZodIssueCode.custom,
          path: ["address"],
          message: issue.message
        });
      }
    }
    const cityResult = cityValidation.safeParse(data.city);
    if (!cityResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["city"],
        message: cityResult.error.issues[0].message
      });
    }
    const zipResult = zipCodeValidation.safeParse(data.zipCode);
    if (!zipResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["zipCode"],
        message: zipResult.error.issues[0].message
      });
    }
  }
});
var addCreditSchema = z2.object({
  cardNumber: z2.string().trim().min(1, "Mus\xEDte vybrat kartu"),
  credit: z2.number({
    message: "Kredit mus\xED b\xFDt \u010D\xEDslo"
  }).min(500, "Minim\xE1ln\xED v\xFD\u0161e kreditu je 500 K\u010D").max(1e4, "Maxim\xE1ln\xED v\xFD\u0161e kreditu je 10 000 K\u010D")
});
var newCardSchema = z2.object({
  shipping: z2.enum(["cp", "op"], {
    message: "Zvolte zp\u016Fsob dopravy"
  }),
  quantity: z2.number({
    message: "Mno\u017Estv\xED mus\xED b\xFDt \u010D\xEDslo"
  }).int("Mno\u017Estv\xED mus\xED b\xFDt cel\xE9 \u010D\xEDslo").min(1, "Minim\xE1ln\xED mno\u017Estv\xED je 1 kus").max(100, "Maxim\xE1ln\xED mno\u017Estv\xED je 100 kus\u016F"),
  credit: z2.number({
    message: "Kredit mus\xED b\xFDt \u010D\xEDslo"
  }).min(500, "Minim\xE1ln\xED v\xFD\u0161e kreditu je 500 K\u010D").max(1e4, "Maxim\xE1ln\xED v\xFD\u0161e kreditu je 10 000 K\u010D")
});
var deliverySchema = z2.object({
  phone: phoneValidation,
  address: addressValidation,
  zipCode: zipCodeValidation,
  city: cityValidation,
  country: z2.string().trim().min(2, "Zem\u011B je povinn\xE1"),
  isCompany: z2.boolean(),
  companyName: z2.string().optional(),
  companyICO: z2.string().optional(),
  companyDIC: z2.string().optional(),
  companyAddress: z2.string().optional(),
  companyZipCode: z2.string().optional(),
  companyCity: z2.string().optional()
}).superRefine((data, ctx) => {
  if (data.isCompany) {
    const companyNameResult = z2.string().trim().min(2, "N\xE1zev firmy je povinn\xFD").safeParse(data.companyName);
    if (!companyNameResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["companyName"],
        message: companyNameResult.error.issues[0].message
      });
    }
    const icoResult = icoValidation.safeParse(data.companyICO);
    if (!icoResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["companyICO"],
        message: icoResult.error.issues[0].message
      });
    }
    if (data.companyDIC) {
      const dicResult = dicValidation.safeParse(data.companyDIC);
      if (!dicResult.success) {
        ctx.addIssue({
          code: z2.ZodIssueCode.custom,
          path: ["companyDIC"],
          message: dicResult.error.issues[0].message
        });
      }
    }
    const companyAddressResult = addressValidation.safeParse(
      data.companyAddress
    );
    if (!companyAddressResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["companyAddress"],
        message: companyAddressResult.error.issues[0].message
      });
    }
    const companyCityResult = cityValidation.safeParse(data.companyCity);
    if (!companyCityResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["companyCity"],
        message: companyCityResult.error.issues[0].message
      });
    }
    const companyZipResult = zipCodeValidation.safeParse(data.companyZipCode);
    if (!companyZipResult.success) {
      ctx.addIssue({
        code: z2.ZodIssueCode.custom,
        path: ["companyZipCode"],
        message: companyZipResult.error.issues[0].message
      });
    }
  }
});
var orderItemSchema = z2.object({
  id: z2.string(),
  temp_id: z2.string().optional(),
  name: z2.string(),
  credit: z2.number().positive(),
  delivery: z2.boolean(),
  cardNumber: z2.string().optional(),
  quantity: z2.number().int().positive(),
  price: z2.number().positive(),
  shipping: z2.string().optional()
});
var orderSchema = z2.object({
  id: z2.string().uuid().optional(),
  items: z2.array(orderItemSchema).min(1, "Ko\u0161\xEDk nesm\xED b\xFDt pr\xE1zdn\xFD"),
  price: z2.coerce.number().positive("Cena mus\xED b\xFDt kladn\xE1"),
  email: z2.string().email("Neplatn\xFD form\xE1t e-mailu"),
  phone: phoneValidation.optional().or(z2.literal("")),
  address: addressValidation.optional().or(z2.literal("")),
  zipCode: zipCodeValidation.optional().or(z2.literal("")),
  city: cityValidation.optional().or(z2.literal("")),
  country: z2.string().trim().min(2, "Zem\u011B je povinn\xE1").optional(),
  companyName: z2.string().trim().min(2).optional().or(z2.literal("")),
  companyICO: icoValidation.optional().or(z2.literal("")),
  companyDIC: dicValidation.optional().or(z2.literal("")),
  companyAddress: addressValidation.optional().or(z2.literal("")),
  companyZipCode: zipCodeValidation.optional().or(z2.literal("")),
  companyCity: cityValidation.optional().or(z2.literal(""))
});
var paymentSchema = z2.object({
  order: orderSchema,
  paymentMethod: z2.enum(["card", "transfer", "cod"]).optional()
});

// src/middleware/validateRequest.ts
import { ZodError } from "zod";
var validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Chyba validace",
          errors: error.flatten().fieldErrors
        });
      }
      next(error);
    }
  };
};

// src/middleware/authMiddleware.ts
import jwt2 from "jsonwebtoken";
var authMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
  try {
    const decoded = jwt2.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        cards: true,
        discount: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        zipCode: true,
        companyName: true,
        companyAddress: true,
        companyCity: true,
        companyDIC: true,
        companyICO: true,
        companyZipCode: true
      }
    });
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};
var softAuth = async (req, res, next) => {
  let token = req.cookies?.jwt || req.headers.authorization?.startsWith("Bearer") && req.headers.authorization.split(" ")[1];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt2.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        cards: true,
        discount: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        zipCode: true,
        companyName: true,
        companyAddress: true,
        companyCity: true,
        companyDIC: true,
        companyICO: true,
        companyZipCode: true
      }
    });
    req.user = user || null;
  } catch (error) {
    req.user = null;
  }
  next();
};

// src/routes/authRoutes.ts
var router2 = express2.Router();
router2.post(
  "/register",
  registerLimiter,
  validateRequest(registerSchema),
  register
);
router2.post("/login", loginLimiter, validateRequest(loginSchema), login);
router2.post("/logout", logout);
router2.get("/me", softAuth, getMe);
router2.patch("/profile", authMiddleware, validateRequest(updateProfileSchema), updateProfile);
router2.post(
  "/email-verification",
  requestResetLimiter,
  validateRequest(forgetPasswordSchema),
  requestPasswordReset
);
router2.post(
  "/verify-reset-code",
  verifyCodeLimiter,
  validateRequest(resetPasswordSchema),
  verifyResetCode
);
router2.post(
  "/newPassword",
  newPasswordLimiter,
  validateRequest(newPasswordSchema),
  setNewPassword
);
var authRoutes_default = router2;

// src/routes/paymentRoutes.ts
import express3 from "express";

// src/controllers/paymentController.ts
import Stripe from "stripe";

// src/constants/products.ts
var ALLOWED_CREDITS = [
  500,
  1e3,
  1500,
  2e3,
  2500,
  3e3,
  4e3,
  5e3,
  6e3,
  7e3,
  8e3,
  9e3,
  1e4
];
var SHIPPING_FEES = {
  cp: 0,
  op: 0
};
var LOW_STOCK_THRESHOLD = 10;

// src/services/invoiceService.ts
import puppeteer from "puppeteer";
var escapeHtml = (value) => {
  if (!value) return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var generateInvoice = async (user, order) => {
  const totalAll = order.totalPrice;
  const totalBase = Math.round(totalAll / 1.21 * 100) / 100;
  const totalVat = Math.round((totalAll - totalBase) * 100) / 100;
  const formatDate = (date) => date.toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  const formatCurrency = (val) => val.toLocaleString("cs-CZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const htmlContent = `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
      font-size: 10px;
      color: #1a1a2e;
      background: #fff;
      padding: 52px 56px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 24px;
      border-bottom: 2px solid #1a1a2e;
      margin-bottom: 36px;
    }

    .brand-name {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #1a1a2e;
      line-height: 1;
    }

    .brand-sub {
      font-size: 8px;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #4b5563;
      margin-top: 5px;
    }

    .invoice-title-block {
      text-align: right;
    }

    .invoice-label {
      font-size: 7.5px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #4b5563;
      margin-bottom: 5px;
    }

    .invoice-number {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: 0.02em;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 32px;
    }

    .meta-cell {
      padding: 16px 20px;
      border-right: 1px solid #e5e7eb;
      background: #fafafa;
    }

    .meta-cell:last-child { border-right: none; }

    .meta-label {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .meta-value {
      font-size: 11px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .parties {
      display: flex;
      gap: 20px;
      margin-bottom: 36px;
    }

    .party-box {
      flex: 1;
      padding: 20px 22px;
      border-radius: 10px;
      background: #fafafa;
      border: 1px solid #e5e7eb;
    }

    .party-heading {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #4b5563;
      margin-bottom: 10px;
    }

    .party-name {
      font-size: 12.5px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 7px;
      line-height: 1.3;
    }

    .party-detail {
      font-size: 9.5px;
      color: #374151;
      line-height: 1.7;
    }

    .party-tax {
      margin-top: 9px;
      padding-top: 9px;
      border-top: 1px solid #e5e7eb;
      font-size: 9px;
      color: #4b5563;
      line-height: 1.6;
    }

    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    table.items thead tr {
      border-bottom: 1.5px solid #1a1a2e;
    }

    table.items th {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #4b5563;
      padding: 0 12px 10px 12px;
      text-align: left;
    }

    table.items th:not(:first-child) { text-align: right; }

    table.items tbody tr {
      border-bottom: 1px solid #f3f4f6;
    }

    table.items tbody tr:last-child { border-bottom: 1.5px solid #e5e7eb; }

    table.items td {
      padding: 12px 12px;
      font-size: 10px;
      color: #374151;
      vertical-align: middle;
    }

    table.items td:not(:first-child) { text-align: right; }

    .item-name {
      font-weight: 500;
      color: #1a1a2e;
    }

    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 44px;
    }

    .totals-box {
      width: 260px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 0;
      font-size: 10px;
      color: #374151;
      border-bottom: 1px solid #f3f4f6;
    }

    .totals-row span:last-child {
      font-weight: 500;
      color: #1a1a2e;
    }

    .totals-row.grand {
      border-top: 2px solid #1a1a2e;
      border-bottom: none;
      margin-top: 6px;
      padding-top: 12px;
    }

    .totals-row.grand span {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e !important;
    }

    .footer {
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-note {
      font-size: 8px;
      color: #4b5563;
      line-height: 1.7;
    }

    .footer-brand {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #6b7280;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <div class="brand-name">F.X. CARWASH</div>
      <div class="brand-sub">F.X. CarWash s.r.o.</div>
    </div>
    <div class="invoice-title-block">
      <div class="invoice-label">Faktura \u2014 da\u0148ov\xFD doklad</div>
      <div class="invoice-number">${escapeHtml(order.orderFullNumber)}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-cell">
      <div class="meta-label">Datum vystaven\xED</div>
      <div class="meta-value">${formatDate(/* @__PURE__ */ new Date())}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Datum uskute\u010Dn\u011Bn\xED zdaniteln\xE9ho pln\u011Bn\xED</div>
      <div class="meta-value">${formatDate(/* @__PURE__ */ new Date())}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Variabiln\xED symbol</div>
      <div class="meta-value">${String(order.orderIdentifier)}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-label">Forma \xFAhrady</div>
      <div class="meta-value">Platba kartou</div>
    </div>
  </div>

  <div class="parties">
    <div class="party-box">
      <div class="party-heading">Dodavatel</div>
      <div class="party-name">F.X. CarWash s.r.o.</div>
      <div class="party-detail">
        \u017Di\u017Ekova 1125<br>
        252 62 Horom\u011B\u0159ice
      </div>
      <div class="party-tax">
        I\u010C: 23579102 &nbsp;\xB7&nbsp; DI\u010C: CZ23579102<br>
        <span style="font-size:8px;">zapsan\xE1 v OR u MS v Praze, odd\xEDl C, vlo\u017Eka 429539</span>
      </div>
    </div>

    <div class="party-box">
      <div class="party-heading">Odb\u011Bratel</div>
      <div class="party-name">
        ${order.companyName ? escapeHtml(order.companyName) : `${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}`}
      </div>
      <div class="party-detail">
        ${escapeHtml(order.companyAddress || order.address || user.address || "")}<br>
        ${escapeHtml(order.companyCity || order.city || user.city || "")}${order.companyZipCode || order.zipCode || user.zipCode ? `, ${escapeHtml(order.companyZipCode || order.zipCode || user.zipCode || "")}` : ""}
      </div>
      ${order.companyICO || order.companyDIC ? `
      <div class="party-tax">
        ${order.companyICO ? `I\u010C: ${escapeHtml(order.companyICO)}` : ""}
        ${order.companyICO && order.companyDIC ? "&nbsp;\xB7&nbsp;" : ""}
        ${order.companyDIC ? `DI\u010C: ${escapeHtml(order.companyDIC)}` : ""}
      </div>` : ""}
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th style="width:44%;">Popis</th>
        <th>Ks</th>
        <th>Z\xE1klad bez DPH</th>
        <th>Sazba DPH</th>
        <th>DPH</th>
        <th>Celkem s DPH</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item) => {
    const total = item.price * item.quantity;
    const base = total / 1.21;
    const vat = total - base;
    return `
        <tr>
          <td class="item-name">${escapeHtml(item.name)}</td>
          <td>${item.quantity}</td>
          <td>${formatCurrency(base)} K\u010D</td>
          <td>21 %</td>
          <td>${formatCurrency(vat)} K\u010D</td>
          <td style="font-weight:600; color:#1a1a2e;">${formatCurrency(total)} K\u010D</td>
        </tr>`;
  }).join("")}
    </tbody>
  </table>

  <div class="totals-wrapper">
    <div class="totals-box">
      <div class="totals-row">
        <span>Z\xE1klad DPH (21 %)</span>
        <span>${formatCurrency(totalBase)} K\u010D</span>
      </div>
      <div class="totals-row">
        <span>DPH (21 %)</span>
        <span>${formatCurrency(totalVat)} K\u010D</span>
      </div>
      <div class="totals-row grand">
        <span>Celkem</span>
        <span>${formatCurrency(totalAll)} K\u010D</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="footer-note">
      Vystavil: sales@fxcarwash.cz
    </div>
    <div class="footer-brand">F.X. CarWash</div>
  </div>

</body>
</html>`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" }
  });
  await browser.close();
  return Buffer.from(pdf);
};

// src/mails/orderMail.ts
var escapeHtml2 = (value) => {
  if (!value) return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var sendOrderEmailToUser = async (user, order) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";
  const itemsHtml = order.items.map(
    (item) => `
  <tr>
    <td style="padding: 12px; border-bottom: 1px solid #eee;">
      <strong style="color: #333;">${escapeHtml2(item.name)}</strong>
    ${item.delivery ? `<br><small style="color: #666;">Mno\u017Estv\xED: ${item.quantity} ks</small> <br><small style="color: #666;">Zp\u016Fsob dopravy: ${item.shipping === "cp" ? "\u010Cesk\xE1 po\u0161ta" : "Osobn\xED p\u0159evzet\xED"}</small>` : ""}
    ${item.cardNumber ? `<br><small style="color: #666;">\u010C\xEDslo karty: ${escapeHtml2(item.cardNumber)}</small>` : ""}
    </td>
    <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; white-space: nowrap;">
      ${item.price.toLocaleString("cs-CZ")} K\u010D
    </td>
  </tr>
`
  ).join("");
  const addressHtml = order.address ? `
    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; font-size: 16px;">Doru\u010Dovac\xED adresa</h3>
      <p style="margin: 0; color: #555; line-height: 1.5;">
        ${escapeHtml2(user.firstName)} ${escapeHtml2(user.lastName)}<br>
        ${escapeHtml2(order.address)}, ${escapeHtml2(order.zipCode)} ${escapeHtml2(order.city)}<br>
        ${escapeHtml2(order.country)}
      </p>
    </div>` : "";
  const invoicePdf = await generateInvoice(user, order);
  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: `Potvrzen\xED objedn\xE1vky \u010D. ${order.orderIdentifier}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="background: ${darkBg}; color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0;">FX CARWASH</h1>
          <p style="margin: 10px 0 0; opacity: 0.7;">Objedn\xE1vka byla \xFAsp\u011B\u0161n\u011B p\u0159ijata</p>
        </div>

        <div style="padding: 30px;">
          <p>Dobr\xFD den,</p>
          <p>d\u011Bkujeme za V\xE1\u0161 n\xE1kup. Fakturu k dodan\xE9mu zbo\u017E\xED naleznete v p\u0159\xEDloze mailu. Shrnut\xED Va\u0161\xED objedn\xE1vky:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 12px; font-weight: bold;">Celkov\xE1 cena s DPH</td>
              <td style="padding: 15px 12px; font-weight: bold; text-align: right; color: ${brandColor}; font-size: 18px;">
                ${order.totalPrice.toLocaleString("cs-CZ")} K\u010D
              </td>
            </tr>
          </table>

          ${addressHtml}

          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/moje-karty" 
               style="background: ${brandColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               VSTOUPIT DO M\xC9HO \xDA\u010CTU
            </a>
          </div>
        </div>

        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>F.X. Carwash s.r.o. | Podpora: sales@fxcarwash.cz</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `faktura_${order.orderIdentifier}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf"
      }
    ]
  });
};
var sendOrderEmailToCompany = async (user, order) => {
  const adminColor = "#3498db";
  const darkBg = "#252525";
  const itemsHtml = order.items.map(
    (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong style="color: #333;">${escapeHtml2(item.name)}</strong>
        ${item.delivery ? `<br><small style="color: #666;">Mno\u017Estv\xED: ${item.quantity} ks</small> <br><small style="color: #666;">Zp\u016Fsob dopravy: ${item.shipping === "cp" ? "\u010Cesk\xE1 po\u0161ta" : "Osobn\xED p\u0159evzet\xED"}</small>` : ""}
        ${item.cardNumber ? `<br><small style="color: #666;">\u010C\xEDslo karty: ${escapeHtml2(item.cardNumber)}</small>` : ""}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString("cs-CZ")} K\u010D
      </td>
    </tr>
`
  ).join("");
  const invoicePdf = await generateInvoice(user, order);
  await transporter.sendMail({
    from: `"Syst\xE9m FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `NOV\xC1 OBJEDN\xC1VKA: ${user.lastName} (${order.orderIdentifier})`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background: ${darkBg}; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Nov\xE1 objedn\xE1vka</h2>
          <p style="margin: 5px 0 0; opacity: 0.8;">\u010C\xEDslo objedn\xE1vky: ${order.orderIdentifier}</p>
        </div>

        <div style="padding: 20px;">
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor};">Detail z\xE1kazn\xEDka</h3>
          <p style="line-height: 1.6;">
            <strong>Jm\xE9no:</strong> ${escapeHtml2(user.firstName)} ${escapeHtml2(user.lastName)}<br>
            <strong>E-mail:</strong> ${escapeHtml2(user.email)}<br>
            <strong>Telefon:</strong> ${escapeHtml2(order.phone) || "Neuvedeno"}
          </p>

          ${order.address ? `
          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Doru\u010Dovac\xED \xFAdaje</h3>
          <p style="line-height: 1.6;">
            ${escapeHtml2(order.address)}<br>
            ${escapeHtml2(order.zipCode)} ${escapeHtml2(order.city)}<br>
            ${escapeHtml2(order.country)}
          </p>` : `<p style="color: #e67e22; font-weight: bold;">(Digit\xE1ln\xED dobit\xED - bez dopravy)</p>`}

          <h3 style="border-bottom: 2px solid ${adminColor}; padding-bottom: 5px; color: ${adminColor}; margin-top: 25px;">Polo\u017Eky objedn\xE1vky</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 15px 10px; font-weight: bold;">Celkov\xE1 cena s DPH</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; font-size: 16px;">
                ${order.totalPrice.toLocaleString("cs-CZ")} K\u010D
              </td>
            </tr>
          </table>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `faktura_${order.orderIdentifier}.pdf`,
        content: invoicePdf,
        contentType: "application/pdf"
      }
    ]
  });
};
var sendLowStockAlert = async (remainingCards) => {
  logger.warn({ remainingCards }, "Odes\xEDl\xE1m upozorn\u011Bn\xED na n\xEDzkou z\xE1sobu karet");
  await transporter.sendMail({
    from: `"Syst\xE9m FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `\u26A0\uFE0F UPOZORN\u011AN\xCD: N\xEDzk\xE1 z\xE1soba karet (zb\xFDv\xE1 ${remainingCards} ks)`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f39c12; border-radius: 8px;">
        <div style="background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 7px 7px 0 0;">
          <h2 style="margin: 0;">\u26A0\uFE0F N\xEDzk\xE1 z\xE1soba karet</h2>
        </div>
        <div style="padding: 20px;">
          <p>Zb\xFDv\xE1 pouze <strong>${remainingCards} karet</strong>.</p>
          <p style="color: #888; font-size: 13px;">Toto upozorn\u011Bn\xED bylo odesl\xE1no automaticky syst\xE9mem FX Carwash.</p>
        </div>
      </div>
    `
  });
};
var sendWaitlistAvailabilityEmail = async (firstName, email) => {
  const brandColor = "#2ecc71";
  const darkBg = "#252525";
  await transporter.sendMail({
    from: `"FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "FX Karty jsou op\u011Bt skladem!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="background: ${darkBg}; color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0;">FX CARWASH</h1>
          <p style="margin: 10px 0 0; opacity: 0.7;">Karty jsou op\u011Bt k dispozici</p>
        </div>

        <div style="padding: 30px;">
          <p>Dobr\xFD den, ${firstName},</p>
          <p>
            M\xE1me pro V\xE1s skv\u011Blou zpr\xE1vu \u2014 FX karty jsou op\u011Bt <strong style="color: ${brandColor}">skladem</strong>!<br>
            Zaregistroval(a) jste se do po\u0159adn\xEDku a nyn\xED m\u016F\u017Eete svou objedn\xE1vku dokon\u010Dit.
          </p>

          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/nova-karta"
               style="background: ${brandColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
               OBJEDNAT KARTU
            </a>
          </div>

          <p style="margin-top: 30px; color: #888; font-size: 13px;">
            Karty se mohou op\u011Bt vyprod\xE1vat rychle, doporu\u010Dujeme neot\xE1let.
          </p>
        </div>

        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>F.X. Carwash s.r.o. | Podpora: sales@fxcarwash.cz</p>
        </div>
      </div>
    `
  });
};
var sendCardPoolEmptyAlert = async (order, item) => {
  logger.error(
    { orderId: order.id, itemId: item.id },
    "KRITICK\xC9: Pool karet pr\xE1zdn\xFD po platb\u011B"
  );
  await transporter.sendMail({
    from: `"Syst\xE9m FX Carwash" <${process.env.EMAIL_FROM}>`,
    to: process.env.FXCARWASH_EMAIL,
    subject: `\u{1F6A8} KRITICK\xC9: Z\xE1kazn\xEDk zaplatil ale karta nen\xED k dispozici! Objedn\xE1vka ${order.orderIdentifier}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #e74c3c; border-radius: 8px;">
        <div style="background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 6px 6px 0 0;">
          <h2 style="margin: 0;">\u{1F6A8} NUTN\xC1 OKAM\u017DIT\xC1 AKCE</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Z\xE1kazn\xEDk zaplatil objedn\xE1vku, ale v poolu nejsou \u017E\xE1dn\xE9 karty k p\u0159i\u0159azen\xED!</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr><td style="padding: 8px; color: #666;">\u010C\xEDslo objedn\xE1vky:</td><td style="padding: 8px; font-weight: bold;">${order.orderIdentifier}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Z\xE1kazn\xEDk:</td><td style="padding: 8px;">${order.user?.firstName} ${order.user?.lastName}</td></tr>
            <tr><td style="padding: 8px; color: #666;">E-mail z\xE1kazn\xEDka:</td><td style="padding: 8px;">${order.user?.email}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Polo\u017Eka:</td><td style="padding: 8px;">${item.name}</td></tr>
            <tr><td style="padding: 8px; color: #666;">Kredit:</td><td style="padding: 8px;">${item.credit} K\u010D</td></tr>
          </table>

          <div style="margin-top: 20px; padding: 15px; background: #fff3f3; border-radius: 6px; border-left: 4px solid #e74c3c;">
            <strong>Co d\u011Blat:</strong>
            <ol style="margin: 10px 0 0;">
              <li>Okam\u017Eit\u011B kontaktuj z\xE1kazn\xEDka (${order.user?.email})</li>
              <li>Dopl\u0148 karty do poolu v datab\xE1zi</li>
              <li>Manu\xE1ln\u011B p\u0159i\u0159a\u010F kartu a dobij kredit</li>
            </ol>
          </div>
        </div>
      </div>
    `
  });
};

// src/controllers/paymentController.ts
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
function resolveItemPrice(item, userDiscount) {
  const credit = Number(item.credit);
  let baseCredit = credit;
  if (!ALLOWED_CREDITS.includes(credit) && userDiscount > 0) {
    const derived = Math.round(credit / (1 + userDiscount / 100));
    if (ALLOWED_CREDITS.includes(derived)) {
      baseCredit = derived;
    }
  }
  if (!ALLOWED_CREDITS.includes(baseCredit)) {
    return null;
  }
  const shippingFee = item.delivery ? SHIPPING_FEES[item.shipping] ?? 0 : 0;
  const safePrice = baseCredit + shippingFee;
  const safeCredit = Math.round(baseCredit * (1 + userDiscount / 100));
  return { safeName: item.name, safePrice, safeCredit };
}
var payment = async (req, res) => {
  const { order } = req.body;
  if (!req.user) {
    return res.status(401).json({ error: "U\u017Eivatel nen\xED autentizov\xE1n" });
  }
  const userId = req.user.id;
  const userDiscount = req.user.discount ?? 0;
  const resolvedItems = [];
  for (const item of order.items) {
    const resolved = resolveItemPrice(item, userDiscount);
    if (!resolved) {
      return res.status(400).json({ error: `Neplatn\xE1 polo\u017Eka objedn\xE1vky: ${item.name}` });
    }
    resolvedItems.push({ original: item, ...resolved });
  }
  const serverTotal = resolvedItems.reduce(
    (sum, i) => sum + i.safePrice * (Number(i.original.quantity) || 1),
    0
  );
  const deliveryCount = resolvedItems.filter((i) => i.original.delivery).reduce((sum, i) => sum + (Number(i.original.quantity) || 1), 0);
  if (deliveryCount > 0) {
    const availableCards = await prisma.card.count({
      where: { userId: null, status: "IN_STOCK" }
    });
    if (availableCards < deliveryCount) {
      logger.error(
        { availableCards, needed: deliveryCount },
        "Nedostatek karet v poolu"
      );
      return res.status(400).json({
        error: availableCards === 0 ? "Karty moment\xE1ln\u011B nejsou na sklad\u011B." : `Na sklad\u011B zb\xFDv\xE1 pouze ${availableCards} ${availableCards === 1 ? "karta" : availableCards < 5 ? "karty" : "karet"}.`,
        availableCards,
        outOfStock: true
      });
    }
    if (availableCards - deliveryCount <= LOW_STOCK_THRESHOLD) {
      logger.warn(
        { remaining: availableCards - deliveryCount },
        "N\xEDzk\xE1 z\xE1soba karet"
      );
      sendLowStockAlert(availableCards - deliveryCount).catch(
        (err) => logger.error(
          { err },
          "Nepoda\u0159ilo se odeslat upozorn\u011Bn\xED na n\xEDzkou z\xE1sobu"
        )
      );
    }
  }
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        phone: order.phone,
        address: order.address || void 0,
        city: order.city || void 0,
        zipCode: order.zipCode || void 0,
        country: order.country || void 0,
        companyName: order.companyName || void 0,
        companyICO: order.companyICO || void 0,
        companyDIC: order.companyDIC || void 0,
        companyAddress: order.companyAddress || void 0,
        companyCity: order.companyCity || void 0,
        companyZipCode: order.companyZipCode || void 0
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: order.email,
      line_items: resolvedItems.map((i) => ({
        price_data: {
          currency: "czk",
          unit_amount: Math.round(i.safePrice * 100),
          product_data: { name: i.safeName }
        },
        quantity: Number(i.original.quantity) || 1
      })),
      mode: "payment",
      metadata: {
        userId: String(userId)
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
    });
    await prisma.pendingCheckout.create({
      data: {
        id: session.id,
        userId,
        data: JSON.stringify({
          totalPrice: serverTotal,
          address: order.address || null,
          city: order.city || null,
          zipCode: order.zipCode || null,
          country: order.country || null,
          phone: order.phone || null,
          companyName: order.companyName || null,
          companyAddress: order.companyAddress || null,
          companyCity: order.companyCity || null,
          companyDIC: order.companyDIC || null,
          companyICO: order.companyICO || null,
          companyZipCode: order.companyZipCode || null,
          items: resolvedItems.map((i) => ({
            productId: i.original.id || null,
            name: i.safeName,
            price: i.safePrice,
            credit: i.safeCredit,
            quantity: Number(i.original.quantity) || 1,
            delivery: !!i.original.delivery,
            cardNumber: i.original.cardNumber || null,
            shipping: i.original.shipping || null
          }))
        })
      }
    });
    logger.info(
      { sessionId: session.id, total: serverTotal, userId },
      "Stripe session zah\xE1jena, \u010Dek\xE1 na platbu"
    );
    res.json({ url: session.url });
  } catch (error) {
    logger.error({ error, userId }, "Chyba p\u0159i inicializaci platby");
    res.status(500).json({ error: "Chyba p\u0159i inicializaci platby" });
  }
};
var getOrderBySession = async (req, res) => {
  const { sessionId } = req.params;
  const userId = req.user?.id;
  try {
    const order = await prisma.order.findUnique({
      where: { stripeId: sessionId },
      select: { orderFullNumber: true, orderIdentifier: true, totalPrice: true, userId: true }
    });
    if (!order || order.userId !== userId) {
      return res.status(404).json({ error: "Objedn\xE1vka nenalezena" });
    }
    return res.json({ orderFullNumber: order.orderFullNumber, orderIdentifier: order.orderIdentifier, totalPrice: order.totalPrice });
  } catch (error) {
    logger.error({ error, sessionId }, "Chyba p\u0159i na\u010D\xEDt\xE1n\xED objedn\xE1vky");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

// src/routes/paymentRoutes.ts
var router3 = express3.Router();
router3.post(
  "/create-checkout-session",
  orderLimiter,
  authMiddleware,
  validateRequest(paymentSchema),
  payment
);
router3.get("/order-by-session/:sessionId", authMiddleware, getOrderBySession);
var paymentRoutes_default = router3;

// src/routes/webhookRoutes.ts
import express4 from "express";

// src/controllers/webhookController.ts
import Stripe2 from "stripe";

// src/services/nayaxService.ts
var BASE_URL = process.env.NAYAX_BASE_URL;
var NAYAX_TOKEN = process.env.NAYAX_TOKEN;
var ACTOR_ID = Number(process.env.NAYAX_ACTOR_ID);
var fetchNayax = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${NAYAX_TOKEN}`
  };
  logger.info(
    { url, method: options.method || "GET" },
    "Nayax API \u2192 odes\xEDl\xE1m request"
  );
  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  });
  const responseText = await response.text();
  if (!response.ok) {
    logger.error(
      {
        url,
        status: response.status,
        responseBody: responseText?.substring(0, 2e3)
      },
      "Nayax API \u2190 chyba"
    );
    throw new Error(
      `Nayax API Error [${response.status}]: ${responseText || response.statusText}`
    );
  }
  if (!responseText || !responseText.trim()) {
    logger.info({ url, status: response.status }, "Nayax API \u2190 pr\xE1zdn\xE1 odpov\u011B\u010F");
    return null;
  }
  try {
    const parsed = JSON.parse(responseText);
    logger.info(
      {
        url,
        status: response.status,
        hasCardDetails: !!parsed?.CardDetails,
        cardID: parsed?.CardDetails?.CardID ?? null
      },
      "Nayax API \u2190 odpov\u011B\u010F OK"
    );
    return parsed;
  } catch {
    logger.warn(
      { url, responseText: responseText.substring(0, 500) },
      "Nayax API \u2190 odpov\u011B\u010F nen\xED JSON"
    );
    return responseText;
  }
};
var assignCardFromPool = async (tx, userId) => {
  const card = await tx.card.findFirst({
    where: { userId: null, status: "IN_STOCK" },
    orderBy: { createdAt: "asc" }
  });
  if (!card) return null;
  await tx.card.update({
    where: { id: card.id, userId: null, status: "IN_STOCK" },
    data: { userId }
  });
  return card;
};
var getCardByIdentifier = async (identifier) => {
  return fetchNayax(
    `/operational/v1/cards?CardUniqueIdentifier=${encodeURIComponent(identifier)}`,
    { method: "GET" }
  );
};
var createCardInNayax = async (user, credit, card) => {
  const requestBody = {
    CardDetails: {
      ActorID: ACTOR_ID,
      CardUniqueIdentifier: card.identifier,
      CardDisplayNumber: card.number,
      CardTypeID: 33,
      PhysicalTypeID: 30000530,
      Notes: null,
      Status: 1,
      ExternalApplicationUserID: null
    },
    CardHolderDetails: {
      CardHolderName: `${user.firstName} ${user.lastName}`,
      UserIdentity: null,
      CountryID: null,
      MobileNumber: user.phone || null,
      Email: user.email,
      MemberTypeID: null
    },
    CardCreditAttributes: {
      CurrencyID: null,
      Credit: credit,
      RevalueCredit: 0,
      CreditTypeMoneyBit: true,
      CreditAccumulateBit: true,
      CreditSingleUseBit: false,
      RevalueCashBit: true,
      RevalueCreditCardBit: true,
      AmountMonthlyReload: 0,
      TransactionsMonthlyReload: 0,
      DiscountTypeBit: 0,
      DiscountValue: 0
    },
    CardCreditLimits: {
      AmountDailyLimit: 0,
      AmountWeeklyLimit: 0,
      AmountMonthlyLimit: 0,
      TransactionsDailyLimit: 0,
      TransactionsWeeklyLimit: 0,
      TransactionsMonthlyLimit: 0,
      DiscountTransactionsTotalLimit: 0,
      MaxRevalueAmountLimit: 0,
      WeekDayLimitEnabledBit: false,
      WeekDayAmountLimit: "0",
      WeekDayTransactionLimit: "0"
    },
    CardDateRules: {
      ActivationDate: null,
      ExpirationDate: null,
      RevalueExpirationDate: null,
      SetSingleUseDate: null,
      RemoveSingleUseDate: null
    }
  };
  logger.info(
    {
      cardIdentifier: card.identifier,
      cardNumber: card.number,
      actorId: ACTOR_ID,
      credit,
      email: user.email
    },
    "Nayax: vytv\xE1\u0159\xEDme kartu \u2014 request body"
  );
  return fetchNayax(`/operational/v2/cards`, {
    method: "POST",
    body: JSON.stringify(requestBody)
  });
};
var updateCardInNayax = async (user, credit, card, existingCard) => {
  if (!card.cardId)
    throw new Error("Missing Nayax CardId for update operation.");
  const requestBody = {
    CardDetails: {
      ...existingCard.CardDetails,
      Status: 1
    },
    CardHolderDetails: {
      ...existingCard.CardHolderDetails,
      CardHolderName: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      MobileNumber: user.phone || null,
      MemberTypeID: null
    },
    CardCreditAttributes: {
      ...existingCard.CardCreditAttributes,
      Credit: credit
    },
    CardCreditLimits: existingCard.CardCreditLimits || {},
    CardDateRules: existingCard.CardDateRules || null,
    CardRevalueRewardRules: existingCard.CardRevalueRewardRules || null,
    GroupLocationLimits: existingCard.GroupLocationLimits || null
  };
  logger.info(
    {
      cardId: card.cardId,
      cardIdentifier: card.identifier,
      credit
    },
    "Nayax: aktualizujeme kartu \u2014 request body"
  );
  return fetchNayax(`/operational/v2/cards/${card.cardId}`, {
    method: "PUT",
    body: JSON.stringify(requestBody)
  });
};
var createOrUpdateCardInNayax = async (user, credit, card) => {
  try {
    logger.info(
      {
        cardId: card.id,
        cardIdentifier: card.identifier,
        cardNumber: card.number,
        existingCardId: card.cardId,
        credit,
        userEmail: user.email
      },
      "createOrUpdateCardInNayax: start"
    );
    let existingCard = null;
    try {
      const existingCardResponse = await getCardByIdentifier(card.identifier);
      logger.info(
        {
          cardIdentifier: card.identifier,
          responseIsArray: Array.isArray(existingCardResponse),
          responseLength: Array.isArray(existingCardResponse) ? existingCardResponse.length : "N/A",
          responseType: typeof existingCardResponse
        },
        "Nayax lookup: v\xFDsledek"
      );
      if (Array.isArray(existingCardResponse) && existingCardResponse.length > 0) {
        existingCard = existingCardResponse[0];
      }
    } catch (lookupErr) {
      if (lookupErr.message?.includes("[404]")) {
        logger.info(
          { cardIdentifier: card.identifier },
          "Karta nenalezena v Nayax (404) \u2014 vytvo\u0159\xEDme novou"
        );
      } else {
        logger.error(
          { cardIdentifier: card.identifier, error: lookupErr.message },
          "Nayax lookup: neo\u010Dek\xE1van\xE1 chyba"
        );
        throw lookupErr;
      }
    }
    const cardExists = !!existingCard;
    let resolvedNayaxCardId;
    if (!cardExists) {
      logger.info(
        { cardIdentifier: card.identifier },
        "Karta neexistuje v Nayax \u2014 vytv\xE1\u0159\xEDme novou"
      );
      const createResponse = await createCardInNayax(user, credit, card);
      logger.info(
        {
          cardIdentifier: card.identifier,
          responseCardID: createResponse?.CardDetails?.CardID,
          responseStatus: createResponse?.CardDetails?.Status,
          responseCredit: createResponse?.CardCreditAttributes?.Credit
        },
        "Nayax CREATE: odpov\u011B\u010F"
      );
      let cardIdFromResponse = createResponse?.CardDetails?.CardID;
      if (cardIdFromResponse == null) {
        logger.warn(
          { cardIdentifier: card.identifier },
          "CREATE response missing CardID \u2014 re-fetching"
        );
        const refetch = await getCardByIdentifier(card.identifier);
        const refetchedCard = Array.isArray(refetch) ? refetch[0] : refetch;
        cardIdFromResponse = refetchedCard?.CardDetails?.CardID;
        logger.info(
          { cardIdentifier: card.identifier, refetchedCardID: cardIdFromResponse },
          "Re-fetch v\xFDsledek"
        );
      }
      if (cardIdFromResponse == null) {
        throw new Error(
          `Cannot resolve Nayax CardID for newly created card (identifier: ${card.identifier})`
        );
      }
      resolvedNayaxCardId = String(cardIdFromResponse);
    } else {
      const knownCardId = card.cardId ?? existingCard?.CardDetails?.CardID;
      if (!knownCardId) {
        throw new Error(
          `Card exists in Nayax but CardID is missing (identifier: ${card.identifier})`
        );
      }
      logger.info(
        { cardIdentifier: card.identifier, nayaxCardId: knownCardId },
        "Karta existuje v Nayax \u2014 aktualizujeme"
      );
      const updateResponse = await updateCardInNayax(
        user,
        credit,
        { ...card, cardId: knownCardId },
        existingCard
      );
      resolvedNayaxCardId = String(
        updateResponse?.CardDetails?.CardID ?? knownCardId
      );
    }
    logger.info(
      {
        cardDbId: card.id,
        cardIdentifier: card.identifier,
        resolvedNayaxCardId,
        credit
      },
      "Ukl\xE1d\xE1me kartu do DB"
    );
    const updatedCard = await prisma.card.update({
      where: { id: card.id },
      data: {
        cardId: resolvedNayaxCardId,
        email: user.email,
        assignedAt: /* @__PURE__ */ new Date(),
        status: "ASSIGNED",
        userId: user.id,
        credit
      }
    });
    logger.info(
      {
        cardDbId: updatedCard.id,
        cardId: updatedCard.cardId,
        status: updatedCard.status,
        credit: updatedCard.credit,
        assignedAt: updatedCard.assignedAt
      },
      "Karta \xFAsp\u011B\u0161n\u011B ulo\u017Eena do DB"
    );
    return updatedCard;
  } catch (error) {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
        cardDbId: card.id,
        cardIdentifier: card.identifier
      },
      "CHYBA: createOrUpdateCardInNayax selhalo"
    );
    throw new Error(`Failed to sync card with Nayax: ${error.message}`);
  }
};
var addCreditToCard = async (cardIdentifier, credit) => {
  const data = await fetchNayax(
    `/operational/v1/cards/${encodeURIComponent(cardIdentifier)}/credit/add?CardCredit=${credit}`,
    { method: "POST" }
  );
  logger.info(
    { cardIdentifier, credit, responseValue: data?.value },
    "addCreditToCard: odpov\u011B\u010F"
  );
  if (data?.value != null) return Math.round(data.value);
  logger.warn(
    { cardIdentifier },
    "addCreditToCard: response missing value \u2014 re-fetching balance"
  );
  const cardData = await getCardByIdentifier(cardIdentifier);
  const fetched = Array.isArray(cardData) ? cardData[0] : cardData;
  const balance = fetched?.CardCreditAttributes?.Credit;
  if (balance == null) {
    throw new Error(
      `Cannot determine new balance for card ${cardIdentifier} after credit add`
    );
  }
  return Math.round(balance);
};

// src/controllers/webhookController.ts
var stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY);
var handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe2.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.warn({ err: err.message }, "Stripe webhook - neplatn\xFD podpis");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type !== "checkout.session.completed") {
    return res.json({ received: true });
  }
  const session = event.data.object;
  const metaUserId = session.metadata?.userId;
  if (!metaUserId) {
    logger.error(
      { sessionId: session.id },
      "Webhook: chyb\xED userId v metadata"
    );
    return res.status(400).send("Missing metadata");
  }
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { stripeId: session.id }
    });
    if (existingOrder) {
      logger.info({ sessionId: session.id }, "Webhook: objedn\xE1vka ji\u017E zpracov\xE1na (duplik\xE1t)");
      return res.status(200).json({ message: "Already processed" });
    }
    const checkout = await prisma.pendingCheckout.findUnique({
      where: { id: session.id }
    });
    if (!checkout) {
      logger.error({ sessionId: session.id }, "Webhook: PendingCheckout nenalezena");
      return res.status(200).json({ message: "Checkout not found" });
    }
    if (checkout.userId !== metaUserId) {
      logger.error(
        { sessionId: session.id, metaUserId, checkoutUserId: checkout.userId },
        "Webhook: userId v metadata neodpov\xEDd\xE1 checkoutu \u2014 mo\u017En\xFD podvod"
      );
      return res.status(400).send("User mismatch");
    }
    const orderData = JSON.parse(checkout.data);
    const order = await prisma.$transaction(async (tx) => {
      const yearShort = (/* @__PURE__ */ new Date()).getFullYear().toString().slice(-2);
      const fullYear = (/* @__PURE__ */ new Date()).getFullYear();
      const lastOrder = await tx.order.findFirst({
        where: { orderFullNumber: { startsWith: `${yearShort}FVE` } },
        orderBy: { orderNumberCount: "desc" },
        select: { orderNumberCount: true }
      });
      const nextNumber = (lastOrder?.orderNumberCount ?? 0) + 1;
      const paddedNumber = nextNumber.toString().padStart(4, "0");
      const identifierNumber = `${fullYear}${paddedNumber}`;
      const fullNumber = `${yearShort}FVE${paddedNumber}`;
      const newOrder = await tx.order.create({
        data: {
          userId: checkout.userId,
          totalPrice: orderData.totalPrice,
          orderIdentifier: Number(identifierNumber),
          orderNumberCount: nextNumber,
          orderFullNumber: fullNumber,
          stripeId: session.id,
          status: "PAID",
          address: orderData.address,
          city: orderData.city,
          zipCode: orderData.zipCode,
          country: orderData.country,
          phone: orderData.phone,
          companyName: orderData.companyName,
          companyAddress: orderData.companyAddress,
          companyCity: orderData.companyCity,
          companyDIC: orderData.companyDIC,
          companyICO: orderData.companyICO,
          companyZipCode: orderData.companyZipCode,
          items: {
            create: orderData.items.map((item) => ({
              productId: item.productId || null,
              name: item.name,
              price: item.price,
              credit: item.credit,
              quantity: item.quantity,
              delivery: item.delivery,
              cardNumber: item.cardNumber || null,
              shipping: item.shipping || null
            }))
          }
        },
        include: { items: true, user: true }
      });
      await tx.pendingCheckout.delete({ where: { id: session.id } });
      return newOrder;
    });
    logger.info(
      { orderId: order.id, userId: order.userId },
      "Objedn\xE1vka vytvo\u0159ena a ozna\u010Dena jako PAID"
    );
    for (const item of order.items) {
      try {
        let card;
        let newBalance;
        if (item.delivery) {
          card = await prisma.$transaction(async (tx) => {
            return await assignCardFromPool(tx, order.userId);
          });
          if (!card) {
            logger.error(
              { orderId: order.id, itemId: item.id },
              "KRITICK\xC9: \u017D\xE1dn\xE1 karta v poolu \u2014 z\xE1kazn\xEDk zaplatil, karta nep\u0159i\u0159azena"
            );
            await sendCardPoolEmptyAlert(order, item).catch(
              (mailErr) => logger.error(
                { mailErr },
                "Nepoda\u0159ilo se odeslat alert na pr\xE1zdn\xFD pool"
              )
            );
            continue;
          }
          const cardCreated = await createOrUpdateCardInNayax(
            order.user,
            item.credit,
            card
          );
          newBalance = cardCreated.credit;
          logger.info(
            { orderId: order.id, cardId: card.id, cardNumber: card.number },
            "Nov\xE1 karta p\u0159i\u0159azena a synchronizov\xE1na s Nayax"
          );
        } else {
          card = await prisma.card.findUnique({
            where: { number: item.cardNumber }
          });
          if (!card || card.userId !== order.userId || !card.identifier || item.credit === null) {
            logger.error(
              { orderId: order.id, itemId: item.id, cardNumber: item.cardNumber },
              "KRITICK\xC9: Karta nenalezena nebo nepat\u0159\xED u\u017Eivateli"
            );
            continue;
          }
          newBalance = await addCreditToCard(card.identifier, item.credit);
          await prisma.card.update({
            where: { id: card.id },
            data: { credit: newBalance }
          });
          logger.info(
            { orderId: order.id, cardId: card.id, addedCredit: item.credit, newBalance },
            "Kredit dobito na kartu"
          );
        }
        if (item.credit) {
          await prisma.creditLog.create({
            data: {
              cardId: card.id,
              orderId: order.id,
              userId: order.userId,
              amount: item.credit,
              balanceAfter: newBalance
            }
          });
        }
      } catch (itemError) {
        logger.error(
          {
            orderId: order.id,
            itemId: item.id,
            itemName: item.name,
            errorMessage: itemError?.message,
            errorStack: itemError?.stack
          },
          "KRITICK\xC9: Selhalo zpracov\xE1n\xED polo\u017Eky objedn\xE1vky"
        );
      }
    }
    const emailResults = await Promise.allSettled([
      sendOrderEmailToUser(order.user, order),
      sendOrderEmailToCompany(order.user, order)
    ]);
    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        logger.error(
          { orderId: order.id, emailIndex: i, error: result.reason },
          "Nepoda\u0159ilo se odeslat potvrzovac\xED email"
        );
      }
    });
    logger.info({ orderId: order.id }, "Webhook zpracov\xE1n \xFAsp\u011B\u0161n\u011B");
    res.status(200).json({ received: true });
  } catch (err) {
    logger.error({ sessionId: session.id, err }, "Kritick\xE1 chyba p\u0159i zpracov\xE1n\xED webhooku");
    res.status(500).send("Internal Server Error");
  }
};

// src/routes/webhookRoutes.ts
var router4 = express4.Router();
router4.post(
  "/webhook",
  express4.raw({ type: "application/json" }),
  handleStripeWebhook
);
var webhookRoutes_default = router4;

// src/routes/nayaxRoutes.ts
import express5 from "express";

// src/controllers/nayaxController.ts
var refreshCards = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const cards = await fetchNayax(
      `/operational/v1/cards?CardEmail=${encodeURIComponent(user.email ?? "")}`,
      { method: "GET" }
    );
    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: "No cards found for this email" });
    }
    for (const card of cards) {
      await prisma.card.update({
        where: { identifier: card.CardDetails.CardUniqueIdentifier },
        data: { credit: Math.round(card.CardCreditAttributes.Credit) }
      });
    }
    const updatedCards = await prisma.card.findMany({
      where: { userId: user.id }
    });
    logger.info(
      { userId: user.id, count: updatedCards.length },
      "Karty synchronizov\xE1ny z Nayax"
    );
    res.json({ cards: updatedCards });
  } catch (error) {
    logger.error({ error: error.message }, "Chyba p\u0159i synchronizaci karet");
    res.status(500).json({ error: "Failed to refresh cards" });
  }
};
var toggleCardStatus = async (req, res) => {
  try {
    const cardNumber = String(req.params.cardNumber);
    const user = req.user;
    if (!/^\d{1,20}$/.test(cardNumber)) {
      return res.status(400).json({ error: "Neplatn\xFD form\xE1t \u010D\xEDsla karty" });
    }
    const card = await prisma.card.findUnique({
      where: { number: cardNumber }
    });
    if (!card || !user) {
      return res.status(404).json({ error: "User or Card not found" });
    }
    if (card.userId !== user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const newStatusCode = card.status === "ASSIGNED" ? 2 : 1;
    logger.info(
      { cardNumber, currentStatus: card.status, newStatusCode },
      "Zm\u011Bna stavu karty v Nayax"
    );
    const nayaxResponse = await fetchNayax(
      `/operational/v1/cards/${card.identifier}/status/${newStatusCode}`,
      { method: "POST" }
    );
    if (!nayaxResponse || nayaxResponse.Ok !== true) {
      throw new Error(
        `Nayax API failed: ${nayaxResponse?.Message || "Unknown error"}`
      );
    }
    const updatedCard = await prisma.card.update({
      where: { number: cardNumber },
      data: {
        status: card.status === "ASSIGNED" ? "BLOCKED" : "ASSIGNED"
      }
    });
    logger.info(
      { cardNumber, newStatus: updatedCard.status },
      "Stav karty \xFAsp\u011B\u0161n\u011B zm\u011Bn\u011Bn"
    );
    res.json({
      message: `Card status updated to ${updatedCard.status}`,
      newStatus: updatedCard.status
    });
  } catch (error) {
    logger.error({ error: error.message }, "Chyba p\u0159i zm\u011Bn\u011B stavu karty");
    res.status(500).json({ error: "Nepoda\u0159ilo se zm\u011Bnit stav karty. Zkuste to pros\xEDm znovu." });
  }
};

// src/routes/nayaxRoutes.ts
var router5 = express5.Router();
router5.get("/refreshCards", authMiddleware, refreshCards);
router5.post("/toggleCardStatus/:cardNumber", authMiddleware, toggleCardStatus);
var nayaxRoutes_default = router5;

// src/routes/waitlistRoutes.ts
import express6 from "express";

// src/controllers/waitlistController.ts
var joinWaitlist = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "U\u017Eivatel nen\xED autentizov\xE1n" });
  }
  const { email, firstName, lastName, id: userId } = req.user;
  try {
    const existing = await prisma.cardWaitlist.findUnique({
      where: { email }
    });
    if (existing) {
      return res.status(200).json({ message: "Ji\u017E jste v po\u0159adn\xEDku.", alreadyJoined: true });
    }
    await prisma.cardWaitlist.create({
      data: { email, firstName, lastName, userId }
    });
    logger.info({ email }, "U\u017Eivatel p\u0159id\xE1n do po\u0159adn\xEDku na karty");
    return res.status(201).json({ message: "Byl(a) jste p\u0159id\xE1n(a) do po\u0159adn\xEDku." });
  } catch (error) {
    logger.error({ error, email }, "Chyba p\u0159i p\u0159id\xE1v\xE1n\xED do po\u0159adn\xEDku");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var notifyWaitlist = async (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "P\u0159\xEDstup odep\u0159en" });
  }
  try {
    const waitlist = await prisma.cardWaitlist.findMany();
    if (waitlist.length === 0) {
      return res.status(200).json({ message: "Po\u0159adn\xEDk je pr\xE1zdn\xFD.", sent: 0 });
    }
    let sent = 0;
    const errors = [];
    for (const entry of waitlist) {
      try {
        await sendWaitlistAvailabilityEmail(entry.firstName, entry.email);
        sent++;
      } catch (err) {
        logger.error(
          { err, email: entry.email },
          "Nepoda\u0159ilo se odeslat email z po\u0159adn\xEDku"
        );
        errors.push(entry.email);
      }
    }
    await prisma.cardWaitlist.deleteMany();
    logger.info({ sent }, "Po\u0159adn\xEDk byl notifikov\xE1n a vymaz\xE1n");
    return res.status(200).json({
      message: `Odesl\xE1no ${sent} email\u016F, po\u0159adn\xEDk byl vymaz\xE1n.`,
      sent,
      errors
    });
  } catch (error) {
    logger.error({ error }, "Chyba p\u0159i notifikaci po\u0159adn\xEDku");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

// src/routes/waitlistRoutes.ts
var router6 = express6.Router();
router6.post("/join", authMiddleware, joinWaitlist);
router6.post("/notify", authMiddleware, notifyWaitlist);
var waitlistRoutes_default = router6;

// src/routes/adminRoutes.ts
import express7 from "express";

// src/middleware/adminMiddleware.ts
var adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "P\u0159\xEDstup odep\u0159en" });
  }
  next();
};

// src/controllers/adminController.ts
import multer from "multer";
import path from "path";
import fs from "fs";
var UPLOADS_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
var uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Pouze obr\xE1zky"));
  }
}).array("images", 10);
var uploadImages = (req, res) => {
  uploadMiddleware(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    const files = req.files ?? [];
    const urls = files.map((f) => f.filename);
    return res.json({ urls });
  });
};
var getAdminStats = async (req, res) => {
  try {
    const cardGroups = await prisma.card.groupBy({
      by: ["status"],
      _count: true
    });
    const cardStats = {
      inStock: 0,
      assigned: 0,
      blocked: 0,
      lost: 0,
      total: 0
    };
    for (const group of cardGroups) {
      const count = group._count;
      cardStats.total += count;
      if (group.status === "IN_STOCK") cardStats.inStock = count;
      else if (group.status === "ASSIGNED") cardStats.assigned = count;
      else if (group.status === "BLOCKED") cardStats.blocked = count;
      else if (group.status === "LOST") cardStats.lost = count;
    }
    const orderGroups = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: { totalPrice: true }
    });
    const orderStats = {
      total: 0,
      paid: 0,
      cancelled: 0,
      refunded: 0,
      shipped: 0,
      totalRevenue: 0
    };
    for (const group of orderGroups) {
      if (group.status === "PENDING") continue;
      const count = group._count;
      orderStats.total += count;
      if (group.status === "PAID") {
        orderStats.paid = count;
        orderStats.totalRevenue = group._sum.totalPrice ?? 0;
      } else if (group.status === "CANCELLED") orderStats.cancelled = count;
      else if (group.status === "REFUNDED") orderStats.refunded = count;
      else if (group.status === "SHIPPED") orderStats.shipped = count;
    }
    const usersTotal = await prisma.user.count();
    const newLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3)
        }
      }
    });
    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ["name"],
      where: { order: { status: { not: "PENDING" } } },
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { name: "desc" } },
      take: 5
    });
    const topProducts = topProductsRaw.map((p) => ({
      name: p.name,
      count: p._count,
      revenue: p._sum.price ?? 0
    }));
    const recentOrdersRaw = await prisma.order.findMany({
      where: { status: { not: "PENDING" } },
      take: 15,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { email: true } } }
    });
    const recentOrders = recentOrdersRaw.map((o) => ({
      orderFullNumber: o.orderFullNumber,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      userEmail: o.user.email
    }));
    const creditAggregate = await prisma.creditLog.aggregate({
      _sum: { amount: true },
      _count: true
    });
    const totalCreditIssued = creditAggregate._sum.amount ?? 0;
    const creditCount = creditAggregate._count;
    const avgCreditPerOrder = creditCount > 0 ? Math.round(totalCreditIssued / creditCount) : 0;
    return res.json({
      cards: cardStats,
      orders: orderStats,
      users: {
        total: usersTotal,
        newLast30Days
      },
      topProducts,
      recentOrders,
      creditStats: {
        totalCreditIssued,
        avgCreditPerOrder
      }
    });
  } catch (error) {
    logger.error({ error }, "getAdminStats error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var importCards = async (req, res) => {
  try {
    const { csv } = req.body;
    if (!csv || typeof csv !== "string") {
      return res.status(400).json({ error: "Chyb\xED CSV data" });
    }
    const lines = csv.split("\n").map((l) => l.trim()).filter(Boolean);
    let imported = 0;
    let skipped = 0;
    for (const line of lines) {
      if (line.toLowerCase().startsWith("number")) {
        continue;
      }
      const parts = line.split(",");
      if (parts.length < 2) {
        skipped++;
        continue;
      }
      const number = parts[0].trim();
      const identifier = parts[1].trim();
      if (!number || !identifier) {
        skipped++;
        continue;
      }
      try {
        await prisma.card.upsert({
          where: { number },
          create: { number, identifier, status: "IN_STOCK" },
          update: {}
        });
        imported++;
      } catch {
        skipped++;
      }
    }
    return res.json({ imported, skipped });
  } catch (error) {
    logger.error({ error }, "importCards error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var LEGACY_NEWS = [
  {
    title: "Slavnostn\xED otev\u0159en\xED myc\xEDho centra v sobotu 18.4.2026 od 10 hodin",
    text: "P\u0159ije\u010Fte se k n\xE1m pod\xEDvat, klob\xE1sy z grilu a n\xE1poje zdarma pro v\u0161echny z\xE1kazn\xEDky do vy\u010Derp\xE1n\xED z\xE1sob. R\xE1di se s v\xE1mi setk\xE1me osobn\u011B. T\u011B\u0161\xEDme se na v\xE1s!",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"]
  },
  {
    title: "Online n\xE1kup a dobit\xED fx karet",
    text: "Ji\u017E brzy pro v\xE1s spust\xEDme mo\u017Enost nakoupit si online zv\xFDhodn\u011Bn\xE9 v\u011Brnostn\xED fx karty.",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"]
  },
  {
    title: "M\xE1me otev\u0159eno!",
    text: "Po t\xFDdnu zku\u0161ebn\xEDho provozu m\xE1me otev\u0159eno pro v\u0161echny z\xE1kazn\xEDky nonstop. M\u016F\u017Eete u n\xE1s platit v hotovosti i platebn\xED kartou. Myc\xED centrum je vybaveno m\u011Bni\u010Dkou pen\u011Bz. K dispozici je v\xFDkonn\xFD vysava\u010D a mo\u017Enost dopln\u011Bn\xED nemrznouc\xED sm\u011Bsi do ost\u0159ikova\u010D\u016F ( -20 \xB0C).",
    images: ["IMG_3217.jpg", "IMG_3167.jpg", "IMG_3250.jpg", "IMG_3184.jpg", "IMG_3174.jpg"]
  },
  {
    title: "Otev\u0159en\xED se bl\xED\u017E\xED",
    text: "U\u017E fini\u0161ujeme, lad\xEDme posledn\xED detaily a testujeme kvalitu myt\xED pro 100% spokojenost na\u0161ich budouc\xEDch z\xE1kazn\xEDk\u016F. P\u0159edb\u011B\u017En\xFD term\xEDn otev\u0159en\xED myc\xEDho centra je 17.12.2025.",
    images: ["Image-10.jpg", "Image-12.jpg", "Image-16.jpg", "Image-13.jpg", "Image-15.jpg"]
  },
  {
    title: "Pr\xE1ce fini\u0161uj\xED. Pl\xE1n dokon\u010Den\xED: prosinec 2025",
    text: "V\u0161e b\u011B\u017E\xED dle pl\xE1nu a v prosinci 2025 bychom m\u011Bli m\xEDt kompletn\u011B hotovo. \u010Cek\xE1 n\xE1s dod\xE1vka samotn\xE9 konstrukce myc\xEDho centra a jej\xED napojen\xED na s\xEDt\u011B. Finalizujeme tak\xE9 \xFApravy okol\xED, kter\xE9 bychom V\xE1m r\xE1di zp\u0159\xEDjemnili. O term\xEDnu otev\u0159en\xED V\xE1s budeme brzy informovat.",
    images: ["IMG_2523.jpg", "image_3.jpg", "image_1.jpg", "image_2.jpg", "image_5.jpg"]
  },
  {
    title: "Zah\xE1jen\xED v\xFDstavby myc\xEDho centra",
    text: "Projekt v\xFDstavby myc\xEDho centra v Horn\xED B\u0159\xEDze za\u010Dal v pr\u016Fb\u011Bhu roku 2024, kdy jsme se intenzivn\u011B v\u011Bnovali v\xFDb\u011Bru kvalitn\xEDho a spolehliv\xE9ho partnera pro realizaci v\xFDstavby. T\xEDmto partnerem se pro n\xE1s stala spole\u010Dnost MY WASH Technology s.r.o. Stavebn\xED pr\xE1ce p\u0159\xEDmo na m\xEDst\u011B za\u010Daly v l\xE9t\u011B 2025 a ji\u017E koncem srpna se poda\u0159ilo dokon\u010Dit a kompletn\u011B p\u0159ipravit z\xE1klady. U\u017E to pro V\xE1s chyst\xE1me!",
    images: ["car-news-image-2.jpg", "car-news-image-1.jpg"]
  }
];
var seedLegacyNews = async (req, res) => {
  try {
    const creatorId = req.user?.id;
    if (!creatorId) return res.status(401).json({ error: "Unauthorized" });
    const existing = await prisma.news.count();
    if (existing > 0) return res.json({ skipped: true, message: "DB ji\u017E obsahuje novinky" });
    for (const item of LEGACY_NEWS) {
      await prisma.news.create({
        data: {
          title: item.title,
          text: item.text,
          imagePath: JSON.stringify(item.images),
          creatorId
        }
      });
    }
    return res.json({ imported: LEGACY_NEWS.length });
  } catch (error) {
    logger.error({ error }, "seedLegacyNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var getNews = async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, text: true, imagePath: true, createdAt: true }
    });
    const mapped = news.map((n) => ({
      id: n.id,
      title: n.title,
      text: n.text,
      image: (() => {
        try {
          return JSON.parse(n.imagePath);
        } catch {
          return [n.imagePath];
        }
      })(),
      createdAt: n.createdAt
    }));
    return res.json(mapped);
  } catch (error) {
    logger.error({ error }, "getNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var createNews = async (req, res) => {
  try {
    const { title, text, images } = req.body;
    if (!title?.trim() || !text?.trim()) {
      return res.status(400).json({ error: "N\xE1zev a text jsou povinn\xE9" });
    }
    const creatorId = req.user?.id;
    if (!creatorId) return res.status(401).json({ error: "Unauthorized" });
    const news = await prisma.news.create({
      data: {
        title: title.trim(),
        text: text.trim(),
        imagePath: JSON.stringify(Array.isArray(images) && images.length ? images : []),
        creatorId
      }
    });
    return res.json({ success: true, id: news.id });
  } catch (error) {
    logger.error({ error }, "createNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, images } = req.body;
    if (!title?.trim() || !text?.trim()) {
      return res.status(400).json({ error: "N\xE1zev a text jsou povinn\xE9" });
    }
    await prisma.news.update({
      where: { id: String(id) },
      data: {
        title: title.trim(),
        text: text.trim(),
        imagePath: JSON.stringify(Array.isArray(images) ? images : [])
      }
    });
    return res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "updateNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({ where: { id: String(id) } });
    return res.json({ success: true });
  } catch (error) {
    logger.error({ error }, "deleteNews error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};
var reclaimCard = async (req, res) => {
  try {
    const { cardNumber } = req.body;
    if (!cardNumber) {
      return res.status(400).json({ error: "Chyb\xED \u010D\xEDslo karty" });
    }
    const card = await prisma.card.findUnique({
      where: { number: cardNumber }
    });
    if (!card) {
      return res.status(404).json({ error: "Karta nenalezena" });
    }
    if (!card.userId) {
      return res.status(400).json({ error: "Karta nen\xED p\u0159i\u0159azena \u017E\xE1dn\xE9mu u\u017Eivateli" });
    }
    const updatedCard = await prisma.card.update({
      where: { number: cardNumber },
      data: {
        status: "IN_STOCK",
        userId: null,
        assignedAt: null,
        credit: 0,
        email: null,
        name: null,
        cardId: null
      }
    });
    return res.json({ success: true, card: updatedCard });
  } catch (error) {
    logger.error({ error }, "reclaimCard error");
    return res.status(500).json({ error: "Chyba serveru" });
  }
};

// src/routes/adminRoutes.ts
var router7 = express7.Router();
router7.use(authMiddleware, adminMiddleware);
router7.get("/stats", getAdminStats);
router7.post("/cards/import", importCards);
router7.post("/cards/reclaim", reclaimCard);
router7.get("/news", getNews);
router7.post("/news/seed", seedLegacyNews);
router7.post("/news/upload", uploadImages);
router7.post("/news", createNews);
router7.put("/news/:id", updateNews);
router7.delete("/news/:id", deleteNews);
var adminRoutes_default = router7;

// src/routes/contactRoutes.ts
import express8 from "express";

// src/controllers/contactController.ts
var sendContactEmail = async (req, res) => {
  const { email, telephone, message } = req.body;
  try {
    await transporter.sendMail({
      from: `"FX Carwash web" <${process.env.EMAIL_FROM}>`,
      to: process.env.FXCARWASH_EMAIL,
      replyTo: email,
      subject: `Nov\xE1 zpr\xE1va z kontaktn\xEDho formul\xE1\u0159e`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background: #252525; color: white; padding: 24px 28px;">
            <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Nov\xE1 zpr\xE1va z webu</h2>
          </div>
          <div style="padding: 28px; background: #fff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #666; width: 110px; vertical-align: top;">E-mail:</td>
                <td style="padding: 10px 0; color: #111; font-weight: 500;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666; vertical-align: top;">Telefon:</td>
                <td style="padding: 10px 0; color: #111; font-weight: 500;">${telephone}</td>
              </tr>
              <tr style="border-top: 1px solid #f0f0f0;">
                <td style="padding: 10px 0; color: #666; vertical-align: top;">Zpr\xE1va:</td>
                <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f4f4f4; padding: 14px 28px; font-size: 12px; color: #888;">
            Odesl\xE1no p\u0159es kontaktn\xED formul\xE1\u0159 na fxcarwash.cz
          </div>
        </div>
      `
    });
    logger.info({ email }, "Kontaktn\xED formul\xE1\u0159 odesl\xE1n");
    res.status(200).json({ status: "success", message: "Zpr\xE1va byla \xFAsp\u011B\u0161n\u011B odesl\xE1na." });
  } catch (err) {
    logger.error({ err }, "Chyba p\u0159i odes\xEDl\xE1n\xED kontaktn\xEDho emailu");
    res.status(500).json({ error: "Nepoda\u0159ilo se odeslat zpr\xE1vu. Zkuste to pros\xEDm znovu." });
  }
};

// src/routes/contactRoutes.ts
var router8 = express8.Router();
router8.post("/", contactLimiter, validateRequest(contactSchema), sendContactEmail);
var contactRoutes_default = router8;

// src/server.ts
var __dirname = path2.dirname(fileURLToPath(import.meta.url));
var app = express9();
app.set("trust proxy", 1);
app.use(helmet());
var ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: origin nen\xED povolen"));
      }
    },
    credentials: true
  })
);
app.use("/uploads", (_req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express9.static(path2.join(process.cwd(), "uploads")));
app.use("/api", webhookRoutes_default);
app.use(express9.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express9.urlencoded({ extended: true, limit: "10kb" }));
app.use(spamLimiter);
app.use("/news", newsRoutes_default);
app.use("/auth", authRoutes_default);
app.use("/payment", paymentRoutes_default);
app.use("/nayax", nayaxRoutes_default);
app.use("/waitlist", waitlistRoutes_default);
app.use("/admin", adminRoutes_default);
app.use("/contact", contactRoutes_default);
var PORT = process.env.PORT || 5001;
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, "Server spu\u0161t\u011Bn");
    });
    process.on("unhandledRejection", (err) => {
      logger.error({ err }, "Unhandled Promise Rejection");
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM p\u0159ijat, ukon\u010Duji server...");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ error }, "Nepoda\u0159ilo se spustit server");
    process.exit(1);
  }
}
startServer();
process.on("uncaughtException", async (err) => {
  logger.error({ err }, "Uncaught Exception");
  await disconnectDB();
  process.exit(1);
});
//# sourceMappingURL=server.js.map