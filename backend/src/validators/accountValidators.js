import { z } from "zod";

export const orderSchema = z
  .object({
    shipping: z.enum(["cp", "op"], {
      error: "Vyberte způsob doručení",
    }),
    quantity: z.number().min(1).max(100),
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    credit: z.coerce
      .number("Kredit musí být číslo")
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
  })
  .superRefine((data, ctx) => {
    if (data.shipping === "cp") {
      if (!data.street || data.street.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte prosím kompletní adresu (ulici a číslo)",
          path: ["street"],
        });
        return;
      }
      if (!/\d/.test(data.street)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "V adrese chybí číslo popisné nebo orientační",
          path: ["street"],
        });
      }
    }
  });
