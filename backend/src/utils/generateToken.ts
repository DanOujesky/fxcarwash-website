import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response): string => {
  const payload = { id: userId };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET není definován v .env souboru!");
  }

  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "30d",
  };

  const token = jwt.sign(payload, secret, signOptions);

  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_IN || "30", 10);
  const maxAge = days * 24 * 60 * 60 * 1000;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: maxAge,
  });

  return token;
};
