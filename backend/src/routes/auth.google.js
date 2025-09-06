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
      const token = generateToken(user);

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${token}&success=true`;
      
      res.redirect(redirectUrl);
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
