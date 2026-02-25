# Backend Setup & Integration Guide

## Quick Start Guide

This guide will help you set up the backend server and integrate it with the frontend.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Backend](#running-the-backend)
5. [Frontend Integration](#frontend-integration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)

---

## Prerequisites

### System Requirements

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - **OR** MongoDB Atlas (Cloud) - [Create Free Account](https://www.mongodb.com/cloud/atlas)

### Recommended Tools

- **Postman** - API testing - [Download](https://www.postman.com/downloads/)
- **VS Code** - Code editor - [Download](https://code.visualstudio.com/)
- **Git** - Version control - [Download](https://git-scm.com/)

---

## Installation

### Step 1: Navigate to Backend Directory

```bash
cd GdG_Website/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json`:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- And more...

### Step 3: Verify Installation

```bash
npm list
```

This shows all installed packages and their versions.

---

## Configuration

### Step 1: Create Environment File

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your values:

```bash
# ==================== SERVER ====================
PORT=5000
NODE_ENV=development

# ==================== DATABASE ====================
# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/gdg_website
DB_NAME=gdg_website

# Option 2: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdg_website?retryWrites=true&w=majority

# ==================== JWT TOKENS ====================
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_also_long
REFRESH_TOKEN_EXPIRE=7d

# ==================== EMAIL SERVICE ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

# Go to: https://myaccount.google.com/apppasswords (requires 2FA enabled)
# Create app password for Gmail

EMAIL_FROM=noreply@gdgwebsite.com

# ==================== CORS ====================
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:8000,https://yourdomain.com

# ==================== RATE LIMITING ====================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ==================== OAUTH (Optional) ====================
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_secret_here

# ==================== FRONTEND URL ====================
FRONTEND_URL=http://localhost:3000
```

### Step 3: Generate Secure Keys

For JWT_SECRET and REFRESH_TOKEN_SECRET, generate secure random keys:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use this online generator: [Generate Random String](https://www.random.org/strings/)

---

## Running the Backend

### Development Mode (Recommended)

```bash
npm run dev
```

This uses `nodemon` to auto-reload on file changes.

**Expected Output:**
```
> nodemon index.js

[nodemon] 3.1.10
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
Server is running on port 5000
Database connected successfully!
```

### Production Mode

```bash
NODE_ENV=production npm start
```

---

## Frontend Integration

### Step 1: Configure API Base URL

In the frontend, update the API endpoint configuration.

For `Frontend/script.js`, add at the top:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
// For production: const API_BASE_URL = 'https://your-api-domain.com/api';
```

### Step 2: Update Existing Functions

Update all existing API calls to use the new backend:

#### Login Example

**Before:**
```javascript
function handleLogin(event) {
    event.preventDefault();
    // Local storage only
    const email = document.getElementById('login-email').value;
    localStorage.setItem('userEmail', email);
    showModal('✓', 'Welcome!', 'You have logged in successfully!');
}
```

**After:**
```javascript
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showErrorModal('Login Failed', data.error.message);
            return;
        }
        
        localStorage.setItem('token', data.token);
        showModal('✓', 'Welcome!', 'You have logged in successfully!');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } catch (error) {
        showErrorModal('Error', error.message);
    }
}
```

### Step 3: Add Helper Functions

Create a helper function for API calls:

```javascript
// API Helper Function
async function callAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
        credentials: 'include'
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
    }
    
    return data;
}
```

### Step 4: Update Event Registration

```javascript
async function registerEvent(eventId) {
    try {
        const data = await callAPI(`/events/${eventId}/register`, 'POST');
        showModal('✓', 'Success!', 'You have registered for the event!');
    } catch (error) {
        showErrorModal('Registration Failed', error.message);
    }
}
```

### Step 5: Fetch and Display Events

```javascript
async function loadEvents() {
    try {
        const data = await callAPI('/events');
        
        const eventsGrid = document.querySelector('.events-grid');
        eventsGrid.innerHTML = data.events.map(event => `
            <div class="event-card">
                <div class="event-image">${event.category}</div>
                <div class="event-content">
                    <div class="event-tag">${event.level}</div>
                    <h3>${event.title}</h3>
                    <div class="event-date">📅 ${new Date(event.date).toLocaleDateString()}</div>
                    <p class="event-description">${event.description.substring(0, 100)}...</p>
                    <div class="event-footer">
                        <span class="event-attendees">${event.registeredUsers.length} attending</span>
                        <button class="event-btn" onclick="registerEvent('${event._id}')">Register</button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load events:', error);
    }
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', loadEvents);
```

### Step 6: Update Newsletter Subscription

```javascript
async function subscribeNewsletter(event) {
    event.preventDefault();
    
    const email = document.querySelector('.newsletter-form input').value;
    
    try {
        await callAPI('/newsletter/subscribe', 'POST', {
            email,
            preferences: {
                webDevelopment: true,
                mobileDevelopment: true,
                cloud: true,
                aiml: true,
                general: true
            }
        });
        
        showModal('✓', 'Subscribed!', 'Thank you for subscribing to our newsletter!');
        document.querySelector('.newsletter-form input').value = '';
    } catch (error) {
        showErrorModal('Subscription Failed', error.message);
    }
}
```

---

## Testing

### Using Postman

1. **Download Postman** - [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Create New Collection** - Name it "GDG API"

3. **Add Requests** - Add requests for each endpoint:

#### Test Registration

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPass123!",
  "firstName": "Test",
  "lastName": "User"
}
```

#### Test Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

#### Test Get Events

```
GET http://localhost:5000/api/events
```

#### Test Create Event (Requires Token)

```
POST http://localhost:5000/api/events
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "title": "Test Event",
  "description": "A test event",
  "category": "Web Dev",
  "date": "2025-03-15T18:00:00Z",
  "location": "Tech Hub",
  "level": "Beginner"
}
```

### Command Line Testing (using curl)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Get Events
curl http://localhost:5000/api/events
```

---

## Deployment

### Deploy to Heroku

#### Step 1: Install Heroku CLI

```bash
npm install -g heroku
```

#### Step 2: Login to Heroku

```bash
heroku login
```

#### Step 3: Create Heroku App

```bash
heroku create your-app-name
```

#### Step 4: Set Environment Variables

```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gdg
heroku config:set NODE_ENV=production
```

#### Step 5: Deploy

```bash
git push heroku main
```

### Deploy to Railway.app

#### Step 1: Create Account

Visit [https://railway.app](https://railway.app)

#### Step 2: Connect GitHub Repository

Follow their UI to connect your repo

#### Step 3: Add MongoDB Database

Add MongoDB plugin from their marketplace

#### Step 4: Set Environment Variables

Configure in dashboard

#### Step 5: Deploy

Push to GitHub - automatic deployment

### Deploy to AWS EC2

#### Step 1: Launch EC2 Instance

- Choose **Ubuntu 20.04 LTS**
- Configure security groups (allow ports 80, 443, 5000)

#### Step 2: SSH into Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Node.js

```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 4: Install MongoDB

```bash
sudo apt-get install -y mongodb
```

#### Step 5: Clone Repository

```bash
git clone your-repo-url
cd GdG_Website/backend
npm install
```

#### Step 6: Set Environment Variables

```bash
nano .env
# Add your configuration
```

#### Step 7: Run with PM2 (Process Manager)

```bash
npm install -g pm2
pm2 start index.js --name "gdg-api"
pm2 startup
pm2 save
```

---

## Troubleshooting

### Problem: Port 5000 Already in Use

**Solution:**
```bash
# Find and kill process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# On Mac/Linux:
lsof -i :5000
kill -9 [PID]
```

### Problem: Database Connection Failed

**Check:**
1. MongoDB is running: `mongo` or `mongosh`
2. Connection string is correct
3. Firewall allows connections (for MongoDB Atlas)
4. Username/password are correct

### Problem: JWT Token Not Working

**Check:**
1. Token is being sent in `Authorization: Bearer` header
2. Token hasn't expired
3. JWT_SECRET matches between client and server
4. Cookies are enabled in browser

### Problem: CORS Error

**Solution:**
In `.env`, update `CORS_ORIGIN` to include your frontend URL:

```bash
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:8000,https://yourdomain.com
```

### Problem: Email Not Sending

**Check:**
1. SMTP credentials are correct
2. Gmail app password is used (not regular password)
3. 2FA is enabled on Gmail
4. Check SMTP_HOST and SMTP_PORT

---

## Contributing

### Before Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

3. Push to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

### Code Standards

- Use consistent naming conventions (camelCase for variables/functions)
- Comment complex logic
- Keep functions small and focused
- Handle errors properly
- Validate all inputs

### Testing Before PR

```bash
# Run in development mode
npm run dev

# Test all API endpoints
# Use Postman collection

# Check for console errors
```

---

## Useful Commands

```bash
# Start development server
npm run dev

# Start production server
NODE_ENV=production npm start

# Install dependencies
npm install

# Install a new package
npm install package-name

# Remove a package
npm uninstall package-name

# Update packages
npm update

# Check outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Documentation](https://jwt.io/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [REST API Best Practices](https://restfulapi.net/)

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) for API details
3. Create a GitHub issue
4. Contact the development team

## Next Steps

After setup:

1. ✅ Test all API endpoints
2. ✅ Integrate frontend with backend
3. ✅ Set up MongoDB Atlas
4. ✅ Configure SMTP for emails
5. ✅ Deploy to production server
6. ✅ Monitor logs and performance
7. ✅ Set up automated backups

---

**Happy Coding! 🚀**
