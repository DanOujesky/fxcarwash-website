import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { spamLimiter } from "./utils/authLimiter.js";
import { logger } from "./utils/logger.js";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import nayaxRoutes from "./routes/nayaxRoutes.js";
import waitlistRoutes from "./routes/waitlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS: origin není povolen"));
      }
    },
    credentials: true,
  }),
);

const uploadsPath = path.join(__dirname, "..", "uploads");
app.get("/debug-uploads", (_req, res) => {
  const p1 = uploadsPath;
  const p2 = path.join(process.cwd(), "uploads");
  res.json({
    __dirname,
    cwd: process.cwd(),
    uploadsPath: p1,
    exists: fs.existsSync(p1),
    files: fs.existsSync(p1) ? fs.readdirSync(p1).slice(0, 5) : [],
    altPath: p2,
    altExists: fs.existsSync(p2),
    altFiles: fs.existsSync(p2) ? fs.readdirSync(p2).slice(0, 5) : [],
  });
});
app.use("/uploads", (_req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(uploadsPath));
app.use("/api", webhookRoutes);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(spamLimiter);

app.use("/news", newsRoutes);
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/nayax", nayaxRoutes);
app.use("/waitlist", waitlistRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes);

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, "Server spuštěn");
    });

    process.on("unhandledRejection", (err) => {
      logger.error({ err }, "Unhandled Promise Rejection");
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM přijat, ukončuji server...");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error({ error }, "Nepodařilo se spustit server");
    process.exit(1);
  }
}

startServer();

process.on("uncaughtException", async (err) => {
  logger.error({ err }, "Uncaught Exception");
  await disconnectDB();
  process.exit(1);
});
