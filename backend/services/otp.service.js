const OTP = require("../models/OTP");

// Generate 6-digit OTP
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Save OTP to database
exports.saveOTP = async (email, otp) => {
  try {
    // Delete existing OTP for this email
    await OTP.deleteMany({ email });

    // Create new OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const otpRecord = await OTP.create({
      email,
      otp,
      expiresAt,
    });

    return {
      success: true,
      message: "OTP saved successfully",
      data: otpRecord,
    };
  } catch (error) {
    console.error("Error saving OTP:", error);
    return {
      success: false,
      message: "Failed to save OTP",
      error: error.message,
    };
  }
};

// Verify OTP
exports.verifyOTP = async (email, otp) => {
  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return {
        success: false,
        message: "OTP expired",
      };
    }

    // Check attempts
    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return {
        success: false,
        message: "Maximum OTP verification attempts exceeded",
      };
    }

    // Mark as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpRecord._id });

    return {
      success: true,
      message: "OTP verified successfully",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    };
  }
};

// Increment OTP attempts
exports.incrementOTPAttempts = async (email) => {
  try {
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return {
        success: false,
        message: "OTP not found",
      };
    }

    otpRecord.attempts += 1;
    await otpRecord.save();

    return {
      success: true,
      attempts: otpRecord.attempts,
      maxAttempts: otpRecord.maxAttempts,
    };
  } catch (error) {
    console.error("Error incrementing OTP attempts:", error);
    return {
      success: false,
      message: "Failed to update OTP attempts",
    };
  }
};
