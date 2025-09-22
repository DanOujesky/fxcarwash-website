import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import newsRoute from "./routes/news.route";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/news", newsRoute);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://DanOujesky:551Rk5dUxdFqbD2z@backenddb.usb98bd.mongodb.net/fxcarwash-database?retryWrites=true&w=majority&appName=BackendDB"
  )
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
