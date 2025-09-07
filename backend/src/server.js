const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authLocalRoutes = require('./routes/auth.local');
const authGoogleRoutes = require('./routes/auth.google');
const authTelegramRoutes = require('./routes/auth.telegram');
const telegramWebhookRoutes = require('./routes/telegram.webhook');
const messagesRoutes = require('./routes/messages');
const expensesRoutes = require('./routes/expenses');
const ocrRoutes = require('./routes/ocr');
const recommendationsRoutes = require('./routes/recommendations');

// Import middleware
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      // Allow any localhost with different ports for mobile testing
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/, // Allow local network IPs for mobile testing
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS: Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Session configuration (for Google OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check request from:', req.ip, req.headers['user-agent']);
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    userAgent: req.headers['user-agent']
  });
});

// Authentication routes
app.use('/api/auth/local', authLocalRoutes);
app.use('/api/auth/google', authGoogleRoutes);
app.use('/api/auth/telegram', authenticate, authTelegramRoutes);

// Telegram webhook routes
app.use('/api/telegram', telegramWebhookRoutes);

// Messages routes (web UI)
app.use('/api/messages', authenticate, messagesRoutes);

// Expenses routes
app.use('/api/expenses', authenticate, expensesRoutes);

// Recommendations routes
app.use('/api/recommendations', authenticate, recommendationsRoutes);

// OCR routes
app.use('/api/ocr', authenticate, ocrRoutes);

// Protected route example
app.get('/api/profile', authenticate, (req, res) => {
  console.log('Profile endpoint - User:', req.user);
  res.json({
    success: true,
    message: 'Profile data retrieved successfully',
    data: {
      user: req.user
    }
  });
});

// Update profile endpoint
app.put('/api/profile', authenticate, async (req, res) => {
  try {
    const { PrismaClient } = require('./generated/prisma');
    const prisma = new PrismaClient();
    
    const { email, profilePicture } = req.body;
    const userId = req.user.id;

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email: email.toLowerCase() }),
        ...(profilePicture && { profilePicture })
      },
      select: {
        id: true,
        email: true,
        googleId: true,
        profilePicture: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // Since we're using JWT, logout is handled on the client side
  // by removing the token from storage
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   - Local: http://localhost:${PORT}/api/auth/local`);
  console.log(`   - Google: http://localhost:${PORT}/api/auth/google`);
  console.log(`   - Telegram: http://localhost:${PORT}/api/auth/telegram`);
  console.log(`📱 Telegram webhook: http://localhost:${PORT}/api/telegram/webhook`);
});

module.exports = app;
