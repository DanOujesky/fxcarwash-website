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

  phone: z
    .string()
    .regex(
      /^(\+420|\+421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
      "Zadejte platné tel. číslo (+420 123 456 789)"
    ),

  street: z
    .string()
    .min(3, "Ulice je příliš krátká")
    .refine((val) => /\d/.test(val), {
      message: "Nezapomeňte na číslo popisné nebo orientační",
    }),

  city: z.string().min(2, "Zadejte platné město"),

  zipCode: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^[0-9]{5}$/, "PSČ musí mít 5 číslic")),

  country: z.string().min(2, "Vyberte zemi"),
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
