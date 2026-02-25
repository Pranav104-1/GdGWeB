const { validationResult } = require("express-validator");

// Validate email format
exports.validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate password strength
exports.validatePassword = (password) => {
  // At least 8 characters
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  return {
    valid: true,
    message: "Password is valid",
  };
};

// Validate OTP format
exports.validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Validate name
exports.validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return {
      valid: false,
      message: "Name must be at least 2 characters long",
    };
  }

  return {
    valid: true,
    message: "Name is valid",
  };
};
