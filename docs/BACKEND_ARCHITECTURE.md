# GDG Website Backend Architecture

## Overview

This document outlines the backend architecture, database design, and API endpoints for the Google Developer Group website. The backend is built with Node.js/Express and uses MongoDB for data persistence.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Error Handling](#error-handling)
7. [Environment Variables](#environment-variables)

---

## Technology Stack

### Backend Framework & Tools

| Tool | Purpose | Version |
|------|---------|---------|
| **Node.js** | Runtime environment | 14+ |
| **Express.js** | Web framework | ^5.1.0 |
| **MongoDB** | NoSQL database | Latest |
| **Mongoose** | ODM library | ^8.17.2 |
| **JWT** | Authentication token | ^9.0.2 |
| **bcryptjs** | Password hashing | ^2.4.3 |
| **nodemon** | Dev tool (auto-reload) | ^3.1.10 |
| **cors** | Cross-Origin Resource Sharing | ^2.8.5 |
| **dotenv** | Environment variables | ^17.2.1 |
| **express-rate-limit** | API rate limiting | ^8.0.1 |
| **cookie-parser** | Cookie handling | ^1.4.7 |

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controllers.js
│   │   ├── events.controllers.js
│   │   ├── users.controllers.js
│   │   └── newsletter.controllers.js
│   ├── models/              # Database schemas
│   │   ├── auth.models.js
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Newsletter.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── events.routes.js
│   │   ├── users.routes.js
│   │   └── newsletter.routes.js
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middlewares.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── db/                  # Database connection
│   │   └── db.js
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── emailService.js
│   │   └── passwordUtils.js
│   └── config/              # Configuration files
│       └── constants.js
├── index.js                 # Entry point
├── .env                     # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment file
├── package.json
├── package-lock.json
└── Readme.md
```

---

## Database Schema

### 1. User Schema

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed, required),
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  skills: [String],
  bio: String,
  profileImage: String (URL),
  darkModePreference: Boolean (default: false),
  registeredEvents: [ObjectId], // References to Event
  createdAt: Date (auto),
  updatedAt: Date (auto),
  isActive: Boolean (default: true),
  role: String (enum: ['user', 'moderator', 'admin'])
}
```

### 2. Event Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (enum: ['Web Dev', 'Mobile Dev', 'Cloud', 'AI/ML', 'Other']),
  date: Date (required),
  time: String,
  duration: Number, // in minutes
  location: String (required),
  venue: {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number
  },
  speaker: ObjectId, // Reference to User
  speakers: [ObjectId], // Multiple speakers
  registeredUsers: [ObjectId], // References to User
  maxAttendees: Number,
  image: String (URL),
  level: String (enum: ['Beginner', 'Intermediate', 'Advanced']),
  tags: [String],
  learningOutcomes: [String],
  resourceLinks: [
    {
      title: String,
      url: String
    }
  ],
  createdBy: ObjectId, // Reference to User
  createdAt: Date (auto),
  updatedAt: Date (auto),
  status: String (enum: ['upcoming', 'ongoing', 'completed', 'cancelled']),
  googleMeetLink: String,
  recordingLink: String
}
```

### 3. Newsletter Schema

```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  subscribedAt: Date (auto),
  preferences: {
    webDevelopment: Boolean,
    mobileDevelopment: Boolean,
    cloud: Boolean,
    aiml: Boolean,
    general: Boolean
  },
  isActive: Boolean (default: true),
  unsubscribedAt: Date,
  lastEmailSent: Date
}
```

### 4. Feedback Schema

```javascript
{
  _id: ObjectId,
  eventId: ObjectId, // Reference to Event
  userId: ObjectId, // Reference to User
  rating: Number (1-5),
  comment: String,
  suggestions: String,
  createdAt: Date (auto)
}
```

---

## API Endpoints

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. User Registration
```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. User Login
```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### 3. User Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 4. Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

Request Body:
{
  "email": "john@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### 5. Reset Password
```http
POST /auth/reset-password/:token
Content-Type: application/json

Request Body:
{
  "newPassword": "NewSecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Password reset successful"
}
```

#### 6. Refresh Token
```http
POST /auth/refresh-token
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "newToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### User Endpoints

#### 1. Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "skills": ["React", "Node.js", "MongoDB"],
    "registeredEvents": ["507f1f77bcf86cd799439012"]
  }
}
```

#### 2. Update User Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Full Stack Developer",
  "skills": ["React", "Node.js", "MongoDB"]
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### 3. Get All Users (Admin Only)
```http
GET /users
Authorization: Bearer {token}
Query Parameters:
  ?page=1&limit=10&role=user

Response (200 OK):
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### 4. Get User By ID
```http
GET /users/:userId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "user": { ... }
}
```

#### 5. Delete User Account
```http
DELETE /users/profile
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

### Event Endpoints

#### 1. Get All Events
```http
GET /events
Query Parameters:
  ?category=Web%20Dev&level=Beginner&page=1&limit=10&sort=-date

Response (200 OK):
{
  "success": true,
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### 2. Get Event By ID
```http
GET /events/:eventId

Response (200 OK):
{
  "success": true,
  "event": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "React Advanced Patterns",
    "description": "...",
    "category": "Web Dev",
    "date": "2025-03-15T18:00:00Z",
    "registeredUsers": [...],
    "speakers": [...]
  }
}
```

#### 3. Create Event (Admin/Moderator Only)
```http
POST /events
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "React Advanced Patterns",
  "description": "Learn advanced patterns in React",
  "category": "Web Dev",
  "date": "2025-03-15T18:00:00Z",
  "time": "18:00 - 20:00",
  "duration": 120,
  "location": "Tech Hub, New York",
  "level": "Advanced",
  "maxAttendees": 100,
  "speakers": ["507f1f77bcf86cd799439010"],
  "learningOutcomes": ["Hooks Patterns", "Performance Optimization"],
  "tags": ["React", "JavaScript", "Frontend"]
}

Response (201 Created):
{
  "success": true,
  "message": "Event created successfully",
  "event": { ... }
}
```

#### 4. Update Event (Creator/Admin Only)
```http
PUT /events/:eventId
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "Updated Event Title",
  "description": "Updated description",
  ...
}

Response (200 OK):
{
  "success": true,
  "message": "Event updated successfully",
  "event": { ... }
}
```

#### 5. Delete Event (Creator/Admin Only)
```http
DELETE /events/:eventId
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Event deleted successfully"
}
```

#### 6. Register for Event
```http
POST /events/:eventId/register
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Successfully registered for event",
  "event": { ... }
}
```

#### 7. Unregister from Event
```http
POST /events/:eventId/unregister
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "message": "Successfully unregistered from event"
}
```

#### 8. Get Registered Events
```http
GET /events/registered/list
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true,
  "events": [...]
}
```

---

### Newsletter Endpoints

#### 1. Subscribe to Newsletter
```http
POST /newsletter/subscribe
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "preferences": {
    "webDevelopment": true,
    "mobileDevelopment": false,
    "cloud": true,
    "aiml": false,
    "general": true
  }
}

Response (201 Created):
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

#### 2. Unsubscribe from Newsletter
```http
POST /newsletter/unsubscribe/:token

Response (200 OK):
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

#### 3. Update Preferences
```http
PUT /newsletter/:email/preferences
Content-Type: application/json

Request Body:
{
  "webDevelopment": true,
  "mobileDevelopment": true,
  "cloud": false,
  "aiml": true,
  "general": true
}

Response (200 OK):
{
  "success": true,
  "message": "Preferences updated"
}
```

---

## Authentication & Authorization

### JWT Token Structure

```javascript
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user",
  "iat": 1609459200,
  "exp": 1609545600  // 24 hours from issuance
}
```

### Token Storage

- **Frontend**: Store JWT in HTTP-Only Cookies (secure)
- **Backend**: Set Via `Set-Cookie` header on login/registration
- **Transmission**: Include in `Authorization: Bearer {token}` header

### Authorization Levels

| Role | Permissions |
|------|-------------|
| **user** | View profile, register for events, update preferences |
| **moderator** | Create/edit events, view all users, respond to feedback |
| **admin** | Full system access, manage users, manage events, view analytics |

### Middleware Chain

```
Request → CORS → Rate Limit → Parse Body → Verify JWT (if needed) → Route Handler → Response
```

---

## Error Handling

### Standard Error Response Format

```javascript
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "details": "Username or password is incorrect"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_002 | 401 | Token expired |
| AUTH_003 | 401 | Unauthorized access |
| VALIDATION_001 | 400 | Invalid input data |
| NOT_FOUND_001 | 404 | Resource not found |
| SERVER_001 | 500 | Internal server error |
| RATE_LIMIT_001 | 429 | Too many requests |

---

## Environment Variables

Create a `.env` file in the backend root directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdg_website?retryWrites=true&w=majority
DB_NAME=gdg_website

# Token Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@gdgwebsite.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:8000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# External Services
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

---

## Running the Backend

### Development

```bash
npm install
npm run dev
```

The server will run on `http://localhost:5000`

### Production

```bash
npm install --production
NODE_ENV=production npm start
```

---

## Security Best Practices

1. **Password Hashing**: Use bcryptjs with salt rounds ≥ 10
2. **JWT Storage**: Use HTTP-Only Cookies (prevent XSS)
3. **CORS**: Whitelist only trusted domains
4. **Rate Limiting**: Implement on all public endpoints
5. **Input Validation**: Validate all inputs server-side
6. **Environment Variables**: Never commit `.env` to Git
7. **HTTPS**: Use HTTPS in production
8. **SQL Injection**: Use Mongoose (ORM) to prevent attacks
9. **Data Sanitization**: Sanitize user inputs

---

## Integration with Frontend

The frontend communicates with the backend via REST API endpoints. Make sure to:

1. Update the API base URL in the frontend when deploying
2. Handle JWT token refresh before expiration
3. Show appropriate error messages to users
4. Implement proper loading states
5. Cache responses where appropriate

---

## Next Steps

1. ✅ Set up MongoDB Atlas account
2. ✅ Create `.env` file with configurations
3. ✅ Install dependencies: `npm install`
4. ✅ Test API endpoints with Postman/Insomnia
5. ✅ Deploy to production server
6. ✅ Monitor logs and performance
