# 📚 API Reference Guide

## Base URL
```
http://localhost:4565/api
```

---

## 🔐 Authentication Endpoints

### 1. Send OTP
Sends a 6-digit OTP to the provided email for verification.

```
POST /auth/send-otp
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response (200 OK):
{
  "message": "OTP sent successfully to your email",
  "email": "user@example.com"
}

Error (400):
{
  "error": "Email is required"
}
```

**Notes:**
- OTP is valid for 10 minutes
- OTP is sent via HTML email
- Can request new OTP if first one expires

---

### 2. Verify OTP & Register
Verifies the OTP and creates a new user account.

```
POST /auth/verify-otp
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "otp": "123456",
  "username": "johndoe",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "areasOfInterest": ["web-dev", "cloud", "ai-ml"]
}

Response (200 OK):
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  }
}

Error (400):
{
  "error": "Invalid OTP"
}
```

**Notes:**
- Password must be at least 6 characters
- Username must be unique
- Welcome email is automatically sent
- User is logged in immediately

---

### 3. Login
Authenticates user with email and password.

```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  }
}

Error (401):
{
  "error": "Invalid email or password"
}
```

**Notes:**
- Email must be verified to login
- Token is stored in HTTP-only cookie
- Token expires in 24 hours
- Login sets two cookies: token and refreshToken

---

### 4. Get Current User ⚡
Retrieves the profile of the currently authenticated user.

```
GET /auth/me
Authorization: Bearer <token>

Response (200 OK):
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profileImage": null,
    "isEmailVerified": true,
    "areasOfInterest": ["web-dev", "cloud"],
    "role": "user"
  }
}

Error (401):
{
  "error": "Unauthorized: No token provided"
}
```

**Notes:**
- Requires valid JWT token
- Token must be in Authorization header or cookie
- Returns full user profile

---

### 5. Update Profile ⚡
Updates the user's profile information.

```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "areasOfInterest": ["web-dev", "cloud", "ai-ml"]
}

Response (200 OK):
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profileImage": null,
    "isEmailVerified": true,
    "areasOfInterest": ["web-dev", "cloud", "ai-ml"]
  }
}

Error (401):
{
  "error": "Unauthorized: No token provided"
}
```

**Notes:**
- Requires valid JWT token
- All fields are optional
- Only provided fields are updated

---

### 6. Logout ⚡
Logs out the user and clears authentication tokens.

```
POST /auth/logout
Authorization: Bearer <token>

Response (200 OK):
{
  "message": "Logout successful"
}

Error (401):
{
  "error": "Unauthorized: No token provided"
}
```

**Notes:**
- Clears token and refreshToken cookies
- Clears user data from localStorage
- Requires valid JWT token

---

### 7. Forgot Password
Sends a password reset email with a secure token.

```
POST /auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "user@example.com"
}

Response (200 OK):
{
  "message": "If an account with this email exists, a reset link has been sent"
}

Error (400):
{
  "error": "Email is required"
}
```

**Notes:**
- Always returns success message (for security)
- Reset link is valid for 1 hour
- Email contains secure reset token
- No user enumeration is possible

---

### 8. Reset Password
Resets the user's password using a reset token.

```
POST /auth/reset-password
Content-Type: application/json

Request Body:
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu",
  "newPassword": "NewSecurePassword123!"
}

Response (200 OK):
{
  "message": "Password reset successfully"
}

Error (400):
{
  "error": "Reset token has expired"
}
```

**Notes:**
- Token is sent via email
- Token expires in 1 hour
- New password must be at least 6 characters
- User can login immediately with new password

---

### 9. Refresh Token
Generates a new access token using the refresh token.

```
POST /auth/refresh-token

Response (200 OK):
{
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error (401):
{
  "error": "Invalid refresh token"
}
```

**Notes:**
- Uses refreshToken cookie
- Generates new access token
- Refresh token remains valid for 7 days
- Call this when access token expires

---

## ✅ Health Check

### API Health Status
```
GET /health

Response (200 OK):
{
  "message": "Server is running"
}
```

---

## 🔒 Authentication Notes

### Token Format
```
Authorization: Bearer <token>
```

### Token Storage
- Access Token: HTTP-only cookie (24h expiry)
- Refresh Token: HTTP-only cookie (7d expiry)
- Also stored in localStorage for frontend use

### Protected Endpoints
Endpoints marked with ⚡ require valid JWT token:
- `GET /auth/me`
- `PUT /auth/profile`
- `POST /auth/logout`

### Headers Required
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🚀 Implementation Example

### Using Fetch API
```javascript
// Send OTP
const response = await fetch('http://localhost:4565/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'user@example.com' })
});

// Login
const response = await fetch('http://localhost:4565/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Get protected resource
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:4565/api/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
});
```

### Using AuthAPI Class (Frontend)
```javascript
// Send OTP
await AuthAPI.sendOTP('user@example.com');

// Login
await AuthAPI.login('user@example.com', 'password');

// Check auth
if (AuthAPI.isAuthenticated()) {
  // User is logged in
}

// Get current user
const response = await AuthAPI.getCurrentUser();

// Logout
await AuthAPI.logout();
```

---

## 📊 Error Handling

### Common Error Codes

| Status | Code | Meaning |
|--------|------|---------|
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid or missing token |
| 403 | Forbidden | Email not verified |
| 404 | Not Found | User not found |
| 409 | Conflict | Username/Email already exists |
| 500 | Server Error | Internal server error |

### Example Error Response
```json
{
  "error": "Invalid email or password",
  "details": "Optional error details for debugging"
}
```

---

## 🔄 Request/Response Flow

```
Client                          Server
  |                              |
  |------ POST /send-otp ------->|
  |                              | Generate OTP
  |                              | Send Email
  |<----- OTP Sent Message ------|
  |                              |
  |------ POST /verify-otp ----->|
  |                              | Verify OTP
  | (with otp + registration     | Create User
  |  details)                    | Generate JWT
  |<----- JWT Token + User ------|
  |                              |
  | (Token stored automatically) |
  |------ GET /auth/me --------->|
  | (with Authorization header)  | Verify Token
  |                              | Return User Data
  |<----- User Profile ---------|
  |                              |
```

---

## 📝 Testing with cURL

```bash
# Send OTP
curl -X POST http://localhost:4565/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Login
curl -X POST http://localhost:4565/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user
curl -X GET http://localhost:4565/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -b cookies.txt

# Health check
curl http://localhost:4565/api/health
```

---

## ⚠️ Important Notes

1. **CORS Enabled** - Frontend URL must match `FRONTEND_URL` in `.env`
2. **Credentials Required** - Use `credentials: 'include'` in fetch requests
3. **Email Verification** - Users must verify email to login
4. **Token Expiry** - Access tokens expire in 24 hours
5. **Rate Limiting** - Configure rate limiting for production
6. **HTTPS Only** - Use HTTPS in production (`secure: true` in cookies)

---

For more details, see [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
