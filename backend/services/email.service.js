const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email
exports.sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "GDG CSMU - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">GDG CSMU</h1>
            <p style="margin: 5px 0; font-size: 14px;">Google Developer Group at CSMU College</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; text-align: center;">
            <h2 style="color: #333; margin-bottom: 20px;">Your Login OTP</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">One-Time Password</p>
              <h3 style="color: #667eea; letter-spacing: 5px; margin: 10px 0; font-size: 32px;">${otp}</h3>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">This OTP will expire in 5 minutes</p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              If you did not request this OTP, please ignore this email.
            </p>
          </div>
          
          <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p style="margin: 5px 0;">© 2024 GDG CSMU. All rights reserved.</p>
            <p style="margin: 5px 0;"><strong>Do not share this OTP with anyone</strong></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    };
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to GDG CSMU",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">GDG CSMU</h1>
          </div>
          
          <div style="background: white; padding: 30px; color: #333;">
            <h2 style="color: #667eea; margin-bottom: 20px;">Welcome ${name}! 🎉</h2>
            
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0;">
              Thank you for joining the Google Developer Group at CSMU College!
            </p>
            
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0;">
              We're excited to have you as part of our community. Get ready to:
            </p>
            
            <ul style="font-size: 14px; line-height: 1.8; color: #555;">
              <li>🎓 Learn from industry experts</li>
              <li>🤝 Network with fellow developers</li>
              <li>💻 Build amazing projects</li>
              <li>🏆 Win amazing prizes</li>
            </ul>
            
            <p style="font-size: 14px; line-height: 1.6; margin: 20px 0 10px 0;">
              Stay tuned for upcoming events and workshops!
            </p>
          </div>
          
          <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px;">
            <p style="margin: 5px 0;">© 2024 GDG CSMU. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Welcome email sent successfully",
    };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      message: "Failed to send welcome email",
    };
  }
};
