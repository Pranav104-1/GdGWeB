# GDG Website - Complete Setup & Deployment Guide

## 📋 Project Overview

This is a complete Google Developer Group (GDG) website with:
- **Frontend**: HTML5, CSS3, Vanilla JavaScript with dark mode and responsive design
- **Backend**: Node.js/Express with MongoDB
- **Authentication**: Email-based OTP verification system
- **CORS**: Properly configured for frontend-backend communication

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email OTP)

---

## 📦 Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=4565
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@gdgweb.ycog6lf.mongodb.net/gdg_website?appName=GDGWEB

# JWT Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this_in_production

# Email Configuration (Gmail)
EMAIL_USER=your_gmail_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:5000

# Token Expiry
ACCESS_TOKEN_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
```

#### Getting Gmail App Password:
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Enable 2-Factor Authentication
3. Go to App Passwords
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password to `EMAIL_PASSWORD`

### 3. Start Backend Server
```bash
npm run dev
```

Server will run on: `http://localhost:4565`

---

## 🎨 Frontend Setup

### 1. Update API Configuration

The frontend already has API configuration in `script.js`:

```javascript
const API_BASE_URL = 'http://localhost:4565/api';
const AUTH_API = `${API_BASE_URL}/auth`;
```

### 2. Start Frontend Server

Simply open `index.html` in a browser or use a simple HTTP server:

```bash
# Using Python
python -m http.server 5000

# Or using Node.js http-server
npx http-server -p 5000
```

Frontend will run on: `http://localhost:5000`

---

## 🔗 API Endpoints

### Authentication Endpoints

#### 1. Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "OTP sent successfully to your email",
  "email": "user@example.com"
}
```

#### 2. Verify OTP & Register
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "username": "johndoe",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "areasOfInterest": ["web-dev", "cloud"]
}

Response:
{
  "message": "Email verified successfully",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  }
}
```

#### 3. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": { ... }
}
```

#### 4. Logout
```
POST /api/auth/logout
Authorization: Bearer token_here

Response:
{
  "message": "Logout successful"
}
```

#### 5. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "If an account with this email exists, a reset link has been sent"
}
```

#### 6. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

#### 7. Get Current User
```
GET /api/auth/me
Authorization: Bearer token_here

Response:
{
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isEmailVerified": true,
    "areasOfInterest": ["web-dev", "cloud"],
    "role": "user"
  }
}
```

#### 8. Update Profile
```
PUT /api/auth/profile
Authorization: Bearer token_here
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "areasOfInterest": ["web-dev", "cloud", "ai-ml"]
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 9. Refresh Token
```
POST /api/auth/refresh-token

Response:
{
  "message": "Token refreshed successfully",
  "token": "new_jwt_token"
}
```

---

## 🔐 Authentication Flow

### Registration Flow
1. User enters email → Click "Send OTP"
2. Backend generates 6-digit OTP → Sends via email
3. User receives email → Enters OTP
4. User fills registration form → Username, password, name, phone
5. Backend verifies OTP → Creates user → Issues JWT token
6. User is logged in automatically

### Login Flow
1. User enters email & password
2. Backend verifies credentials
3. Backend issues JWT token
4. User is redirected to dashboard

### Password Reset Flow
1. User enters email → Click "Forgot Password"
2. Backend generates reset token → Sends reset link via email
3. User clicks link from email
4. User enters new password
5. Backend validates token → Updates password
6. User can login with new password

---

## 📁 Project Structure

```
GdG_Website/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controllers.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── middlewares/
│   │   │   └── auth.middlewares.js
│   │   ├── models/
│   │   │   └── auth.models.js
│   │   ├── utils/
│   │   │   ├── email.utils.js
│   │   │   └── token.utils.js
│   │   └── db/
│   │       └── db.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── Frontend/
    ├── index.html
    ├── login.html
    ├── register.html
    ├── forgot-password.html
    ├── contact.html
    ├── about.html
    ├── script.js
    └── styles.css
```

---

## 🌐 CORS Configuration

CORS is configured in `backend/index.js`:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5000",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
```

This allows:
- Requests from frontend URL
- Cookies to be sent with requests
- All necessary HTTP methods
- Authorization header for JWT tokens

---

## 📝 Using AuthAPI in Frontend

The frontend has a built-in `AuthAPI` class for all authentication operations:

```javascript
// Send OTP
const response = await AuthAPI.sendOTP('user@example.com');

// Verify OTP & Register
const response = await AuthAPI.verifyOTP(
  'user@example.com',
  '123456',
  'username',
  'password',
  'John',
  'Doe',
  '+1234567890',
  ['web-dev']
);

// Login
const response = await AuthAPI.login('user@example.com', 'password');

// Logout
const response = await AuthAPI.logout();

// Get Current User
const response = await AuthAPI.getCurrentUser();

// Update Profile
const response = await AuthAPI.updateProfile('John', 'Doe', '+1234567890', ['web-dev']);

// Check if authenticated
if (AuthAPI.isAuthenticated()) {
  // User is logged in
}

// Get token
const token = AuthAPI.getAuthToken();
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Update `API_BASE_URL` in `script.js`:
```javascript
const API_BASE_URL = 'https://your-backend-domain.com/api';
```
4. Deploy

### Backend Deployment (Heroku/Railway)

#### Using Railway:
1. Create Railway project
2. Connect GitHub repository
3. Add environment variables (same as `.env` file)
4. Deploy

#### Using Render:
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

#### Production `.env` settings:
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=generate_a_strong_random_string
REFRESH_TOKEN_SECRET=generate_another_strong_random_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

---

## 🔍 Testing the System

### Test Registration:
1. Go to `register.html`
2. Enter email → Click "Send OTP"
3. Check email for OTP
4. Enter OTP and complete registration
5. Should be redirected to dashboard

### Test Login:
1. Go to `login.html`
2. Enter email and password
3. Click "Login"
4. Should be authenticated

### Test Forgot Password:
1. Go to `forgot-password.html`
2. Enter email
3. Check email for reset link
4. Follow link to reset password
5. Login with new password

---

## 🆘 Troubleshooting

### OTP not sending?
- Check Gmail app password is correct
- Enable "Less secure app access" if needed
- Check spam folder for emails

### CORS errors?
- Verify `FRONTEND_URL` in backend `.env` matches actual frontend URL
- Check browser console for specific CORS error
- Ensure credentials: true is set in fetch requests

### Login not working?
- Check if MongoDB is connected
- Verify JWT_SECRET is set in `.env`
- Check backend logs for errors

### Tokens not persisting?
- Check localStorage in browser DevTools
- Verify credentials: true in fetch calls
- Check cookie settings in browser

---

## 📧 Email Templates

All emails are professionally formatted with:
- Welcome emails for new users
- OTP verification emails
- Password reset emails with unique token links
- Branded design with gradient backgrounds

---

## 🔒 Security Features

✅ Password hashing (bcryptjs)
✅ JWT token-based authentication
✅ Email verification with OTP
✅ Password reset with secure tokens
✅ CORS security
✅ HTTP-only cookies
✅ Rate limiting ready (express-rate-limit installed)

---

## 📞 Support

For issues or questions:
1. Check the API endpoint documentation above
2. Review browser console for errors
3. Check backend logs for server errors
4. Verify all `.env` variables are set correctly

---

**Happy Coding! 🚀**
