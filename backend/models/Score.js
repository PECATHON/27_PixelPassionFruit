import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  score: Number,
  total: Number,
  timeTaken: Number, // in seconds
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Score", scoreSchema);
