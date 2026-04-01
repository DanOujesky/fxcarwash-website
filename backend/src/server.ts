import "dotenv/config";
import express from "express";
import { spamLimiter } from "./utils/authLimiter.js";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import nayaxRoutes from "./routes/nayaxRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api", webhookRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/news", newsRoutes);
app.use("/auth", authRoutes);
app.use("/payment", paymentRoutes);
app.use("/nayax", nayaxRoutes);

app.use(spamLimiter);

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});
