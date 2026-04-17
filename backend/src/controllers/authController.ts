import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../mails/verificationCodeMail.js";
import { User } from "@prisma/client";

const isCodeExpired = (expiration: Date | null): boolean => {
  if (!expiration) return true;
  return new Date() > expiration;
};

const setNewPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.resetCode !== code) {
    return res
      .status(400)
      .json({ error: "Neplatný ověřovací kód", valid: false });
  }

  if (isCodeExpired(user.resetCodeExpiration)) {
    return res.status(400).json({ error: "Kód již vypršel", valid: false });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      resetCode: null,
      resetCodeExpiration: null,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Heslo bylo úspěšně změněno",
  });
};

const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.resetCode !== code) {
    return res
      .status(400)
      .json({ error: "Neplatný ověřovací kód", valid: false });
  }

  if (isCodeExpired(user.resetCodeExpiration)) {
    return res.status(400).json({ error: "Kód již vypršel", valid: false });
  }

  res.status(200).json({ status: "success", valid: true });
};

const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(200).json({
      status: "success",
      message: "Pokud je email registrován, kód byl odeslán",
    });
  }

  const resetCode = crypto.randomInt(100000, 1000000).toString();

  await prisma.user.update({
    where: { email },
    data: {
      resetCode,
      resetCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendVerificationEmail(email, resetCode);
    res.status(200).json({
      status: "success",
      message: "Pokud je email registrován, kód byl odeslán",
    });
  } catch (err) {
    res.status(500).json({
      error: "Nepodařilo se odeslat ověřovací e-mail. Zkuste to prosím znovu.",
    });
  }
};

const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "Registrace se nezdařila. Zkontrolujte zadané údaje." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: { user: { email: newUser.email } },
  });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
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
        email: user.email,
      },
    },
  });
};

const logout = async (req: Request, res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "strict",
  });
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
};

const getMe = (req: Request, res: Response) => {
  res.status(200).json({ status: "success", user: req.user });
};

const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Nepřihlášený uživatel" });
  }

  const { firstName, lastName, email, phone, address, city, zipCode, country } =
    req.body;

  if (email && email !== req.user?.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Tento e-mail je již používán jiným účtem" });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, ...(email ? { email } : {}), phone, address, city, zipCode, country },
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
      companyCity: true,
    },
  });

  res.status(200).json({ status: "success", user: updated });
};

export {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  requestPasswordReset,
  verifyResetCode,
  setNewPassword,
};
