const User = require("../models/User");
const OTP = require("../models/OTP");
const { generateToken, generateRefreshToken } = require("../services/token.service");
const { sendOTPEmail, sendWelcomeEmail } = require("../services/email.service");
const { generateOTP, saveOTP, verifyOTP } = require("../services/otp.service");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP: validateOTPFormat,
} = require("../utils/validators");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide all required fields");
    }

    // Validate email format
    if (!validateEmail(email)) {
      return sendError(res, 400, "Please provide a valid email");
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return sendError(res, 400, passwordValidation.message);
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return sendError(res, 400, nameValidation.message);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 409, "User with this email already exists");
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      isVerified: true, // Mark as verified after registration
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    return sendSuccess(res, 201, "User registered successfully", {
      user: user.toJSON(),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return sendError(res, 500, "Error registering user", error.message);
  }
};

// @desc    Login user with password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    // Validate email format
    if (!validateEmail(email)) {
      return sendError(res, 400, "Please provide a valid email");
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return sendError(res, 401, "Invalid credentials");
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid credentials");
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return sendSuccess(res, 200, "Login successful", {
      user: user.toJSON(),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Error logging in", error.message);
  }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return sendError(res, 400, "Please provide email");
    }

    // Validate email format
    if (!validateEmail(email)) {
      return sendError(res, 400, "Please provide a valid email");
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    const result = await saveOTP(email.toLowerCase(), otp);
    if (!result.success) {
      return sendError(res, 500, "Failed to generate OTP");
    }

    // Send OTP via email
    const emailResult = await sendOTPEmail(email.toLowerCase(), otp);
    if (!emailResult.success) {
      // Even if email fails, we still saved the OTP
      console.error("Failed to send OTP email:", emailResult.error);
      // In production, you might want to fail here or use a fallback
    }

    return sendSuccess(res, 200, "OTP sent successfully");
  } catch (error) {
    console.error("Send OTP error:", error);
    return sendError(res, 500, "Error sending OTP", error.message);
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return sendError(res, 400, "Please provide email and OTP");
    }

    // Validate OTP format
    if (!validateOTPFormat(otp)) {
      return sendError(res, 400, "Please provide a valid 6-digit OTP");
    }

    // Verify OTP
    const otpResult = await verifyOTP(email.toLowerCase(), otp);
    if (!otpResult.success) {
      return sendError(res, 401, otpResult.message);
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create user with OTP
      user = await User.create({
        email: email.toLowerCase(),
        isVerified: true,
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return sendSuccess(res, 200, "OTP verified successfully", {
      user: user.toJSON(),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return sendError(res, 500, "Error verifying OTP", error.message);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return sendSuccess(res, 200, "User retrieved successfully", {
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    return sendError(res, 500, "Error retrieving user", error.message);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    return sendSuccess(res, 200, "Logged out successfully");
  } catch (error) {
    return sendError(res, 500, "Error logging out");
  }
};
