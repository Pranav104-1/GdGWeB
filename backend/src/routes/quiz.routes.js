import { Router } from "express";
import {
  getAllQuestions,
  submitQuiz,
  getQuizStats,
  createQuestion,
} from "../controllers/quiz.controllers.js";
import { authenticate, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes (no authentication required)
router.get("/questions", getAllQuestions);
router.post("/submit", submitQuiz);

// Protected routes
router.get("/stats", authenticate, getQuizStats);

// Admin only routes
router.post("/questions", authenticate, isAdmin, createQuestion);

export default router;
