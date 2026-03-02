import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().uuid(),
  temp_id: z.string().optional(),
  name: z.string().min(1, "Název položky je povinný"),
  price: z.coerce.number().nonnegative(),
  credit: z.coerce.number().nonnegative(),
  quantity: z.coerce.number().int().positive().default(1),
  delivery: z.boolean(),
  shipping: z.string().optional(),
  cardNumber: z.string().optional(),
});

const companySchema = z.object({
  companyName: z
    .string()
    .min(1, "Název firmy je povinný")
    .optional()
    .or(z.literal("")),
  companyICO: z
    .string()
    .regex(/^\d{8}$/, "IČO musí mít 8 číslic")
    .optional()
    .or(z.literal("")),
  companyDIC: z.string().optional().or(z.literal("")),
  companyAddress: z.string().optional().or(z.literal("")),
  companyZipCode: z.string().optional().or(z.literal("")),
  companyCity: z.string().optional().or(z.literal("")),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1, "Košík nesmí být prázdný"),
  price: z.coerce.number().positive("Cena musí být kladná"),
  email: z.string().email("Neplatný formát e-mailu"),

  phone: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  companyName: z.string().optional(),
  companyICO: z.string().optional(),
  companyDIC: z.string().optional(),
  companyAddress: z.string().optional(),
  companyZipCode: z.string().optional(),
  companyCity: z.string().optional(),
});

export const paymentSchema = z.object({
  order: orderSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
