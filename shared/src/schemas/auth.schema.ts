import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Jméno musí mít aspoň 2 znaky")
    .max(50, "Jméno je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
    ),

  lastName: z
    .string()
    .min(2, "Příjmení musí mít aspoň 2 znaky")
    .max(50, "Příjmení je příliš dlouhé")
    .trim()
    .transform(
      (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
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

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Jméno musí mít aspoň 2 znaky")
    .max(50, "Jméno je příliš dlouhé")
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(2, "Příjmení musí mít aspoň 2 znaky")
    .max(50, "Příjmení je příliš dlouhé")
    .trim()
    .optional(),
  email: z.string().email("Zadejte platnou e-mailovou adresu").optional(),
  phone: z
    .string()
    .max(20, "Telefon je příliš dlouhý")
    .trim()
    .optional()
    .nullable(),
  address: z.string().max(100, "Adresa je příliš dlouhá").trim().optional().nullable(),
  city: z.string().max(50, "Město je příliš dlouhé").trim().optional().nullable(),
  zipCode: z.string().max(10, "PSČ je příliš dlouhé").trim().optional().nullable(),
  country: z.string().max(50, "Stát je příliš dlouhý").trim().optional().nullable(),
  companyName: z.string().max(100, "Název firmy je příliš dlouhý").trim().optional().nullable(),
  companyICO: z.string().max(20, "IČO je příliš dlouhé").trim().optional().nullable(),
  companyDIC: z.string().max(20, "DIČ je příliš dlouhé").trim().optional().nullable(),
  companyAddress: z.string().max(100, "Adresa firmy je příliš dlouhá").trim().optional().nullable(),
  companyZipCode: z.string().max(10, "PSČ firmy je příliš dlouhé").trim().optional().nullable(),
  companyCity: z.string().max(50, "Město firmy je příliš dlouhé").trim().optional().nullable(),
});

export const contactSchema = z.object({
  email: z.string().email("Zadejte platnou e-mailovou adresu"),
  telephone: z
    .string()
    .trim()
    .regex(/^[\d+() -]{7,20}$/, "Neplatný formát telefonu"),
  message: z
    .string()
    .trim()
    .min(5, "Zpráva musí mít alespoň 5 znaků")
    .max(2000, "Zpráva je příliš dlouhá"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
