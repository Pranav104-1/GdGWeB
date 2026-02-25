// CORRECTED verifyOTP FUNCTION FOR BACKEND
// Replace the existing verifyOTP in d:\GdG_Website\backend\src\controllers\auth.controllers.js

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Find user with OTP fields selected
    let user = await auth
      .findOne({ email })
      .select("+otp +otpExpiry +otpAttempts");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    // OTP verified successfully - Mark email as verified
    user.isEmailVerified = true;
    user.clearOTP();
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
      message: "Email verified successfully",
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
    console.error("Error in verifyOTP:", error);
    return res.status(500).json({
      error: "Failed to verify OTP",
      details: error.message,
    });
  }
};
