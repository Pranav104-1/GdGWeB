const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);

// Protected routes
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

module.exports = router;
