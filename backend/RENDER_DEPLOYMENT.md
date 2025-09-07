# Render Deployment Guide - Trackaro Backend

This guide will help you deploy the Trackaro backend to Render with proper configuration for production.

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Render account (sign up at [render.com](https://render.com))
- GitHub repository with your backend code
- PostgreSQL database (Render provides this)

### 2. Deploy to Render

#### Option A: Deploy from GitHub (Recommended)
1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository and set root directory to `backend`

2. **Configure Service Settings**
   - **Name**: `trackaro-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

3. **Add PostgreSQL Database**
   - In your Render project, click "New +"
   - Select "PostgreSQL"
   - Name it `trackaro-database`
   - Render will automatically create a PostgreSQL instance

4. **Configure Environment Variables**
   - Go to your service settings
   - Click on "Environment" tab
   - Add the following environment variables:

#### Option B: Deploy via Render CLI
```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render auth login

# Link project
render link

# Deploy
render deploy
```

## 🔧 Environment Variables Configuration

### Required Environment Variables

Add these environment variables in your Render service settings:

```env
# Database (Render will provide this automatically)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Session Secret (for Google OAuth)
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-render-app.onrender.com/api/auth/google/callback

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBHOOK_URL=https://your-render-app.onrender.com/api/telegram/webhook

# Frontend URL (update with your frontend domain)
FRONTEND_URL=https://your-frontend-domain.com

# AI Service Configuration (Railway)
AI_SERVICE_URL=https://insightful-laughter-production-7c35.up.railway.app/process
AI_SERVICE_KEY=not-required-for-railway

# Server Configuration
NODE_ENV=production
PORT=10000
```

### Render-Specific Variables

Render automatically provides these variables:
- `PORT` - The port your app should listen on (usually 10000)
- `DATABASE_URL` - PostgreSQL connection string (if you added PostgreSQL service)

## 📁 Render Configuration Files

The following files are included for Render deployment:

### `render.yaml`
```yaml
services:
  - type: web
    name: trackaro-backend
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: JWT_SECRET
        generateValue: true
      - key: SESSION_SECRET
        generateValue: true
      # ... other environment variables

  - type: pserv
    name: trackaro-database
    env: postgresql
    plan: starter
    ipAllowList: []
```

### `package.json` (Updated)
```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "npx prisma generate",
    "dev": "nodemon src/server.js"
  }
}
```

## 🗄️ Database Setup

### Automatic Database Migration
The deployment process automatically:
1. Installs dependencies (`npm install`)
2. Generates Prisma client (`npm run build`)
3. Runs database migrations (handled by Render)
4. Creates all necessary tables and relationships

### Manual Database Operations (if needed)
```bash
# Connect to Render CLI
render auth login

# Connect to your project
render link

# Run database migrations manually
render run npx prisma migrate deploy

# Open Prisma Studio (optional)
render run npx prisma studio
```

## 🔍 Health Check

Render will automatically monitor your application using the `/health` endpoint:

```bash
curl https://your-render-app.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "clientIP": "127.0.0.1",
  "userAgent": "Render-Health-Check"
}
```

## 🔐 Security Configuration

### Production Security Checklist
- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Change `SESSION_SECRET` to a strong, random string
- [ ] Update `GOOGLE_CALLBACK_URL` with your Render domain
- [ ] Update `TELEGRAM_WEBHOOK_URL` with your Render domain
- [ ] Update `FRONTEND_URL` with your frontend domain
- [ ] Ensure `NODE_ENV=production`

### Generate Secure Secrets
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📱 Telegram Bot Setup

### 1. Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token

### 2. Set Webhook
After deployment, set the webhook URL:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-render-app.onrender.com/api/telegram/webhook"}'
```

### 3. Test Webhook
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

## 🔧 Google OAuth Setup

### 1. Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials

### 2. Configure OAuth
- **Authorized JavaScript origins**: `https://your-render-app.onrender.com`
- **Authorized redirect URIs**: `https://your-render-app.onrender.com/api/auth/google/callback`

## 📊 Monitoring and Logs

### View Logs
```bash
# Via Render CLI
render logs

# Via Render Dashboard
# Go to your service → "Logs" tab
```

### Monitor Performance
- Render provides built-in metrics
- Check the "Metrics" tab in your service dashboard
- Monitor CPU, memory, and response times

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check if DATABASE_URL is set correctly
render env list | grep DATABASE_URL

# Test database connection
render run npx prisma db push
```

#### 2. Build Failures
```bash
# Check build logs in Render dashboard
# Common issues:
# - Missing environment variables
# - Prisma client not generated
# - Database migration failures
```

#### 3. Application Crashes
```bash
# Check application logs
render logs

# Common issues:
# - Missing required environment variables
# - Database connection issues
# - Invalid JWT secret format
```

#### 4. Health Check Failures
- Ensure `/health` endpoint is accessible
- Check if application is listening on the correct port
- Verify all required environment variables are set

### Debug Commands
```bash
# Connect to Render project
render link

# Run commands in Render environment
render run npm run build
render run npx prisma migrate deploy
render run npx prisma studio

# Check environment variables
render env list

# Test database connection
render run npx prisma db push
```

## 🔄 Deployment Updates

### Automatic Deployments
Render automatically deploys when you push to your connected GitHub repository.

### Manual Deployments
```bash
# Deploy latest changes
render deploy

# Deploy specific branch
render deploy --branch main
```

## 📈 Scaling

### Render Scaling Options
- **Horizontal Scaling**: Upgrade to higher tier plans
- **Vertical Scaling**: Increase instance size
- **Database Scaling**: Render PostgreSQL supports automatic scaling

### Performance Optimization
- Enable Render's built-in caching
- Use Render's CDN for static assets
- Monitor and optimize database queries

## 🆘 Support

### Render Support
- [Render Documentation](https://render.com/docs)
- [Render Status](https://status.render.com)
- [Render Community](https://community.render.com)

### Application Support
- Check application logs: `render logs`
- Monitor health endpoint: `/health`
- Test API endpoints with curl or Postman

## 🎯 Render-Specific Features

### Blueprint Deployments
Use the `render.yaml` file for infrastructure as code:
```bash
# Deploy using blueprint
render deploy --blueprint render.yaml
```

### Environment Management
```bash
# List environment variables
render env list

# Set environment variable
render env set KEY=value

# Delete environment variable
render env unset KEY
```

### Service Management
```bash
# List services
render services list

# Get service details
render services show trackaro-backend

# Restart service
render services restart trackaro-backend
```

---

**Your Trackaro backend is now ready for Render deployment!** 🚀

After deployment, your API will be available at: `https://your-render-app.onrender.com`
