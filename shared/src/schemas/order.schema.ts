import { z } from "zod";

export const orderFormSchema = z
  .object({
    shipping: z.enum(["cp", "op"], {
      error: "Vyberte způsob doručení",
    }),
    quantity: z.number().min(1).max(100),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    credit: z.coerce
      .number({
        error: "Kredit musí být číslo",
      })
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
  })
  .superRefine((data, ctx) => {
    if (data.shipping === "cp") {
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte prosím kompletní adresu (ulici a číslo)",
          path: ["street"],
        });
        return;
      }
      if (!/\d/.test(data.address)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "V adrese chybí číslo popisné nebo orientační",
          path: ["street"],
        });
      }
    }
  });

export const addCreditSchema = z.object({
  cardNumber: z.string().min(1, "Musíte vybrat kartu"),
  credit: z
    .number()
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});
export const newCardSchema = z.object({
  shipping: z.enum(["cp", "op"], {
    error: "Zvojte způsob dopravy",
  }),

  quantity: z
    .number()
    .int("Množství musí být celé číslo")
    .min(1, "Minimální množství je 1 kus")
    .max(100, "Maximální množství je 100 kusů"),

  credit: z
    .number()
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});
export const deliverySchema = z.object({
  phone: z
    .string()
    .min(1, "Telefon je povinný")
    .regex(
      /^(\+?\d{1,3})?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/,
      "Neplatný formát telefonu",
    ),

  address: z.string().min(5, "Ulice a číslo popisné musí mít aspoň 5 znaků"),

  zipCode: z
    .string()
    .min(1, "PSČ je povinné")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{5}$/.test(val), "PSČ musí mít 5 číslic"),

  city: z.string().min(2, "Město musí mít aspoň 2 znaky"),

  country: z.string().min(1, "Země je povinná"),
});

export const companySchema = z.object({
  companyName: z.string().min(2, "Název firmy musí mít aspoň 2 znaky"),

  companyICO: z
    .string()
    .min(1, "IČO je povinné")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{8}$/.test(val), "IČO musí mít přesně 8 číslic"),

  companyDIC: z
    .string()
    .transform((val) => val.replace(/\s+/g, "").toUpperCase())
    .optional()
    .or(z.literal("")),

  companyAddress: z
    .string()
    .min(5, "Ulice a číslo popisné musí mít aspoň 5 znaků"),

  companyZipCode: z
    .string()
    .min(1, "PSČ je povinné")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{5}$/.test(val), "PSČ musí mít 5 číslic"),

  companyCity: z.string().min(2, "Město musí mít aspoň 2 znaky"),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
export type AddCreditInput = z.infer<typeof addCreditSchema>;
export type NewCardInput = z.infer<typeof newCardSchema>;
export type DeliveryInput = z.infer<typeof deliverySchema>;
export type CompanySchema = z.infer<typeof companySchema>;
