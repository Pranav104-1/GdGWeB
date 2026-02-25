import nodemailer from "nodemailer";

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send OTP email
export const sendOTPEmail = async (email, otp, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification OTP - GDG Website",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to GDG Website!</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Hi ${username},</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Your email verification OTP is valid for the next <strong>10 minutes</strong>.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <p style="color: #999; font-size: 14px; margin: 0; margin-bottom: 10px;">Your OTP Code</p>
            <h1 style="color: #ffffff; font-size: 48px; letter-spacing: 5px; margin: 0; font-weight: bold;">
              ${otp}
            </h1>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            If you didn't request this OTP, please ignore this email or contact our support team.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              For security reasons, never share your OTP with anyone. Google Developer Group will never ask for your OTP via email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    };
  }
};

// Function to send reset password email
export const sendResetPasswordEmail = async (email, resetToken, username) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - GDG Website",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Hi ${username},</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to reset it.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This link will expire in <strong>1 hour</strong>. If you didn't request this, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If the button doesn't work, copy and paste this link in your browser:<br>
              <span style="word-break: break-all; color: #667eea;">${resetLink}</span>
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Reset email sent successfully" };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return {
      success: false,
      message: "Failed to send reset email",
      error: error.message,
    };
  }
};

// Function to send welcome email
export const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to GDG Website!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">🎉 Welcome to Google Developer Group!</h2>
          <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Hi ${username},</p>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Thank you for joining our community. We're excited to have you on board!
          </p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Complete your profile with profile picture and bio</li>
              <li>Browse our upcoming events and workshops</li>
              <li>Join our community discussions</li>
              <li>Connect with other developers</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Explore Our Community
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              If you have any questions, feel free to reach out to our support team.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Welcome email sent successfully" };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      message: "Failed to send welcome email",
      error: error.message,
    };
  }
};
