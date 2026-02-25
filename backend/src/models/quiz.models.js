import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["web-dev", "mobile-dev", "cloud", "ai-ml", "general"],
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "short-answer"],
      default: "multiple-choice",
    },
    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    correctAnswer: String, // For short-answer questions
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const quizResponseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      default: null, // Allow anonymous submissions
    },
    email: String, // For anonymous users
    category: {
      type: String,
      required: true,
    },
    responses: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
    score: Number,
    totalQuestions: Number,
    percentageScore: Number,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);
export const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);
