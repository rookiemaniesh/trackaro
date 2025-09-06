const express = require('express');
const { PrismaClient } = require('../../generated/prisma');
const { generateLinkCode } = require('../utils/messageHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Generate Telegram link code for authenticated user
 * POST /api/auth/telegram/start
 * Requires JWT authentication
 */
router.post('/start', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { email } = req.user;

    // Generate 6-digit link code
    const code = generateLinkCode();
    
    // Set expiry to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with link code and expiry
    // This will overwrite any existing code
    await prisma.user.update({
      where: { id: user_id },
      data: {
        telegramLinkCode: code,
        telegramLinkExpiry: expiry
      }
    });

    console.log(`Generated Telegram link code for user ${email}: ${code}`);

    res.json({
      success: true,
      message: 'Telegram link code generated successfully',
      data: {
        code,
        expiry: expiry.toISOString(),
        instructions: `Send this code "${code}" to @${process.env.TELEGRAM_BOT_USERNAME || 'your_bot'} in Telegram to link your account.`
      }
    });

  } catch (error) {
    console.error('Error generating Telegram link code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate Telegram link code'
    });
  }
});

/**
 * Get Telegram linking status for authenticated user
 * GET /api/auth/telegram/status
 * Requires JWT authentication
 */
router.get('/status', async (req, res) => {
  try {
    console.log('Telegram status request received');
    console.log('User from auth middleware:', req.user);
    
    if (!req.user || !req.user.id) {
      console.error('No user found in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user_id = req.user.id;
    console.log('Looking up user with ID:', user_id);

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        telegramChatId: true,
        telegramLinkCode: true,
        telegramLinkExpiry: true
      }
    });

    console.log('User found:', user);

    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isLinked = !!user.telegramChatId;
    const hasActiveCode = user.telegramLinkCode && user.telegramLinkExpiry > new Date();

    console.log('Telegram status:', { isLinked, hasActiveCode });

    res.json({
      success: true,
      data: {
        isLinked,
        hasActiveCode,
        linkCode: hasActiveCode ? user.telegramLinkCode : null,
        expiry: hasActiveCode ? user.telegramLinkExpiry : null,
        botUsername: process.env.TELEGRAM_BOT_USERNAME || 'your_bot'
      }
    });

  } catch (error) {
    console.error('Error getting Telegram status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Telegram status'
    });
  }
});

/**
 * Unlink Telegram account
 * DELETE /api/auth/telegram/unlink
 * Requires JWT authentication
 */
router.delete('/unlink', async (req, res) => {
  try {
    const user_id = req.user.id;

    await prisma.user.update({
      where: { id: user_id },
      data: {
        telegramChatId: null,
        telegramLinkCode: null,
        telegramLinkExpiry: null
      }
    });

    res.json({
      success: true,
      message: 'Telegram account unlinked successfully'
    });

  } catch (error) {
    console.error('Error unlinking Telegram account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unlink Telegram account'
    });
  }
});

module.exports = router;
