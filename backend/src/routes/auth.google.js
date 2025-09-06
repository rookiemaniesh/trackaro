const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('../../generated/prisma');
const { generateToken } = require('../utils/jwt');

const router = express.Router();
const prisma = new PrismaClient();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { id: googleId, emails, photos, displayName } = profile;
    const email = emails[0].value;
    const profilePicture = photos[0]?.value;

    // Check if user exists with this Google ID
    let user = await prisma.user.findUnique({
      where: { googleId }
    });

    if (user) {
      // Update profile picture if it changed
      if (profilePicture && user.profilePicture !== profilePicture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture }
        });
      }
      return done(null, user);
    }

    // Check if user exists with this email (but different Google ID)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      // Link Google account to existing user
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          googleId,
          profilePicture: profilePicture || existingUser.profilePicture
        }
      });
      return done(null, user);
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        googleId,
        profilePicture
      }
    });

    return done(null, user);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        googleId: true,
        profilePicture: true,
        createdAt: true
      }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * Initiate Google OAuth flow
 * GET /api/auth/google
 */
router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * Google OAuth callback
 * GET /api/auth/google/callback
 */
router.get('/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    try {
      const user = req.user;
      console.log('Google OAuth callback - User received:', user);
      
      const token = generateToken(user);
      console.log('Google OAuth callback - Token generated:', token ? 'Success' : 'Failed');

      // Check if this is a mobile device
      const userAgent = req.headers['user-agent'] || '';
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      
      console.log('Google OAuth callback - Device type:', isMobile ? 'Mobile' : 'Desktop');

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (isMobile) {
        // For mobile devices, use a POST-based callback to avoid URL length issues
        console.log('Google OAuth callback - Using mobile-friendly POST callback');
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Signing in...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                margin: 0; 
                background: #f5f5f5;
              }
              .container { 
                text-align: center; 
                padding: 2rem; 
                background: white; 
                border-radius: 8px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 300px;
                width: 90%;
              }
              .spinner { 
                width: 40px; 
                height: 40px; 
                border: 3px solid #f3f3f3; 
                border-top: 3px solid #3498db; 
                border-radius: 50%; 
                animation: spin 1s linear infinite; 
                margin: 0 auto 1rem;
              }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="spinner"></div>
              <h2>Completing Sign-In...</h2>
              <p>Please wait while we finish setting up your account.</p>
            </div>
            <script>
              // Store token and redirect
              localStorage.setItem('accessToken', '${token}');
              setTimeout(() => {
                window.location.href = '${frontendUrl}/chat';
              }, 1000);
            </script>
          </body>
          </html>
        `);
      } else {
        // For desktop, use the original URL-based redirect
        const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&success=true`;
        console.log('Google OAuth callback - Redirecting to:', redirectUrl);
        res.redirect(redirectUrl);
      }
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?success=false&error=authentication_failed`;
      res.redirect(redirectUrl);
    }
  }
);

/**
 * Get Google OAuth URL (for frontend to use)
 * GET /api/auth/google/url
 */
router.get('/url', (req, res) => {
  const googleAuthUrl = `/api/auth/google`;
  res.json({
    success: true,
    data: {
      authUrl: googleAuthUrl
    }
  });
});

module.exports = router;
