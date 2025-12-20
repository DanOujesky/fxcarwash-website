import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  password: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

export const forgetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),
});

export const newPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),

  newPassword: z
    .string()
    .min(8, "Heslo musí mít alespoň 8 znaků")
    .max(50, "Heslo je příliš dlouhé")
    .regex(/[0-9]/, "Heslo musí obsahovat alespoň jedno číslo"),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Neplatná emailová adresa"),
  code: z.string().length(6, "Neplatný ověřovací kód"),
});
