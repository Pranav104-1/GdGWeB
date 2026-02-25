# 🚀 QUICK START GUIDE - GDG CSMU BACKEND

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and update:
```
MONGODB_URI=mongodb://localhost:27017/gdg-csmu
JWT_SECRET=your_random_secret_key_here_32_chars_min
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Server
```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

**Server runs at:** `http://localhost:4565`

---

## 📧 Email Setup (For OTP)

### Using Gmail:
1. Enable 2-Factor Authentication
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" + your device
4. Copy 16-character password
5. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

### Using Other Providers:
- **Outlook/Hotmail**: Use app password
- **Yahoo**: Create "Application Password"
- **SendGrid/AWS SES**: Use API keys

---

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community
# MongoDB runs on localhost:27017

# Windows
# Download from https://www.mongodb.com/try/download/community
# Run installer and start MongoDB service

# Linux
# Follow https://docs.mongodb.com/manual/installation/
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create Free Cluster
3. Add network access (0.0.0.0/0 for testing)
4. Get connection string
5. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdg-csmu
   ```

---

## ✅ Test Your Backend

### Health Check
```bash
curl http://localhost:4565/api/health
```

### Test Registration
```bash
curl -X POST http://localhost:4565/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:4565/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

---

## 🔗 Frontend Connection

In your frontend's `script.js`, verify:
```javascript
const API_BASE_URL = "http://localhost:4565/api";
```

---

## 🎯 API Routes Summary

| Method | Endpoint | Protected | Purpose |
|--------|----------|-----------|---------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login with password |
| POST | `/auth/send-otp` | No | Send OTP to email |
| POST | `/auth/verify-otp` | No | Verify OTP and login |
| GET | `/auth/me` | Yes | Get current user |
| GET | `/events` | No | List all events |
| GET | `/events/:id` | No | Get event details |
| POST | `/events/:eventId/register` | Yes | Register for event |
| POST | `/events` | Yes* | Create event (admin) |
| DELETE | `/events/:id` | Yes* | Delete event (admin) |
| GET | `/admin/users` | Yes* | List all users (admin) |
| DELETE | `/admin/users/:id` | Yes* | Delete user (admin) |
| GET | `/admin/statistics` | Yes* | Dashboard stats (admin) |

*Admin only

---

## 📁 File Structure Created

```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controllers.js
│   ├── event.controllers.js
│   ├── admin.controllers.js
│   └── registration.controllers.js
├── middleware/
│   ├── auth.middleware.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Registration.js
│   └── OTP.js
├── routes/
│   ├── auth.routes.js
│   ├── event.routes.js
│   └── admin.routes.js
├── services/
│   ├── email.service.js
│   ├── token.service.js
│   └── otp.service.js
├── utils/
│   ├── validators.js
│   ├── responseHandler.js
│   └── errors.js
├── app.js
├── server.js
├── index.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🛠️ Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "Port 4565 already in use"
```bash
# Kill process using port 4565
# macOS/Linux:
lsof -i :4565
kill -9 <PID>

# Windows:
netstat -ano | findstr :4565
taskkill /PID <PID> /F

# Or change PORT in .env to 5000
```

### "MongoDB connection refused"
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Try: `mongod` (start MongoDB server)

### "Email not sending"
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail: use 16-character app password
- Check spam folder

---

## 🔐 Security Notes

✅ **Do's**
- Use strong JWT_SECRET (32+ characters)
- Change .env values for production
- Always use HTTPS in production
- Keep node_modules out of git (.gitignore)

❌ **Don'ts**
- Never commit .env file
- Never hardcode secrets
- Don't expose MongoDB URI publicly
- Don't use same password everywhere

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [MongoDB Guide](https://docs.mongodb.com)
- [JWT.io](https://jwt.io)
- [Nodemailer Docs](https://nodemailer.com)

---

## 🎉 You're All Set!

Your backend is ready to power the GDG CSMU frontend!

**Next Steps:**
1. ✅ Run `npm install`
2. ✅ Set up `.env` file
3. ✅ Start MongoDB
4. ✅ Run `npm run dev`
5. ✅ Connect frontend to API
6. ✅ Test authentication workflow

For detailed API documentation, see [README.md](./README.md)

---

**Need Help?** Check the README.md or contact the GDG CSMU team!
