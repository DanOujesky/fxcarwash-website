import { z } from "zod";

export const paymentSchema = z
  .object({
    cardNumber: z.string().min(1, "Číslo karty je povinné"),
    credit: z.coerce
      .number()
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
    action: z.enum(["createCard", "addCredit"], {
      error: "neplatná akce",
    }),
    shipping: z.string().optional(),
    street: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.action === "createCard" &&
      !["cp", "op"].includes(data.shipping || "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Zvolte platný způsob dopravy",
        path: ["shipping"],
      });
    }
  });
