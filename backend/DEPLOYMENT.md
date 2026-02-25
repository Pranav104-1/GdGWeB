# 🚀 Deployment Guide - GDG CSMU Backend

Complete guide to deploy your backend to production.

---

## 📍 Deployment Options

### 1. **Railway** (Recommended - Easiest)
### 2. **Render**
### 3. **Heroku**
### 4. **AWS (EC2)**
### 5. **DigitalOcean**

---

## 🚄 Railway Deployment (Recommended)

### Pros:
- ✅ Free tier with $5/month spend
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variables
- ✅ MongoDB Atlas included
- ✅ No credit card for free tier

### Steps:

#### 1. Prepare Repository
```bash
# Ensure .env.example exists (✅ already done)
# Ensure .gitignore includes node_modules (✅ done)
# Push to GitHub
git add .
git commit -m "Add backend API"
git push origin main
```

#### 2. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

#### 3. Deploy Backend
1. Select "Deploy from GitHub"
2. Authorize Railway to access GitHub
3. Select GdGWeB repository
4. Select "root directory": `/backend`
5. Click "Deploy"

#### 4. Configure Environment Variables
1. Go to your Railway project
2. Click "Variables" or "Environment"
3. Click "+ Open in Editor"
4. Add variables:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongo_atlas_uri
JWT_SECRET=generate_strong_random_string
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-frontend-url.com
```

#### 5. Generate MongoDB Atlas URI

1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add database user
4. Get connection string
5. Replace `<password>` and `<database>` with actual values
6. Add to Railway variables as `MONGODB_URI`

#### 6. Get Production URL
```
Your backend will be available at:
https://[project-name].up.railway.app/api
```

#### 7. Update Frontend
Update `script.js`:
```javascript
const API_BASE_URL = "https://[project-name].up.railway.app/api";
```

---

## 🎨 Render Deployment

### Steps:

1. **Create Account**: https://render.com

2. **Connect Repository**:
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub
   - Select repository

3. **Configure Service**:
   - **Name**: gdg-csmu-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**:
   - Click "Environment"
   - Add all variables from .env.example

5. **Deploy**:
   - Click "Create Web Service"
   - Render auto-deploys from main branch

6. **Get URL**:
   ```
   https://gdg-csmu-backend.onrender.com/api
   ```

---

## 📦 Heroku Deployment

### Prerequisites:
```bash
# Install Heroku CLI
# macOS: brew install heroku/brew/heroku
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login
```

### Steps:

```bash
# Create app
heroku create gdg-csmu-backend

# Add buildpack for Node.js
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_here
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set FRONTEND_URL=https://your-domain.com

# Deploy
git push heroku main

# View logs
heroku logs --tail

# Get URL
heroku open
```

---

## 🌐 AWS EC2 Deployment

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose **Ubuntu 20.04 LTS**
4. Select **t2.micro** (free tier)
5. Create security group allowing:
   - Port 22 (SSH)
   - Port 3000 (App)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

### Step 2: Connect & Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install MongoDB (or use Atlas)
# Or use MongoDB Atlas connection string

# Clone repository
git clone https://github.com/your-username/GdGWeB.git
cd GdGWeB/backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name "gdg-csmu-api"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/default
```

### Nginx config:
```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:4565;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 💻 DigitalOcean Deployment

### Using Droplets:

1. **Create Droplet**:
   - Choose Ubuntu 20.04 LTS
   - $5/month basic plan
   - Add SSH key

2. **Setup (same as AWS)**:
```bash
ssh root@your-droplet-ip

# Install dependencies
apt update && apt upgrade -y

# Install Node.js, PM2, MongoDB client
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx

# Clone and setup
git clone https://github.com/your-username/GdGWeB.git
cd GdGWeB/backend
npm install

# Create .env
nano .env

# Start with PM2
pm2 start server.js
pm2 startup
pm2 save
```

### Using App Platform:
1. Go to DigitalOcean → App Platform
2. Create App
3. Connect GitHub
4. Select repository
5. Configure environment
6. Deploy

---

## 🔒 Production Checklist

### Security
- [ ] Change JWT_SECRET to strong random string
- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL certificate
- [ ] Setup firewall rules
- [ ] Disable SSH password auth (key-only)
- [ ] Setup rate limiting
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets

### Performance
- [ ] Enable gzip compression
- [ ] Setup CDN for static files
- [ ] Configure database indexes
- [ ] Setup monitoring logs
- [ ] Enable caching headers
- [ ] Use production database

### Monitoring
- [ ] Setup uptime monitoring
- [ ] Enable error logging
- [ ] Setup email alerts
- [ ] Monitor CPU/memory usage
- [ ] Track API response times

### Code
- [ ] Update FRONTEND_URL in backend
- [ ] Update API_BASE_URL in frontend
- [ ] Remove console.logs (or use logger)
- [ ] Update CORS origin
- [ ] Test all endpoints
- [ ] Load test the API

---

## 📊 Environment Variables Checklist

```
Production .env should have:
- NODE_ENV=production
- PORT=3000 (or dynamic)
- MONGODB_URI=mongodb+srv://... (Atlas)
- JWT_SECRET=long_random_string_32_chars_min
- REFRESH_TOKEN_SECRET=another_random_string
- EMAIL_SERVICE=gmail (or other)
- EMAIL_USER=your-email@gmail.com
- EMAIL_PASSWORD=app-specific-password
- FRONTEND_URL=https://your-domain.com
- API_BASE_URL=https://api.your-domain.com
```

---

## 🧪 Test Before Deploying

```bash
# Run locally in production mode
NODE_ENV=production npm start

# Test health endpoint
curl https://your-api-domain.com/api/health

# Test auth
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123456"}'
```

---

## 📈 Scaling Tips

As your app grows:

1. **Database**:
   - Use MongoDB Atlas with auto-scaling
   - Add database backups
   - Monitor slow queries

2. **Backend**:
   - Use load balancer
   - Deploy to multiple instances
   - Use caching (Redis)

3. **Frontend**:
   - Use CDN for static files
   - Enable compression
   - Optimize images

4. **Monitoring**:
   - Setup Sentry for error tracking
   - Use DataDog or New Relic
   - Monitor real user experience

---

## 🆘 Troubleshooting

### App won't start
```bash
# Check logs
pm2 logs gdg-csmu-api

# Check if port is in use
lsof -i :3000

# Try restarting
pm2 restart gdg-csmu-api
```

### MongoDB connection fails
- Verify MONGODB_URI is correct
- Check MongoDB Atlas whitelist includes your IP
- Verify credentials

### Email not sending
- Check EMAIL_PASSWORD (use app-specific for Gmail)
- Verify EMAIL_USER is correct
- Check SMTP settings

### CORS errors
- Update FRONTEND_URL in backend env
- Verify frontend makes requests to API_BASE_URL

---

## 💡 Cost Estimation

| Service | Tier | Cost |
|---------|------|------|
| Railway | Free (up to $5) | FREE |
| Render | Free + Pro | FREE/$12+ |
| Heroku | Free tier ended | $7+ |
| AWS EC2 | Free tier | FREE (1 year) |
| DigitalOcean | Droplet | $5/month |
| MongoDB Atlas | Free | FREE |
| SendGrid Email | Free | 100/day FREE |

**Recommended Setup: Railway + MongoDB Atlas = FREE!**

---

## 📚 Useful Links

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Let's Encrypt](https://letsencrypt.org)
- [PM2 Docs](https://pm2.keymetrics.io)

---

## 🎉 You're Deployed!

After deployment:
1. ✅ Update frontend API_BASE_URL
2. ✅ Test all features
3. ✅ Monitor logs
4. ✅ Setup backups
5. ✅ Enable monitoring

**Congratulations on going live! 🚀**

---

**Need help?** Check logs and use deployment platform's support.
