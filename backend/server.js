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
   CORS CONFIG — allows all localhost ports + deployed frontend
-------------------------------------------------------------- */

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin (Postman, same-server calls)
      if (!origin) return callback(null, true);

      // Allow any localhost:* (5173, 5174, 5000, etc.)
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow deployed frontend (Netlify / Vercel)
      if (origin === process.env.FRONTEND_URL) {
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
   MONGODB ATLAS CONNECTION FIXED
-------------------------------------------------------------- */

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,  // ⭐ IMPORTANT FIX
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running on port", process.env.PORT || 5000);
    });
  })
  .catch((err) => console.error("❌ MongoDB ERROR:", err));
