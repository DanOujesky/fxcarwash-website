import { z } from "zod";

export const zipCodeValidation = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, ""))
  .refine((val) => /^\d{5}$/.test(val), {
    message: "PSČ musí mít 5 číslic",
  });

export const addressValidation = z
  .string()
  .trim()
  .min(5, "Zadejte prosím kompletní adresu")
  .refine((val) => /\d/.test(val), {
    message: "V adrese chybí číslo popisné nebo orientační",
  });

export const cityValidation = z
  .string()
  .trim()
  .min(2, "Město musí mít alespoň 2 znaky");

export const phoneValidation = z
  .string()
  .trim()
  .regex(
    /^(\+?\d{1,3})?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/,
    "Neplatný formát telefonu",
  );

export const icoValidation = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, ""))
  .refine((val) => /^\d{8}$/.test(val), {
    message: "IČO musí mít 8 číslic",
  });

export const dicValidation = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, ""))
  .refine((val) => /^CZ\d{8,10}$/.test(val), {
    message: "DIČ musí být ve formátu CZ12345678",
  });

export const orderFormSchema = z
  .object({
    shipping: z.enum(["cp", "op"], {
      message: "Vyberte způsob doručení",
    }),

    quantity: z.coerce
      .number({
        message: "Množství musí být číslo",
      })
      .int("Množství musí být celé číslo")
      .min(1, "Minimální množství je 1")
      .max(100, "Maximální množství je 100"),

    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),

    credit: z.coerce
      .number({
        message: "Kredit musí být číslo",
      })
      .min(10, "Minimální částka je 10 Kč")
      .max(50000, "Maximální částka je 50 000 Kč"),
  })
  .superRefine((data, ctx) => {
    if (data.shipping === "cp") {
      const addressResult = addressValidation.safeParse(data.address);
      if (!addressResult.success) {
        for (const issue of addressResult.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message: issue.message,
          });
        }
      }

      const cityResult = cityValidation.safeParse(data.city);
      if (!cityResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: cityResult.error.issues[0].message,
        });
      }

      const zipResult = zipCodeValidation.safeParse(data.zipCode);
      if (!zipResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["zipCode"],
          message: zipResult.error.issues[0].message,
        });
      }
    }
  });

export const addCreditSchema = z.object({
  cardNumber: z.string().trim().min(1, "Musíte vybrat kartu"),

  credit: z
    .number({
      message: "Kredit musí být číslo",
    })
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});

export const newCardSchema = z.object({
  shipping: z.enum(["cp", "op"], {
    message: "Zvolte způsob dopravy",
  }),

  quantity: z
    .number({
      message: "Množství musí být číslo",
    })
    .int("Množství musí být celé číslo")
    .min(1, "Minimální množství je 1 kus")
    .max(100, "Maximální množství je 100 kusů"),

  credit: z
    .number({
      message: "Kredit musí být číslo",
    })
    .min(500, "Minimální výše kreditu je 500 Kč")
    .max(10000, "Maximální výše kreditu je 10 000 Kč"),
});

export const deliverySchema = z
  .object({
    phone: phoneValidation,
    address: addressValidation,
    zipCode: zipCodeValidation,
    city: cityValidation,
    country: z.string().trim().min(2, "Země je povinná"),

    isCompany: z.boolean(),

    companyName: z.string().optional(),
    companyICO: z.string().optional(),
    companyDIC: z.string().optional(),
    companyAddress: z.string().optional(),
    companyZipCode: z.string().optional(),
    companyCity: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isCompany) {
      const companyNameResult = z
        .string()
        .trim()
        .min(2, "Název firmy je povinný")
        .safeParse(data.companyName);

      if (!companyNameResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: companyNameResult.error.issues[0].message,
        });
      }

      const icoResult = icoValidation.safeParse(data.companyICO);
      if (!icoResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyICO"],
          message: icoResult.error.issues[0].message,
        });
      }

      if (data.companyDIC) {
        const dicResult = dicValidation.safeParse(data.companyDIC);

        if (!dicResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["companyDIC"],
            message: dicResult.error.issues[0].message,
          });
        }
      }

      const companyAddressResult = addressValidation.safeParse(
        data.companyAddress,
      );

      if (!companyAddressResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyAddress"],
          message: companyAddressResult.error.issues[0].message,
        });
      }

      const companyCityResult = cityValidation.safeParse(data.companyCity);
      if (!companyCityResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyCity"],
          message: companyCityResult.error.issues[0].message,
        });
      }

      const companyZipResult = zipCodeValidation.safeParse(data.companyZipCode);
      if (!companyZipResult.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyZipCode"],
          message: companyZipResult.error.issues[0].message,
        });
      }
    }
  });
export const orderItemSchema = z.object({
  id: z.string(),
  temp_id: z.string().optional(),
  name: z.string(),
  credit: z.number().positive(),
  delivery: z.boolean(),
  cardNumber: z.string().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  shipping: z.string().optional(),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1, "Košík nesmí být prázdný"),
  price: z.coerce.number().positive("Cena musí být kladná"),
  email: z.string().email("Neplatný formát e-mailu"),

  phone: phoneValidation.optional().or(z.literal("")),
  address: addressValidation.optional().or(z.literal("")),
  zipCode: zipCodeValidation.optional().or(z.literal("")),
  city: cityValidation.optional().or(z.literal("")),
  country: z.string().trim().min(2, "Země je povinná").optional(),

  companyName: z.string().trim().min(2).optional().or(z.literal("")),
  companyICO: icoValidation.optional().or(z.literal("")),
  companyDIC: dicValidation.optional().or(z.literal("")),
  companyAddress: addressValidation.optional().or(z.literal("")),
  companyZipCode: zipCodeValidation.optional().or(z.literal("")),
  companyCity: cityValidation.optional().or(z.literal("")),
});

export const paymentSchema = z.object({
  order: orderSchema,
  paymentMethod: z.enum(["card", "transfer", "cod"]).optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type OrderFormInput = z.infer<typeof orderFormSchema>;
export type AddCreditInput = z.infer<typeof addCreditSchema>;
export type NewCardInput = z.infer<typeof newCardSchema>;
export type DeliveryInput = z.infer<typeof deliverySchema>;
