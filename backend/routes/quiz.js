import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

/* ---------------------------
   Utility: Shuffle an array
----------------------------*/
function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/* ---------------------------
   GET Quiz Questions (Random)
----------------------------*/
router.get("/", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    // Randomize question selection
    const questions = await Quiz.aggregate([{ $sample: { size: limit } }]);

    // Shuffle options for each question + recalc correctIndex
    const updated = questions.map(q => {
      const originalCorrect = q.options[q.correctIndex];
      q.options = shuffle(q.options);
      q.correctIndex = q.options.indexOf(originalCorrect);
      return q;
    });

    res.json(updated);
  } catch (err) {
    console.error("Error loading quiz:", err);
    res.status(500).json({ error: "Failed to load quiz questions" });
  }
});

/* ---------------------------
   ADMIN — ADD QUESTION
----------------------------*/
router.post("/", async (req, res) => {
  try {
    const created = await Quiz.create(req.body);
    res.json(created);
  } catch (err) {
    res.status(400).json({ error: "Invalid question format" });
  }
});

export default router;
