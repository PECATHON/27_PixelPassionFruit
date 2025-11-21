import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation: { type: String },
  difficulty: { type: String, default: "easy" },
  theme: { type: String, default: "Arabian Nights" }
});

export default mongoose.model("Quiz", quizSchema);
