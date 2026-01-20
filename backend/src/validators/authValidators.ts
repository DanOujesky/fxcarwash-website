import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Jméno musí mít aspoň 2 znaky")
    .max(50, "Jméno je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

  lastName: z
    .string()
    .min(2, "Příjmení musí mít aspoň 2 znaky")
    .max(50, "Příjmení je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
    ),

  email: z.string().email("Zadejte platnou e-mailovou adresu"),

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
  code: z.string().length(6, "Neplatný ověřovací kód"),
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
