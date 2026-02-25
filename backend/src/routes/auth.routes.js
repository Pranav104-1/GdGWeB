import { Router } from "express";
import {
  sendOTP,
  verifyOTP,
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);

export default router;
  