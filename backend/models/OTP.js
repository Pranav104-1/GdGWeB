const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
      index: { expires: 0 }, // MongoDB will automatically delete document after expiration
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", otpSchema);
