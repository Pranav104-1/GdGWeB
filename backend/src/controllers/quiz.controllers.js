import { QuizQuestion, QuizResponse } from "../models/quiz.models.js";

// ============== GET ALL QUESTIONS ==============
export const getAllQuestions = async (req, res) => {
  try {
    const { category, difficulty } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const questions = await QuizQuestion.find(query).select(
      "question category type options difficulty"
    );

    return res.status(200).json({
      questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Error in getAllQuestions:", error);
    return res.status(500).json({
      error: "Failed to fetch questions",
      details: error.message,
    });
  }
};

// ============== SUBMIT QUIZ ==============
export const submitQuiz = async (req, res) => {
  try {
    const { email, category, responses } = req.body;
    const userId = req.user?.id || null;

    if (!category || !responses || responses.length === 0) {
      return res.status(400).json({
        error: "Category and responses are required",
      });
    }

    if (!userId && !email) {
      return res.status(400).json({
        error: "Email is required for anonymous users",
      });
    }

    // Validate and calculate score
    let score = 0;
    const validatedResponses = [];

    for (const response of responses) {
      const question = await QuizQuestion.findById(response.questionId);

      if (!question) {
        return res.status(404).json({
          error: `Question not found: ${response.questionId}`,
        });
      }

      const selectedOption = question.options.find(
        (opt) => opt.text === response.selectedAnswer
      );
      const isCorrect = selectedOption && selectedOption.isCorrect;

      if (isCorrect) score++;

      validatedResponses.push({
        questionId: response.questionId,
        selectedAnswer: response.selectedAnswer,
        isCorrect,
      });
    }

    const percentageScore = (score / responses.length) * 100;

    // Save quiz response
    const quizResponse = await QuizResponse.create({
      user: userId,
      email: email || null,
      category,
      responses: validatedResponses,
      score,
      totalQuestions: responses.length,
      percentageScore: Math.round(percentageScore),
    });

    return res.status(200).json({
      message: "Quiz submitted successfully",
      result: {
        score,
        totalQuestions: responses.length,
        percentageScore: Math.round(percentageScore),
        responses: validatedResponses,
      },
      submissionId: quizResponse._id,
    });
  } catch (error) {
    console.error("Error in submitQuiz:", error);
    return res.status(500).json({
      error: "Failed to submit quiz",
      details: error.message,
    });
  }
};

// ============== GET QUIZ STATS ==============
export const getQuizStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;

    const query = { user: userId };
    if (category) query.category = category;

    const userResponses = await QuizResponse.find(query).sort({
      createdAt: -1,
    });

    const totalAttempts = userResponses.length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            userResponses.reduce((sum, r) => sum + r.percentageScore, 0) /
              totalAttempts
          )
        : 0;

    const bestScore =
      totalAttempts > 0
        ? Math.max(...userResponses.map((r) => r.percentageScore))
        : 0;

    return res.status(200).json({
      stats: {
        totalAttempts,
        averageScore,
        bestScore,
        recentAttempts: userResponses.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Error in getQuizStats:", error);
    return res.status(500).json({
      error: "Failed to fetch quiz stats",
      details: error.message,
    });
  }
};

// ============== CREATE QUESTION (ADMIN ONLY) ==============
export const createQuestion = async (req, res) => {
  try {
    const { question, category, type, options, correctAnswer, difficulty, explanation } = req.body;

    if (!question || !category) {
      return res.status(400).json({
        error: "Question and category are required",
      });
    }

    const newQuestion = await QuizQuestion.create({
      question,
      category,
      type: type || "multiple-choice",
      options: options || [],
      correctAnswer: correctAnswer || null,
      difficulty: difficulty || "medium",
      explanation: explanation || "",
    });

    return res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error in createQuestion:", error);
    return res.status(500).json({
      error: "Failed to create question",
      details: error.message,
    });
  }
};
