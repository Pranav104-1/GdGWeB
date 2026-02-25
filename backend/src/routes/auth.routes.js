import { Router } from "express";
import {
  sendOTP,
  verifyOTPLogin,
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
router.post("/send-otp", sendOTP); // Send OTP for login
router.post("/verify-otp", verifyOTPLogin); // Verify OTP for login
router.post("/register", register); // Register with email, username, password (no OTP)
router.post("/login", login); // Login with email and password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);

export default router;
  