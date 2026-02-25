# 🔌 API Endpoints Cheat Sheet

## Base URL
```
http://localhost:4565/api
```

## Authentication Headers
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

---

## 🔐 AUTH ENDPOINTS

### Register User
```
POST /auth/register
No auth required

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Success (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { user object },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login with Email & Password
```
POST /auth/login
No auth required

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Success (200): Same structure as register
```

### Send OTP Email
```
POST /auth/send-otp
No auth required

Body:
{
  "email": "user@example.com"
}

Success (200):
{
  "success": true,
  "message": "OTP sent successfully"
}

Note: OTP valid for 5 minutes
```

### Verify OTP & Login
```
POST /auth/verify-otp
No auth required

Body:
{
  "email": "user@example.com",
  "otp": "123456"
}

Success (200): Returns user, token, refreshToken
```

### Get Current User
```
GET /auth/me
Auth required: Yes

Success (200):
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": { user object }
  }
}
```

### Logout
```
POST /auth/logout
Auth required: Yes

Success (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🎯 EVENT ENDPOINTS

### Get All Events
```
GET /events
Auth required: No
Query params: None

Success (200):
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "events": [ ... ],
    "count": 5
  }
}
```

### Get Single Event
```
GET /events/:id
Auth required: No
Params: id (event ID)

Success (200):
{
  "success": true,
  "data": {
    "event": { event object },
    "registrationCount": 25
  }
}
```

### Register for Event
```
POST /events/:eventId/register
Auth required: Yes
Params: eventId (event ID)

Success (201):
{
  "success": true,
  "message": "Registered for event successfully",
  "data": {
    "registration": { registration object }
  }
}
```

### Check if Registered for Event
```
GET /events/:eventId/is-registered
Auth required: Yes
Params: eventId (event ID)

Success (200):
{
  "success": true,
  "data": {
    "isRegistered": true,
    "registration": { registration object or null }
  }
}
```

### Get User's Registered Events
```
GET /events/user/my-events
Auth required: Yes

Success (200):
{
  "success": true,
  "data": {
    "events": [ ... ],
    "count": 3
  }
}
```

### Get User's Event Registrations
```
GET /events/user/registrations
Auth required: Yes

Success (200):
{
  "success": true,
  "data": {
    "registrations": [ ... ],
    "count": 3
  }
}
```

### Cancel Event Registration
```
DELETE /events/registrations/:registrationId
Auth required: Yes
Params: registrationId (registration ID)

Success (200):
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

### Create Event (Admin)
```
POST /events
Auth required: Yes (Admin only)

Body:
{
  "title": "Workshop Title",
  "description": "Event description",
  "date": "2024-03-15T10:00:00Z",
  "location": "CSMU Campus",
  "maxParticipants": 50
}

Success (201):
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event": { event object }
  }
}
```

### Update Event (Admin)
```
PUT /events/:id
Auth required: Yes (Admin only)
Params: id (event ID)

Body: (any of these fields)
{
  "title": "New Title",
  "description": "New description",
  "date": "2024-03-20T10:00:00Z",
  "location": "New location",
  "maxParticipants": 75,
  "status": "ongoing"
}

Success (200):
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "event": { updated event object }
  }
}
```

### Delete Event (Admin)
```
DELETE /events/:id
Auth required: Yes (Admin only)
Params: id (event ID)

Success (200):
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Get Event Registrations (Admin)
```
GET /events/:id/registrations
Auth required: Yes (Admin only)
Params: id (event ID)

Success (200):
{
  "success": true,
  "data": {
    "registrations": [ ... ],
    "count": 25
  }
}
```

---

## 👑 ADMIN ENDPOINTS

### Get All Users
```
GET /admin/users
Auth required: Yes (Admin only)

Success (200):
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [ ... ],
    "count": 150
  }
}
```

### Get User Details
```
GET /admin/users/:id
Auth required: Yes (Admin only)
Params: id (user ID)

Success (200):
{
  "success": true,
  "data": {
    "user": { user object },
    "registrations": [ ... ]
  }
}
```

### Delete User
```
DELETE /admin/users/:id
Auth required: Yes (Admin only)
Params: id (user ID)

Success (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Update User Role
```
PUT /admin/users/:id/role
Auth required: Yes (Admin only)
Params: id (user ID)

Body:
{
  "role": "admin" // or "user"
}

Success (200):
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": { updated user object }
  }
}
```

### Get All Registrations
```
GET /admin/registrations
Auth required: Yes (Admin only)

Success (200):
{
  "success": true,
  "message": "Registrations retrieved successfully",
  "data": {
    "registrations": [ ... ],
    "count": 450
  }
}
```

### Get Event Registrations (Admin View)
```
GET /admin/events/:eventId/registrations
Auth required: Yes (Admin only)
Params: eventId (event ID)

Success (200):
{
  "success": true,
  "data": {
    "event": { event object },
    "registrations": [ ... ],
    "count": 25
  }
}
```

### Get Dashboard Statistics
```
GET /admin/statistics
Auth required: Yes (Admin only)

Success (200):
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalAdmins": 3,
    "regularUsers": 147,
    "totalEvents": 12,
    "upcomingEvents": 5,
    "totalRegistrations": 450,
    "recentRegistrations": [ ... ]
  }
}
```

---

## 🔧 UTILITY ENDPOINTS

### Health Check
```
GET /api/health
No auth required

Success (200):
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 📋 User Object Structure

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "isVerified": true,
  "profileImage": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 📋 Event Object Structure

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Web Development Workshop",
  "description": "Learn modern web development",
  "date": "2024-03-15T10:00:00Z",
  "location": "CSMU Campus, Hall A",
  "maxParticipants": 50,
  "currentParticipants": 25,
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "image": null,
  "status": "upcoming",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 📋 Registration Object Structure

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "eventId": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Web Development Workshop",
    "date": "2024-03-15T10:00:00Z"
  },
  "registeredAt": "2024-01-15T12:30:00Z",
  "status": "registered",
  "createdAt": "2024-01-15T12:30:00Z",
  "updatedAt": "2024-01-15T12:30:00Z"
}
```

---

## ❌ Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Event not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Quick Test Commands

### Using cURL

```bash
# Health check
curl http://localhost:4565/api/health

# Register
curl -X POST http://localhost:4565/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'

# Login
curl -X POST http://localhost:4565/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'

# Get all events
curl http://localhost:4565/api/events

# Get current user (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:4565/api/auth/me
```

### Using Postman
1. Import the endpoints above
2. Set `Authorization` header to `Bearer {token}`
3. Use `Tests` tab to automatically extract token from login response

---

## 📊 Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

---

Keep this cheat sheet handy while developing!
