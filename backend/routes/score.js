import express from "express";
import Score from "../models/Score.js";

const router = express.Router();

// Save score
router.post("/add", async (req, res) => {
  try {
    const { username, score, total, timeTaken } = req.body;

    const saved = await Score.create({
      username,
      score,
      total,
      timeTaken,
    });

    res.json(saved);
  } catch (err) {
    console.error("Score save error:", err);
    res.status(400).json({ error: "Could not save score" });
  }
});

// Top scores
router.get("/top", async (req, res) => {
  try {
    const top = await Score.find()
      .sort({ score: -1, timeTaken: 1 })
      .limit(10);

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: "Could not load leaderboard" });
  }
});

export default router;
