# 🚀 GDG Website - Complete Full-Stack Application

A modern, fully-functional Google Developer Group (GDG) website with complete authentication system, responsive design, and professional deployment-ready setup.

## ✨ Features

### Frontend
- ✅ **Responsive Design** - Works on all devices (mobile, tablet, desktop)
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Modern UI** - Attractive animations and smooth transitions
- ✅ **Event Management** - Browse and register for events
- ✅ **Newsletter Signup** - Subscribe for updates
- ✅ **Testimonials** - Real member feedback
- ✅ **About & Contact** - Complete information pages

### Backend
- ✅ **Email-Based OTP** - Secure 6-digit verification
- ✅ **User Authentication** - JWT tokens with refresh mechanism
- ✅ **Password Reset** - Secure token-based password recovery
- ✅ **Profile Management** - Users can update their information
- ✅ **MongoDB Integration** - Scalable database
- ✅ **CORS Enabled** - Full frontend-backend compatibility
- ✅ **Professional Emails** - HTML-formatted email templates

### Security
- 🔒 **Password Hashing** - bcryptjs encryption
- 🔒 **JWT Authentication** - Secure token-based auth
- 🔒 **CORS Protection** - Cross-origin security
- 🔒 **HTTP-Only Cookies** - Secure token storage
- 🔒 **Email Verification** - OTP-based verification

---

## 📦 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js, MongoDB |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcryptjs |
| **Email** | Nodemailer (Gmail) |
| **Deployment** | Heroku, Railway, Render |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Clone & Setup
```bash
# Clone or download the project
cd GdG_Website

# Run setup script (Windows)
setup.bat

# OR for Mac/Linux
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure Environment
Edit `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=generate_a_random_string
REFRESH_TOKEN_SECRET=generate_another_random_string
```

### Step 3: Start Both Servers
```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
python -m http.server 5000
# OR open Frontend/index.html in browser
```

**Done!** 🎉 Visit `http://localhost:5000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:4565/api
```

### Available Endpoints

```
POST   /auth/send-otp              # Send OTP to email
POST   /auth/verify-otp            # Verify OTP & Register
POST   /auth/login                 # Login with email & password
POST   /auth/logout                # Logout (Protected)
POST   /auth/forgot-password       # Send password reset email
POST   /auth/reset-password        # Reset password with token
POST   /auth/refresh-token         # Get new access token
GET    /auth/me                    # Get current user (Protected)
PUT    /auth/profile               # Update user profile (Protected)
GET    /health                     # Health check
```

---

## 🔐 Authentication Flow

### Registration
```
1. User submits email → Backend generates OTP → Email sent
2. User enters OTP → Verified → Asks for password & details
3. Account created → User logged in automatically
```

### Login
```
1. User enters email & password
2. Backend validates credentials
3. JWT token issued → User logged in
```

### Password Reset
```
1. User requests password reset → Reset token generated
2. Email sends reset link with token
3. User sets new password → Password updated
```

---

## 📁 Project Structure

```
GdG_Website/
├── 📄 DEPLOYMENT_GUIDE.md            ← Full deployment guide
├── 📄 README.md                      ← This file
├── 🔧 setup.bat                      ← Windows setup
├── 🔧 setup.sh                       ← Mac/Linux setup
│
├── 📁 backend/
│   ├── src/
│   │   ├── controllers/              ← Business logic
│   │   ├── routes/                   ← API routes
│   │   ├── middlewares/              ← JWT verification
│   │   ├── models/                   ← Database schemas
│   │   ├── utils/                    ← Helper functions
│   │   └── db/                       ← Database connection
│   ├── index.js                      ← Server entry point
│   ├── package.json                  ← Dependencies
│   ├── .env                          ← Environment config
│   └── Readme.md                     ← Backend guide
│
└── 📁 Frontend/
    ├── index.html                    ← Homepage
    ├── login.html                    ← Login page
    ├── register.html                 ← Registration page
    ├── forgot-password.html          ← Password reset page
    ├── about.html                    ← About page
    ├── contact.html                  ← Contact page
    ├── script.js                     ← JavaScript code
    └── styles.css                    ← Styling
```

---

## 🔧 Environment Variables

### Backend `.env` File

```env
# Server
PORT=4565
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=16_character_app_password

# CORS
CORS_ORIGIN=http://localhost:5000
```

### Getting Gmail App Password
1. Go to [Google Account](https://myaccount.google.com)
2. Enable 2-Factor Authentication
3. Go to "App Passwords"
4. Select Mail → Windows Computer
5. Copy the 16-character password

---

## 🎨 Frontend Pages

| Page | Purpose |
|------|---------|
| `index.html` | 🏠 Landing page with events, testimonials, newsletter |
| `login.html` | 🔐 User login with email & password |
| `register.html` | ✍️ User registration with OTP verification |
| `forgot-password.html` | 🔑 Password reset with email link |
| `about.html` | ℹ️ About GDG, mission, values |
| `contact.html` | 📧 Contact form and information |

---

## 🔗 Using AuthAPI in Your Code

```javascript
// 1. Send OTP
const response = await AuthAPI.sendOTP('user@example.com');

// 2. Verify OTP & Register
const response = await AuthAPI.verifyOTP(
  'user@example.com',
  '123456',
  'username',
  'password',
  'John',
  'Doe',
  '+1234567890',
  ['web-dev', 'cloud']
);

// 3. Login
const response = await AuthAPI.login('user@example.com', 'password');

// 4. Check if user is logged in
if (AuthAPI.isAuthenticated()) {
  // User is authenticated
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Welcome', user.username);
}

// 5. Get current user
const response = await AuthAPI.getCurrentUser();

// 6. Update profile
const response = await AuthAPI.updateProfile('John', 'Doe', '+1234567890', ['areas']);

// 7. Logout
const response = await AuthAPI.logout();
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Update `API_BASE_URL` in script.js to production backend URL
4. Deploy

### Backend Deployment (Railway/Render)
1. Create account on Railway or Render
2. Connect GitHub repository
3. Add environment variables from `.env`
4. Deploy

**For detailed deployment guide, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

---

## 🧪 Testing

### Test OTP Registration
1. Go to `register.html`
2. Enter email → "Send OTP"
3. Check email for OTP
4. Enter OTP and complete registration

### Test Login
1. Go to `login.html`
2. Enter credentials
3. You should be logged in

### Test Password Reset
1. Go to `forgot-password.html`
2. Enter email
3. Check email for reset link
4. Set new password

---

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  phone: String,
  profileImage: String,
  areasOfInterest: [String],
  isEmailVerified: Boolean,
  isActive: Boolean,
  role: String (user/organizer/admin),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcryptjs (salt rounds: 10)
- [x] JWT tokens with expiry (24h for access, 7d for refresh)
- [x] OTP expires after 10 minutes
- [x] HTTP-only cookies for token storage
- [x] CORS enabled only for frontend
- [x] Reset tokens valid for 1 hour
- [x] Email verification required
- [x] Rate limiting ready (express-rate-limit installed)

---

## 🐛 Troubleshooting

### Issue: OTP not sending
**Solution:** Check Gmail app password and enable 2FA

### Issue: CORS error
**Solution:** Verify `FRONTEND_URL` in `.env` matches actual frontend URL

### Issue: Can't login
**Solution:** Check MongoDB connection and verify user exists

### Issue: Port already in use
**Solution:** Change PORT in `.env` or kill the process using the port

---

## 📞 Support

For help:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review backend [Readme.md](backend/Readme.md)
3. Check console for error messages
4. Verify all `.env` variables are set

---

## 📝 Features Checklist

- [x] Complete authentication system
- [x] Email-based OTP verification
- [x] Password reset functionality
- [x] User profile management
- [x] Responsive design
- [x] Dark mode support
- [x] Event management
- [x] Newsletter signup
- [x] Professional email templates
- [x] CORS configured
- [x] Deployment ready
- [x] Mobile-friendly

---

## 🎓 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Explained](https://jwt.io/introduction)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙌 Contributing

Feel free to fork, modify, and use this project for your GDG community!

---

## 📧 Questions?

Refer to the comprehensive guides:
- **Setup & Configuration** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Backend Details** → [backend/Readme.md](backend/Readme.md)
- **API Endpoints** → Check DEPLOYMENT_GUIDE.md

---

**Built with ❤️ for GDG Community**

**Happy Coding! 🚀**
