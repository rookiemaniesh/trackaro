const express = require('express');
const { PrismaClient } = require('../../generated/prisma');
const { handleIncomingMessage } = require('../services/messageHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * Send message endpoint for web UI
 * POST /api/messages
 * Requires JWT authentication
 */
router.post('/', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { content } = req.body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message content is too long (max 1000 characters)'
      });
    }

    // Process as regular message (no more payment method checks)
    const result = await handleIncomingMessage({
      user_id,
      content: content.trim(),
      source: 'web',
      extMessageId: null,
      extChatId: null
    });

    // Return response
    res.json({
      success: result.success,
      message: result.message,
      data: {
        messageId: result.messageId,
        expenseId: result.expenseId || null,
        queryData: result.queryData || null
      }
    });

  } catch (error) {
    console.error('Error in messages endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get conversation history for user
 * GET /api/messages
 * Requires JWT authentication
 */
router.get('/', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    // Get messages for user
    const messages = await prisma.message.findMany({
      where: { user_id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        content: true,
        sender: true,
        source: true,
        createdAt: true,
        expenseId: true,
        expense: {
          select: {
            id: true,
            amount: true,
            category: true,
            companions: true,
            description: true
          }
        }
      }
    });

    // Get total count
    const totalCount = await prisma.message.count({
      where: { user_id }
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get conversation state for user
 * GET /api/messages/state
 * Requires JWT authentication
 */
router.get('/state', async (req, res) => {
  try {
    const user_id = req.user.id;
    // No more pending expenses - always return false
    res.json({
      success: true,
      data: {
        hasPendingExpense: false,
        pendingExpense: null
      }
    });

  } catch (error) {
    console.error('Error getting conversation state:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Clear conversation state for user
 * DELETE /api/messages/state
 * Requires JWT authentication
 */
router.delete('/state', async (req, res) => {
  try {
    const user_id = req.user.id;
    const { clearConversationState } = require('../services/messageHandler');
    
    const success = await clearConversationState(user_id);

    res.json({
      success,
      message: success ? 'Conversation state cleared' : 'Failed to clear conversation state'
    });

  } catch (error) {
    console.error('Error clearing conversation state:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
