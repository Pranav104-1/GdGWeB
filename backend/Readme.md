# GDG Website Backend

Complete authentication backend with email-based OTP verification system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` file with your configuration:
```
PORT=4565
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CORS_ORIGIN=http://localhost:5000
```

### 3. Start Server
```bash
npm run dev
```

Server runs on: `http://localhost:4565`

---

## 📚 API Documentation

### Authentication Endpoints

#### Send OTP
```
POST /api/auth/send-otp
Body: { "email": "user@example.com" }
```

#### Verify OTP & Register
```
POST /api/auth/verify-otp
Body: { "email", "otp", "username", "password", "firstName", "lastName", "phone" }
```

#### Login
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
```

#### Logout (Protected)
```
POST /api/auth/logout
Header: Authorization: Bearer token
```

#### Get Current User (Protected)
```
GET /api/auth/me
Header: Authorization: Bearer token
```

#### Update Profile (Protected)
```
PUT /api/auth/profile
Header: Authorization: Bearer token
Body: { "firstName", "lastName", "phone", "areasOfInterest" }
```

#### Forgot Password
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```

#### Reset Password
```
POST /api/auth/reset-password
Body: { "token": "reset_token", "newPassword": "newpassword123" }
```

#### Refresh Token
```
POST /api/auth/refresh-token
```

---

## 🔐 Features

✅ Email-based OTP verification (6-digit, 10 min expiry)
✅ Secure password hashing with bcryptjs
✅ JWT token authentication (24h expiry)
✅ Refresh token mechanism (7d expiry)
✅ Password reset with secure tokens
✅ User profile management
✅ CORS fully configured
✅ MongoDB with Mongoose
✅ Professional HTML email templates
✅ Rate limiting ready

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controllers.js    # All auth logic
│   ├── routes/
│   │   └── auth.routes.js         # API routes
│   ├── middlewares/
│   │   └── auth.middlewares.js    # JWT verification
│   ├── models/
│   │   └── auth.models.js         # User schema
│   ├── utils/
│   │   ├── email.utils.js         # Email templates
│   │   └── token.utils.js         # Token generation
│   └── db/
│       └── db.js                  # MongoDB connection
├── index.js                       # Server entry point
├── package.json
├── .env                          # Environment config
└── Readme.md
```

---

## 🔧 Technologies Used

- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

---

## 📊 User Schema

```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed),
  isEmailVerified: Boolean,
  firstName: String,
  lastName: String,
  phone: String,
  areasOfInterest: [String],
  profileImage: String,
  role: String (user/organizer/admin),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 CORS Setup

Configured to accept requests from frontend with:
- ✅ Credentials enabled (cookies)
- ✅ All HTTP methods (GET, POST, PUT, DELETE)
- ✅ Authorization headers
- ✅ Content-Type headers

---

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for:
- Heroku deployment
- Railway deployment
- Render deployment
- Environment setup
- Production checklist

---

## 📞 Support

For issues check:
1. `.env` file has all required variables
2. MongoDB connection string is valid
3. Gmail app password is correct
4. Frontend FRONTEND_URL matches in .env

**Last Updated:** February 2026

```

**Request Body:**

```json
{
  "username": "string"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "string",
    "username": "string"
  },
  "token": "string",
  "userId": "string"
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "username": "string"
}
```

**Response:**

```json
{
  "message": "User logged in successfully",
  "token": "string",
  "userId": "string"
}
```

#### Logout

```http
POST /auth/logout
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Todo Endpoints

All todo endpoints require authentication. Include the JWT token in cookies.

#### Create Todo

```http
POST /todos/create
```

**Request Body:**

```json
{
  "title": "string",
  "description": "string"
}
```

**Response:**

```json
{
  "message": "Todo created successfully"
}
```

#### Update Todo

```http
PUT /todos/update/:id
```

**Parameters:**

- `id`: Todo ID (string)

**Request Body:**

```json
{
  "title": "string",
  "description": "string"
}
```

**Response:**

```json
{
  "message": "Todo updated successfully",
  "todo": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "userID": "string",
    "created_at": "date"
  }
}
```

#### Delete Todo

```http
DELETE /todos/delete/:id
```

**Parameters:**

- `id`: Todo ID (string)

**Response:**

```json
{
  "message": "Todo deleted successfully"
}
```

#### Get User's Todos

```http
GET /todos/user/:userId
```

**Parameters:**

- `userId`: User ID (string)

**Response:**

```json
{
  "todos": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "userID": "string",
      "created_at": "date"
    }
  ]
}
```

## Error Responses

The API returns appropriate HTTP status codes and error messages:

- `400` Bad Request - Missing or invalid parameters
- `401` Unauthorized - Missing or invalid authentication
- `404` Not Found - Resource not found
- `409` Conflict - Resource already exists (e.g., username)
- `500` Internal Server Error - Server-side error

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a .env file with:

```env
MONGODB_URI=your_mongodb_uri
MONGODB_DATABASE=your_database_name
PORT=5000
JWT_SECRET=your_jwt_secret
```

3. Start the server:

```bash
npm run dev
```
