# Render Deployment Checklist - Trackaro Backend

Use this checklist to ensure a successful deployment of your Trackaro backend to Render.

## ✅ Pre-Deployment Checklist

### 1. Render Account Setup
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Install Render CLI: `npm install -g @render/cli`
- [ ] Login to Render: `render auth login`

### 2. Project Setup
- [ ] Create new Render project
- [ ] Add PostgreSQL database service
- [ ] Connect your GitHub repository
- [ ] Set root directory to `backend` folder

### 3. Environment Variables
Set these variables in Render service settings:

#### Required Variables
- [ ] `JWT_SECRET` - Strong random string (64+ characters)
- [ ] `SESSION_SECRET` - Strong random string (32+ characters)
- [ ] `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- [ ] `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- [ ] `TELEGRAM_BOT_USERNAME` - Your Telegram bot username

#### Optional Variables
- [ ] `JWT_EXPIRES_IN` - JWT expiration time (default: "7d")
- [ ] `FRONTEND_URL` - Your frontend domain
- [ ] `AI_SERVICE_URL` - Railway AI service URL
- [ ] `AI_SERVICE_KEY` - AI service key (if required)

#### Render Auto-Provided Variables
- [ ] `DATABASE_URL` - Automatically provided by Render PostgreSQL
- [ ] `PORT` - Automatically provided by Render (usually 10000)
- [ ] `NODE_ENV` - Set to "production" by Render

### 4. Google OAuth Configuration
- [ ] Create Google Cloud Console project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URI: `https://your-render-app.onrender.com/api/auth/google/callback`
- [ ] Add authorized JavaScript origins: `https://your-render-app.onrender.com`

### 5. Telegram Bot Setup
- [ ] Create bot with [@BotFather](https://t.me/botfather)
- [ ] Get bot token and username
- [ ] Set webhook URL: `https://your-render-app.onrender.com/api/telegram/webhook`

## 🚀 Deployment Process

### 1. Deploy from Render Dashboard
- [ ] Go to Render dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install && npm run build`
- [ ] Configure start command: `npm start`
- [ ] Set health check path: `/health`
- [ ] Add PostgreSQL database
- [ ] Configure environment variables
- [ ] Deploy

### 2. Deploy via CLI
```bash
# Link project
render link

# Set environment variables
render env set JWT_SECRET=your-jwt-secret
render env set SESSION_SECRET=your-session-secret
render env set GOOGLE_CLIENT_ID=your-google-client-id
render env set GOOGLE_CLIENT_SECRET=your-google-client-secret
render env set TELEGRAM_BOT_TOKEN=your-telegram-bot-token
render env set TELEGRAM_BOT_USERNAME=your_bot_username

# Deploy
render deploy
```

### 3. Database Migration
- [ ] Verify database connection
- [ ] Check if all tables are created
- [ ] Run database migrations if needed: `render run npx prisma migrate deploy`

## 🔍 Post-Deployment Verification

### 1. Health Check
- [ ] Test health endpoint: `curl https://your-render-app.onrender.com/health`
- [ ] Verify response contains success: true
- [ ] Check server timestamp and client IP

### 2. API Endpoints Testing
- [ ] Test authentication endpoints
- [ ] Test expense CRUD operations
- [ ] Test message endpoints
- [ ] Test recommendations endpoints
- [ ] Test OCR endpoints

### 3. Database Verification
- [ ] Check if all tables exist
- [ ] Verify Prisma client is generated
- [ ] Test database connections

### 4. External Integrations
- [ ] Test Google OAuth flow
- [ ] Test Telegram webhook
- [ ] Test AI service integration
- [ ] Test OCR service integration

## 🔧 Configuration Updates

### 1. Update Frontend Configuration
- [ ] Update API base URL in frontend
- [ ] Update Google OAuth redirect URIs
- [ ] Update Telegram webhook URL
- [ ] Test frontend-backend integration

### 2. Update External Services
- [ ] Update Google OAuth authorized domains
- [ ] Update Telegram webhook URL
- [ ] Update any external service configurations

## 📊 Monitoring Setup

### 1. Render Monitoring
- [ ] Enable Render metrics
- [ ] Set up alerts for high CPU/memory usage
- [ ] Monitor deployment logs
- [ ] Set up health check monitoring

### 2. Application Monitoring
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Monitor database performance
- [ ] Set up log aggregation

## 🛡️ Security Verification

### 1. Environment Security
- [ ] Verify all secrets are properly set
- [ ] Check that no sensitive data is in logs
- [ ] Verify HTTPS is enabled
- [ ] Check CORS configuration

### 2. Authentication Security
- [ ] Test JWT token generation and validation
- [ ] Verify password hashing
- [ ] Test Google OAuth flow
- [ ] Test Telegram authentication

## 🧪 Testing Checklist

### 1. Functional Testing
- [ ] User registration and login
- [ ] Expense creation and management
- [ ] Message processing
- [ ] Recommendations generation
- [ ] OCR receipt processing

### 2. Integration Testing
- [ ] Google OAuth integration
- [ ] Telegram bot integration
- [ ] AI service integration
- [ ] Database operations

### 3. Performance Testing
- [ ] API response times
- [ ] Database query performance
- [ ] File upload performance
- [ ] Concurrent user handling

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues
- [ ] Verify DATABASE_URL is set correctly
- [ ] Check if PostgreSQL service is running
- [ ] Verify network connectivity
- [ ] Check database credentials

#### 2. Build Failures
- [ ] Check if all dependencies are installed
- [ ] Verify Prisma client generation
- [ ] Check for missing environment variables
- [ ] Review build logs

#### 3. Application Crashes
- [ ] Check application logs
- [ ] Verify all required environment variables
- [ ] Check database connection
- [ ] Verify external service connectivity

#### 4. Authentication Issues
- [ ] Verify JWT secret is set correctly
- [ ] Check Google OAuth configuration
- [ ] Verify Telegram bot token
- [ ] Check session configuration

## 📋 Deployment Commands Reference

```bash
# Render CLI Commands
render auth login                    # Login to Render
render link                          # Link project to Render
render deploy                        # Deploy to Render
render logs                          # View deployment logs
render services list                 # List services
render env list                      # List environment variables
render env set KEY=value             # Set environment variable
render run command                   # Run command in Render environment

# Database Commands
render run npx prisma generate       # Generate Prisma client
render run npx prisma migrate deploy # Deploy migrations
render run npx prisma studio         # Open Prisma Studio

# Testing Commands
curl https://your-app.onrender.com/health  # Health check
curl -X POST https://your-app.onrender.com/api/auth/local/register  # Test registration
```

## ✅ Final Verification

Before considering deployment complete:

- [ ] All health checks pass
- [ ] All API endpoints respond correctly
- [ ] Database is properly configured
- [ ] External integrations work
- [ ] Frontend can connect to backend
- [ ] Monitoring is set up
- [ ] Security measures are in place
- [ ] Performance is acceptable
- [ ] Error handling works correctly
- [ ] Logs are properly configured

## 🎉 Deployment Complete!

Once all items are checked:

- [ ] Update documentation with new URLs
- [ ] Notify team of successful deployment
- [ ] Set up regular monitoring
- [ ] Plan for future updates and maintenance

---

**Your Trackaro backend is now successfully deployed on Render!** 🚀
