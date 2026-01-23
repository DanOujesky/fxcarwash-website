import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.coerce.number().positive(),
  credit: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive().optional().default(1),
  delivery: z.boolean(),
  shipping: z.string().optional().nullable(),
  cardNumber: z.string().optional().nullable(),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1, "Košík nesmí být prázdný"),
  price: z.coerce.number().positive(),
  email: z.string().email("Neplatný formát e-mailu"),

  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export const paymentSchema = z.object({
  order: orderSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
