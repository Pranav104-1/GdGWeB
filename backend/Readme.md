# GDG CSMU Backend API Documentation

A production-ready Node.js/Express backend API for the GDG CSMU website with comprehensive authentication, event management, and admin dashboard features.

---

## 🚀 Features

### ✅ Authentication System
- **Password-based login/registration** with bcrypt hashing
- **OTP-based authentication** via email (6-digit, 5-minute expiry)
- **JWT token generation** for secure API access
- **Refresh token support** for long-lived sessions
- **Email verification** with Nodemailer

### 👥 User Management
- User profiles with roles (admin, user)
- User verification system
- Secure password handling
- User activity tracking

### 🎯 Event Management
- Create, read, update, delete events (admin only)
- Event registration for users
- Capacity management
- Event status tracking (upcoming, ongoing, completed)
- User registration history

### 🔐 Admin Dashboard Backend
- View all registered users
- Delete users from system
- Manage events
- View all event registrations
- Dashboard statistics
- User role management

### 🛡️ Security Features
- CORS protection
- Helmet security headers
- Rate limiting (general + auth-specific)
- NoSQL injection prevention
- Input validation & sanitization
- JWT authentication middleware
- Role-based access control

---

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + OTP
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator

---

## 📦 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and update these values:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a strong random string)
# - EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD (for OTP)
# - FRONTEND_URL (your frontend URL)
```

### Step 3: Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The API will be available at: `http://localhost:4565`

---

## 🔌 API Endpoints

### 📍 Base URL
```
http://localhost:4565/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 2. Login with Password
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 3. Send OTP
```
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 4. Verify OTP & Login
```
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### 5. Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": { /* user object */ }
  }
}
```

### 6. Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🎯 Event Endpoints

### 1. Get All Events
```
GET /events

Response (200):
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "events": [ /* array of events */ ],
    "count": 5
  }
}
```

### 2. Get Single Event
```
GET /events/:id

Response (200):
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "event": { /* event object */ },
    "registrationCount": 25
  }
}
```

### 3. Register for Event (Protected)
```
POST /events/:eventId/register
Authorization: Bearer {token}

Response (201):
{
  "success": true,
  "message": "Registered for event successfully",
  "data": {
    "registration": { /* registration object */ }
  }
}
```

### 4. Check Registration Status (Protected)
```
GET /events/:eventId/is-registered
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Registration status retrieved",
  "data": {
    "isRegistered": true,
    "registration": { /* registration object or null */ }
  }
}
```

### 5. Get User's Events (Protected)
```
GET /events/user/my-events
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User events retrieved successfully",
  "data": {
    "events": [ /* array of registered events */ ],
    "count": 3
  }
}
```

### 6. Cancel Event Registration (Protected)
```
DELETE /events/registrations/:registrationId
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

### 7. Create Event (Admin Only)
```
POST /events
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Web Development Workshop",
  "description": "Learn modern web development",
  "date": "2024-03-15T10:00:00Z",
  "location": "CSMU Campus, Hall A",
  "maxParticipants": 50
}

Response (201):
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event": { /* event object */ }
  }
}
```

### 8. Update Event (Admin Only)
```
PUT /events/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "maxParticipants": 75
}

Response (200):
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "event": { /* updated event object */ }
  }
}
```

### 9. Delete Event (Admin Only)
```
DELETE /events/:id
Authorization: Bearer {admin_token}

Response (200):
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 👑 Admin Endpoints

**All admin endpoints require:**
```
Authorization: Bearer {admin_token}
```

### 1. Get All Users
```
GET /admin/users

Response (200): Array of all users with count
```

### 2. Get User by ID
```
GET /admin/users/:id

Response (200): User details + their registrations
```

### 3. Delete User
```
DELETE /admin/users/:id

Response (200): User deleted
```

### 4. Update User Role
```
PUT /admin/users/:id/role
Content-Type: application/json

{
  "role": "admin" // or "user"
}

Response (200): Updated user
```

### 5. Get All Registrations
```
GET /admin/registrations

Response (200): All registrations with user and event details
```

### 6. Get Event Registrations
```
GET /admin/events/:eventId/registrations

Response (200): Registrations for specific event
```

### 7. Get Dashboard Statistics
```
GET /admin/statistics

Response (200):
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalAdmins": 3,
    "regularUsers": 147,
    "totalEvents": 12,
    "upcomingEvents": 5,
    "totalRegistrations": 450,
    "recentRegistrations": [ /* last 10 */ ]
  }
}
```

---

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed, optional for OTP),
  role: String ("user" | "admin"),
  isVerified: Boolean,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  date: Date,
  location: String,
  maxParticipants: Number,
  currentParticipants: Number,
  createdBy: ObjectId (User),
  image: String,
  status: String ("upcoming" | "ongoing" | "completed"),
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Model
```javascript
{
  userId: ObjectId (User),
  eventId: ObjectId (Event),
  registeredAt: Date,
  status: String ("registered" | "attended" | "cancelled"),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Model
```javascript
{
  email: String,
  otp: String (6-digit),
  expiresAt: Date (5 minutes),
  attempts: Number,
  maxAttempts: Number (default: 3),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` file to version control
- Use strong, random JWT_SECRET (min 32 characters)
- Rotate secrets periodically

### API Usage
- Always use HTTPS in production
- Include JWT token in Authorization header: `Bearer {token}`
- Implement rate limiting on client side

### Email Configuration
- Use app-specific passwords (not main account password)
- For Gmail: https://myaccount.google.com/apppasswords
- Enable 2-factor authentication

### MongoDB
- Use MongoDB Atlas with network access controls
- Enable authentication
- Use connection string with credentials

---

## 🧪 Testing Endpoints

### Using Postman / cURL

```bash
# Test API Health
curl http://localhost:4565/api/health

# Register a user
curl -X POST http://localhost:4565/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'

# Send OTP
curl -X POST http://localhost:4565/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

---

## 🐛 Error Handling

All endpoints follow standard HTTP status codes:

- **200 OK** - Successful GET/PUT/PATCH
- **201 Created** - Successful POST
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing/invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Resource already exists
- **500 Internal Server Error** - Server error

Error response format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

---

## 📝 Environment Setup Guide

### For Development

1. **MongoDB Local Setup**
   ```bash
   # Install MongoDB Community Edition
   # macOS: brew install mongodb-community
   # Windows: Download from https://www.mongodb.com/try/download/community
   # Linux: Follow official MongoDB documentation
   
   # Start MongoDB
   mongod
   ```

2. **Email Configuration (Gmail)**
   - Create Gmail account or use existing
   - Go to: https://myaccount.google.com/apppasswords
   - Select Mail + Windows/Mac/Linux
   - Copy the 16-character password
   - Add to .env:
     ```
     EMAIL_SERVICE=gmail
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASSWORD=16-char-app-password
     ```

3. **Generate JWT Secret**
   ```bash
   # Generate secure random string
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### For Production

1. **MongoDB Atlas**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create cluster
   - Get connection string
   - Add to .env as MONGODB_URI

2. **Email Service**
   - Use SendGrid or AWS SES for better deliverability
   - Or use Gmail with app-specific password

3. **Environment Variables**
   - Set strong, random JWT secrets
   - Use production URLs
   - Enable HTTPS

---

## 📚 Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controllers/
│   ├── auth.controllers.js   # Auth logic
│   ├── event.controllers.js  # Event CRUD
│   ├── admin.controllers.js  # Admin functions
│   └── registration.controllers.js # Registration logic
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   └── errorHandler.js       # Error handling
├── models/
│   ├── User.js              # User schema
│   ├── Event.js             # Event schema
│   ├── Registration.js       # Registration schema
│   └── OTP.js               # OTP schema
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   ├── event.routes.js      # Event endpoints
│   └── admin.routes.js      # Admin endpoints
├── services/
│   ├── email.service.js     # Email sending
│   ├── token.service.js     # JWT generation
│   └── otp.service.js       # OTP management
├── utils/
│   ├── validators.js        # Input validation
│   ├── responseHandler.js   # Response formatting
│   └── errors.js            # Error classes
├── app.js                   # Express setup
├── server.js                # Server startup
├── package.json             # Dependencies
├── .env.example             # Env template
└── README.md                # This file
```

---

## 🚀 Deployment

### Heroku Deployment

```bash
# Create Heroku account and install CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
# ... set other variables

# Deploy
git push heroku main
```

### Railway or Render Deployment

- Connect GitHub repository
- Set environment variables in dashboard
- Auto-deploys on push

### Docker Deployment

```bash
# Create Dockerfile
# Build and run Docker image
docker build -t gdg-csmu-backend .
docker run -p 4565:4565 gdg-csmu-backend
```

---

## 📞 Support & Troubleshooting

### Common Issues

1. **"Port 4565 already in use"**
   - Kill existing process: `lsof -i :4565` then `kill -9 <PID>`
   - Or change PORT in .env

2. **"Cannot connect to MongoDB"**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env
   - Verify database name is correct

3. **"Email not sending"**
   - Check EMAIL_USER and EMAIL_PASSWORD
   - For Gmail: use app-specific password
   - Check email service in .env

4. **"JWT token errors"**
   - Ensure token is included in Authorization header
   - Format: `Authorization: Bearer <token>`
   - Check JWT_SECRET matches between server and tokens

---

## 📄 License

MIT License - Feel free to use this project

---

## 👥 Contributing

Contributions welcome! Please follow code structure and security practices.

---

**Built with ❤️ for GDG CSMU Community**
