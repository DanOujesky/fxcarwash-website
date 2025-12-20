import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Příliš mnoho pokusů, zkuste to prosím za 15 minut." },
});
