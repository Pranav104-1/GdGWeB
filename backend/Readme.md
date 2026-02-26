# GdGWeB Backend - Authentication System

A simple and error-free Express.js backend with MongoDB authentication system, supporting user registration, login, and admin management APIs.

## Features

- ✅ User Registration & Login with email/password
- ✅ JWT Token-based Authentication
- ✅ Password Hashing with bcryptjs
- ✅ MongoDB Integration
- ✅ Admin APIs for user management
- ✅ Role-based Access Control (User/Admin)
- ✅ CORS configured for frontend
- ✅ Comprehensive error handling

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── User.js               # User schema
├── controllers/
│   ├── authController.js     # Auth logic
│   └── adminController.js    # Admin logic
├── middleware/
│   ├── auth.js               # Authentication middleware
│   └── errorHandler.js       # Error handling
├── routes/
│   ├── auth.js               # Auth routes
│   └── admin.js              # Admin routes
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Installation

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB connection string and JWT secret

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in .env**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=https://gdgweb.netlify.app/
   NODE_ENV=development
   ```

## MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get your connection string from "Connect" > "Connect your application"
4. Add it to your `.env` file as `MONGODB_URI`

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
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
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer jwt_token_here

Response (200):
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Admin Routes (`/api/admin`) - Requires Admin Access

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer admin_jwt_token

Response (200):
{
  "success": true,
  "count": 5,
  "users": [...]
}
```

#### Get User by ID
```
GET /api/admin/users/:id
Authorization: Bearer admin_jwt_token

Response (200):
{
  "success": true,
  "user": {...}
}
```

#### Update User
```
PUT /api/admin/users/:id
Authorization: Bearer admin_jwt_token
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin",
  "isActive": true
}

Response (200):
{
  "success": true,
  "message": "User updated successfully",
  "user": {...}
}
```

#### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer admin_jwt_token

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Get Statistics
```
GET /api/admin/stats
Authorization: Bearer admin_jwt_token

Response (200):
{
  "success": true,
  "stats": {
    "totalUsers": 10,
    "adminUsers": 1,
    "regularUsers": 9,
    "activeUsers": 9
  }
}
```

### Health Check
```
GET /api/health

Response (200):
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-26T10:30:00.000Z"
}
```

## Frontend Integration

All authentication tokens should be sent in the Authorization header:

```javascript
const token = localStorage.getItem('token');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

Example in JavaScript:
```javascript
// Register
const response = await fetch('https://your-backend-url/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

// Login
const response = await fetch('https://your-backend-url/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

// Get current user (with auth)
const response = await fetch('https://your-backend-url/api/auth/me', {
  headers: headers
});
```

## Error Handling

All errors return a standardized response:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials or missing token)
- `403` - Forbidden (admin access required)
- `404` - Not Found
- `500` - Server Error

## Security Notes

1. **Never commit `.env` file** - Use `.env.example` as template
2. **Change JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Keep dependencies updated** - `npm update`
5. **Validate all inputs** before processing
6. **Don't expose sensitive data** in responses

## Making Users Admin

To promote a user to admin, update their role directly in MongoDB:

```javascript
// In MongoDB shell or compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or use the update user endpoint if you have admin access.

## Troubleshooting

**MongoDB Connection Error:**
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**JWT Error:**
- Verify JWT_SECRET is set correctly
- Check token hasn't expired
- Ensure token format is `Bearer <token>`

**CORS Error:**
- Check `FRONTEND_URL` in `.env` matches your frontend domain
- Verify frontend is sending requests to correct backend URL

## Additional Commands

```bash
# Install new package
npm install package-name

# Dev dependencies
npm install --save-dev package-name

# See installed packages
npm list
```

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
