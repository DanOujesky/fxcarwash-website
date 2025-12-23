import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Příliš mnoho pokusů, zkuste to prosím za 15 minut." },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Příliš mnoho pokusů, zkuste to prosím za 15 minut." },
});

export const requestResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Příliš mnoho žádostí o e-mail. Zkuste to za hodinu." },
});

export const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Příliš mnoho pokusů, zkuste to prosím za 15 minut." },
});
