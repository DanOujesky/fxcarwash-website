import rateLimit from "express-rate-limit";

export const spamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message:
      "Příliš mnoho požadavků z této IP adresy, zkuste to prosím později.",
  },
  handler: (req, res, next, options) => {
    console.warn(`Rate limit překročen pro IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

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
export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Příliš mnoho objednávek, zkuste to prosím za 15 minut." },
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

export const newPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: "Příliš mnoho pokusů, zkuste to prosím za 15 minut." },
});
