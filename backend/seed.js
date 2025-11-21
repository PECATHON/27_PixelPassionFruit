import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "./models/Quiz.js";

dotenv.config();

const questions = [
  {
    question: "Who is the storyteller in Arabian Nights?",
    options: ["Scheherazade", "Aladdin", "Ali Baba", "Sinbad"],
    correctIndex: 0,
    explanation: "Scheherazade tells stories for 1001 nights to the king.",
    difficulty: "easy",
    theme: "Arabian Nights",
  },
  {
    question: "What magical object does Aladdin find?",
    options: ["Magic Carpet", "Magic Lamp", "Magic Sword", "Golden Ring"],
    correctIndex: 1,
    explanation: "Aladdin finds a magical lamp containing a genie.",
    difficulty: "easy",
    theme: "Aladdin",
  },
  {
    question: "Which phrase opens the thieves’ cave?",
    options: ["Open Sesame", "Open the Gate", "Open Magic", "Sesame Gate"],
    correctIndex: 0,
    explanation:
      "'Open Sesame' opens the cave in Ali Baba and the Forty Thieves.",
    difficulty: "easy",
    theme: "Ali Baba",
  },
  {
    question: "Who travels the seven voyages in Arabian Nights?",
    options: ["Sinbad", "Jafar", "Sultan Omar", "Badr Basim"],
    correctIndex: 0,
    explanation:
      "Sinbad the Sailor explores the seas in seven legendary voyages.",
    difficulty: "medium",
    theme: "Sinbad",
  },
  {
    question: "Who is the villain in the Aladdin story?",
    options: ["Jafar", "Ali Baba", "Zubaidah", "Maruf"],
    correctIndex: 0,
    explanation: "Jafar is the evil sorcerer who tries to steal the lamp.",
    difficulty: "easy",
    theme: "Aladdin",
  },
  {
    question: "What animal helps Ali Baba?",
    options: ["A slave girl", "A talking parrot", "A genie", "A horse"],
    correctIndex: 0,
    explanation: "The slave girl Morgiana saves Ali Baba from the thieves.",
    difficulty: "medium",
    theme: "Ali Baba",
  },
  {
    question: "What does the genie offer Aladdin?",
    options: ["Three wishes", "A kingdom", "A treasure map", "A flying horse"],
    correctIndex: 0,
    explanation: "The genie of the lamp grants Aladdin three wishes.",
    difficulty: "easy",
    theme: "Aladdin",
  },
  {
    question: "What do the 40 thieves store inside their cave?",
    options: ["Gold and jewels", "Weapons", "Magic scrolls", "Food supplies"],
    correctIndex: 0,
    explanation: "The cave is filled with treasure looted by the thieves.",
    difficulty: "easy",
    theme: "Ali Baba",
  },
  {
    question: "Which creature appears in Sinbad’s voyages?",
    options: ["Giant Roc bird", "Dragon", "Mermaid", "Phoenix"],
    correctIndex: 0,
    explanation:
      "The Roc is a giant mythical bird in Sinbad's voyages.",
    difficulty: "medium",
    theme: "Sinbad",
  },
  {
    question: "Why does Scheherazade tell stories every night?",
    options: [
      "To entertain the king",
      "To save her life",
      "To win a reward",
      "To teach morals",
    ],
    correctIndex: 1,
    explanation: "She tells stories so the king will spare her each morning.",
    difficulty: "medium",
    theme: "Arabian Nights",
  },
];

async function seedDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      ssl: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected!");

    console.log("Clearing old questions...");
    await Quiz.deleteMany({});

    console.log("Inserting new questions...");
    await Quiz.insertMany(questions);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
}

seedDB();
