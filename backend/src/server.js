import express from "express";
import newsRoutes from "./routes/newsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db.js";

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/news", newsRoutes);
app.use("/auth", authRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  ServiceWorkerRegistration.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
