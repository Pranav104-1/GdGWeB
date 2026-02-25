import { auth } from "../models/auth.models.js";
import {
  generateOTP,
  generateToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
} from "../utils/token.utils.js";
import {
  sendOTPEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
} from "../utils/email.utils.js";

// ============== SEND OTP FOR LOGIN ==============
// This endpoint is only for OTP-based login, not for registration
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists (must be registered)
    const user = await auth.findOne({ email });

    if (!user) {
      // User doesn't exist - direct them to register first
      return res.status(404).json({ 
        error: "User not found. Please register first.",
        requiresRegistration: true,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update existing user with OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0;
    user.lastOtpSent = new Date();
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.username);

    if (!emailResult.success) {
      return res.status(500).json({
        error: "Failed to send OTP email",
        details: emailResult.message,
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully to your email",
      email,
    });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json({
      error: "Failed to send OTP",
      details: error.message,
    });
  }
};

// ============== VERIFY OTP LOGIN ==============
// This endpoint verifies OTP for login only (not for registration)
export const verifyOTPLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: "Email and OTP are required" });
    }

    // Find user
    const user = await auth
      .findOne({ email })
      .select("+otp +otpExpiry +otpAttempts");

    if (!user) {
      return res.status(404).json({ error: "User not found. Please register first." });
    }

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= 3) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
      }
      await user.save();
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP verified successfully - clear OTP fields
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "OTP verified successfully. Logged in!",
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Error in verifyOTPLogin:", error);
    return res.status(500).json({
      error: "Failed to verify OTP",
      details: error.message,
    });
  }
};

// ============== REGISTER ==============
// Simple password-based registration - no OTP required
export const register = async (req, res) => {
  try {
    const { email, username, password, firstName = '', lastName = '', phone = '' } = req.body;

    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Email, username, and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Check if email already exists
    const existingEmail = await auth.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already registered. Please login." });
    }

    // Check if username already exists
    const existingUsername = await auth.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already taken. Choose a different one." });
    }

    // Create new user
    const newUser = await auth.create({
      email,
      username,
      password, // Will be hashed by mongoose pre-save middleware
      firstName,
      lastName,
      phone,
      isEmailVerified: true, // Password registration doesn't need email verification
    });

    // Generate tokens
    const token = generateToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Send welcome email
    await sendWelcomeEmail(email, username);

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Registration successful!",
      token,
      refreshToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
};

// ============== LOGIN ==============
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Find user with password field
    const user = await auth
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        error: "Please verify your email first",
        requiresOTPVerification: true,
      });
    }

    // Compare passwords
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
};

// ============== FORGOT PASSWORD ==============
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const user = await auth.findOne({ email });

    if (!user) {
      // Don't reveal if email exists
      return res.status(200).json({
        message: "If an account with this email exists, a reset link has been sent",
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const emailResult = await sendResetPasswordEmail(
      email,
      resetToken,
      user.username
    );

    if (!emailResult.success) {
      return res.status(500).json({
        error: "Failed to send reset email",
        details: emailResult.message,
      });
    }

    return res.status(200).json({
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({
      error: "Failed to process password reset",
      details: error.message,
    });
  }
};

// ============== RESET PASSWORD ==============
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    // Find user with reset token
    const user = await auth
      .findOne({ resetToken: token })
      .select("+resetToken +resetTokenExpiry");

    if (!user) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    // Check if token is expired
    if (new Date() > user.resetTokenExpiry) {
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
      return res.status(400).json({ error: "Reset token has expired" });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      error: "Failed to reset password",
      details: error.message,
    });
  }
};

// ============== GET CURRENT USER ==============
export const getCurrentUser = async (req, res) => {
  try {
    const user = await auth.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        areasOfInterest: user.areasOfInterest,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(500).json({
      error: "Failed to get user",
      details: error.message,
    });
  }
};

// ============== UPDATE PROFILE ==============
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, areasOfInterest } = req.body;

    const user = await auth.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phone,
        areasOfInterest,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImage: user.profileImage,
        isEmailVerified: user.isEmailVerified,
        areasOfInterest: user.areasOfInterest,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      error: "Failed to update profile",
      details: error.message,
    });
  }
};

// ============== LOGOUT ==============
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({
      error: "Failed to logout",
      details: error.message,
    });
  }
};

// ============== REFRESH TOKEN ==============
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "Refresh token not found" });
    }

    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newToken = generateToken(decoded.userId);

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
    return res.status(500).json({
      error: "Failed to refresh token",
      details: error.message,
    });
  }
};

// ============== INTERNAL HELPER FUNCTION ==============
async function verifyOTPInternal(
  email,
  otp,
  username,
  password,
  firstName,
  lastName,
  phone
) {
  try {
    let user = await auth
      .findOne({ email })
      .select("+otp +otpExpiry +otpAttempts");

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (new Date() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return { success: false, error: "OTP has expired" };
    }

    if (user.otp !== otp) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= 3) {
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.otpAttempts = 0;
      }
      await user.save();
      return { success: false, error: "Invalid OTP" };
    }

    user.isEmailVerified = true;
    user.clearOTP();
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await sendWelcomeEmail(email, user.username);

    return {
      success: true,
      message: "Registration successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.isEmailVerified,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
