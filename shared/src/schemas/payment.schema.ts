import { z } from "zod";

const orderItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.coerce.number().positive(),
  credit: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive().optional().default(1),
  delivery: z.boolean(),
  shipping: z.string().optional(),
  cardNumber: z.string().optional(),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  items: z.array(orderItemSchema).min(1, "Košík nesmí být prázdný"),
  price: z.coerce.number().positive(),
  email: z.string().email("Neplatný formát e-mailu"),

  phone: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const paymentSchema = z.object({
  order: orderSchema,
});

export type OrderInput = z.infer<typeof orderSchema>;
