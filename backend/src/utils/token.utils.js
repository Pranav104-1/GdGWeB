import crypto from "crypto";
import jwt from "jsonwebtoken";

// Generate a random 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT Token
export const generateToken = (userId, expiresIn = "24h") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

// Generate Refresh Token
export const generateRefreshToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn });
};

// Generate Reset Token
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Verify Token
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
