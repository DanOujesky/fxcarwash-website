import { z } from "zod";

export const paymentSchema = z.object({
  number: z.string().min(1, "Číslo karty je povinné"),
  money: z.coerce
    .number()
    .min(10, "Minimální částka je 10 Kč")
    .max(50000, "Maximální částka je 50 000 Kč"),
});
