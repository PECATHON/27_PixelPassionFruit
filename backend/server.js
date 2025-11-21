import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import quizRoutes from "./routes/quiz.js";
import scoreRoutes from "./routes/score.js";

dotenv.config();
const app = express();

/* ------------------------------------------------------------
   🔥 PERMANENT CORS FIX — supports ALL Vercel preview links
-------------------------------------------------------------- */

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-side, curl, mobile apps
      if (!origin) return callback(null, true);

      // Allow local development
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow ANY Vercel frontend (preview OR production)
      // Example matched:
      // https://pixelpassionfruit-xxxx.vercel.app
      // https://pixelpassionfruit.vercel.app
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ------------------------------------------------------------
   ROUTES
-------------------------------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/score", scoreRoutes);

app.get("/", (req, res) => {
  res.send("Arabian Nights Quiz API is running");
});

/* ------------------------------------------------------------
   MONGODB CONNECTION
-------------------------------------------------------------- */

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB ERROR:", err);
  });

