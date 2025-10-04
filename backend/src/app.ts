import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import newsRoute from "./routes/news.route";
import authRoute from "./routes/authentication.route";
import contactRoute from "./routes/contact.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/news", newsRoute);
app.use("/api/auth", authRoute);
app.use("/api/contact", contactRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(`${process.env.DB_STRING}`)
  .then(() => {
    console.log("Connected to the Database");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection to the Database Failed");
  });

export default app;
