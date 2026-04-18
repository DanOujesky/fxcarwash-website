import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const payload = { id: userId };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET není definován v .env souboru!");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN || "30d") as SignOptions["expiresIn"];
  const signOptions: SignOptions = {
    expiresIn,
  };

  const token = jwt.sign(payload, secret, signOptions);

  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "30", 10);
  const maxAge = days * 24 * 60 * 60 * 1000;

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "lax" : "strict",
    maxAge: maxAge,
    ...(isProd && process.env.COOKIE_DOMAIN
      ? { domain: process.env.COOKIE_DOMAIN }
      : {}),
  });

  return token;
};
