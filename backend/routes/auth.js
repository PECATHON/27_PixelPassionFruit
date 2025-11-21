import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ⭐ GUEST LOGIN (no registration needed)
router.post("/guest", (req, res) => {
  const username = req.body.username || "Guest";

  const token = jwt.sign(
    { id: "guest", name: username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

export default router;
