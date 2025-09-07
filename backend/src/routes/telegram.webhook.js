const express = require('express');
const { PrismaClient } = require('../../generated/prisma');
const { sendText } = require('../utils/telegram');
const { handleIncomingMessage } = require('../services/messageHandler');
const { validateLinkCode, linkTelegramAccount } = require('../utils/messageHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Telegram webhook endpoint
 * POST /api/telegram/webhook
 * This endpoint receives updates from Telegram
 */
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    // Log the incoming update for debugging
    console.log('Received Telegram update:', JSON.stringify(update, null, 2));

    // Check if it's a message update
    if (!update.message) {
      return res.status(200).json({ success: true, message: 'Not a message update' });
    }

    const message = update.message;
    const chatId = message.chat.id.toString();
    const messageText = message.text;
    const messageId = message.message_id;

    if (!messageText) {
      return res.status(200).json({ success: true, message: 'No text in message' });
    }

    console.log(`Processing message from chat ${chatId}: "${messageText}"`);

    // Check if this chat is already linked to a user
    const existingUser = await prisma.user.findUnique({
      where: { telegramChatId: chatId }
    });

    if (existingUser) {
      // Chat is already linked, process the message normally
      console.log(`Chat ${chatId} is linked to user ${existingUser.email}`);
      
      // Process as regular message (no more payment method checks)
      const result = await handleIncomingMessage({
        user_id: existingUser.id,
        content: messageText,
        source: 'telegram',
        extMessageId: messageId.toString(),
        extChatId: chatId
      });

      // Send reply back to Telegram
      if (result.success) {
        await sendText(chatId, result.message);
      } else {
        await sendText(chatId, result.message || 'Sorry, I encountered an error processing your message.');
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Message processed for linked user' 
      });
    }

    // Chat is not linked, check if message is a link code
    const linkCode = messageText.trim();
    
    // Validate the link code
    const user = await validateLinkCode(linkCode);
    
    if (user) {
      // Valid link code, link the account
      console.log(`Linking chat ${chatId} to user ${user.email}`);
      
      await linkTelegramAccount(user.id, chatId);
      
      const welcomeMessage = `✅ **Telegram linked to your account!**\n\nWelcome ${user.email}! I can now help you track your expenses. Try /help to see what I can do.`;
      
      await sendText(chatId, welcomeMessage, { parse_mode: 'Markdown' });
      
      return res.status(200).json({ 
        success: true, 
        message: 'Account linked successfully' 
      });
    }

    // Invalid or expired link code, or not a link code at all
    const botUsername = process.env.TELEGRAM_BOT_USERNAME || 'your_bot';
    const helpMessage = `🔗 **Account Not Linked**\n\nTo use this bot, you need to link your Telegram account to your Trackaro account.\n\n**Steps:**\n1. Go to the Trackaro website\n2. Log in to your account\n3. Go to Settings > Telegram\n4. Generate a link code\n5. Send that code to me\n\nOr visit: ${process.env.FRONTEND_URL || 'https://trackaro.com'}`;
    
    await sendText(chatId, helpMessage, { parse_mode: 'Markdown' });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Sent linking instructions' 
    });

  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    
    // Try to send error message to user if we have chatId
    try {
      const chatId = req.body?.message?.chat?.id;
      if (chatId) {
        await sendText(chatId.toString(), '❌ Sorry, I encountered an error. Please try again later.');
      }
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

/**
 * Get webhook info (for debugging)
 * GET /api/telegram/webhook/info
 */
router.get('/info', async (req, res) => {
  try {
    const { getWebhookInfo, getBotInfo } = require('../utils/telegram');
    
    const [webhookInfo, botInfo] = await Promise.all([
      getWebhookInfo(),
      getBotInfo()
    ]);

    res.json({
      success: true,
      data: {
        webhook: webhookInfo,
        bot: botInfo
      }
    });
  } catch (error) {
    console.error('Error getting webhook info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get webhook info'
    });
  }
});

/**
 * Set webhook URL (for setup)
 * POST /api/telegram/webhook/setup
 */
router.post('/setup', async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    
    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: 'Webhook URL is required'
      });
    }

    const { setWebhook } = require('../utils/telegram');
    const result = await setWebhook(webhookUrl);

    res.json({
      success: true,
      message: 'Webhook set successfully',
      data: result
    });
  } catch (error) {
    console.error('Error setting webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set webhook'
    });
  }
});

module.exports = router;
