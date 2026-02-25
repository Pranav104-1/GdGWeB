// REPLACEMENT FOR verifyOTP METHOD IN AuthAPI CLASS
// Replace the existing verifyOTP method with this one:

  // Verify OTP for login (email verification)
  static async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${AUTH_API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { error: error.message };
    }
  }
