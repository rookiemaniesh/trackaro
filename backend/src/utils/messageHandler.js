const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

/**
 * Handle incoming messages from any source (web or Telegram)
 * This is the main message processing function that can be extended
 * with AI/chat logic, expense parsing, etc.
 * 
 * @param {Object} params - Message parameters
 * @param {string} params.user_id - User ID
 * @param {string} params.content - Message content
 * @param {string} params.source - Message source ('web' or 'telegram')
 * @param {string} params.extMessageId - External message ID (Telegram message_id)
 * @param {string} params.extChatId - External chat ID (Telegram chat_id)
 * @returns {Promise<string>} Reply text to send back
 */
const handleIncomingMessage = async ({ user_id, content, source, extMessageId, extChatId }) => {
  try {
    // Save the incoming message to database
    const message = await prisma.message.create({
      data: {
        user_id,
        content,
        source: source.toUpperCase(),
        extMessageId,
        extChatId
      }
    });

    console.log(`Message saved: ${message.id} from ${source}`);

    // Basic message processing logic
    // This is where you would add your AI/chat logic, expense parsing, etc.
    let replyText = '';

    const lowerContent = content.toLowerCase().trim();

    // Simple command handling
    if (lowerContent === '/start') {
      replyText = '👋 Welcome to Trackaro! I can help you track your expenses. Try saying "I spent $10 on coffee" or ask me about your spending.';
    } else if (lowerContent === '/help') {
      replyText = `📖 **Trackaro Bot Commands:**
      
/start - Welcome message
/help - Show this help
/expenses - View recent expenses
/link - Get account linking instructions

**Natural Language:**
• "I spent $25 on lunch"
• "Show me my expenses this month"
• "What did I spend on groceries?"
• "Add $50 for gas to my expenses"`;
    } else if (lowerContent === '/expenses') {
      // Get recent expenses for the user
      const recentExpenses = await prisma.expense.findMany({
        where: { user_id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          amount: true,
          category: true,
          description: true,
          date: true
        }
      });

      if (recentExpenses.length === 0) {
        replyText = '📊 No expenses found. Try adding one by saying "I spent $10 on coffee"';
      } else {
        replyText = '📊 **Recent Expenses:**\n\n';
        recentExpenses.forEach((expense, index) => {
          const date = new Date(expense.date).toLocaleDateString();
          replyText += `${index + 1}. $${expense.amount} - ${expense.category}`;
          if (expense.description) {
            replyText += ` (${expense.description})`;
          }
          replyText += ` - ${date}\n`;
        });
      }
    } else if (lowerContent === '/link') {
      replyText = '🔗 To link your Telegram account:\n\n1. Go to the Trackaro website\n2. Log in to your account\n3. Go to Settings > Telegram\n4. Generate a link code\n5. Send that code to this bot';
    } else if (lowerContent.includes('spent') || lowerContent.includes('spend')) {
      // Basic expense parsing (you can enhance this with more sophisticated NLP)
      replyText = '💰 I see you mentioned spending money! I\'m working on expense parsing. For now, you can add expenses through the web app.';
    } else {
      // Default response
      replyText = '🤖 I received your message! I\'m still learning, but I can help you track expenses. Try /help for available commands.';
    }

    // Save the AI reply as a message
    await prisma.message.create({
      data: {
        user_id,
        content: replyText,
        source: 'AI',
        sender: 'AI'
      }
    });

    return replyText;

  } catch (error) {
    console.error('Error handling incoming message:', error);
    return '❌ Sorry, I encountered an error processing your message. Please try again.';
  }
};

/**
 * Generate a random 6-digit link code
 * @returns {string} 6-digit numeric code
 */
const generateLinkCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if a link code is valid and not expired
 * @param {string} code - Link code to validate
 * @returns {Promise<Object|null>} User object if valid, null if invalid/expired
 */
const validateLinkCode = async (code) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        telegramLinkCode: code,
        telegramLinkExpiry: {
          gt: new Date() // Not expired
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Error validating link code:', error);
    return null;
  }
};

/**
 * Link Telegram chat to user account
 * @param {string} user_id - User ID
 * @param {string} chatId - Telegram chat ID
 * @returns {Promise<Object>} Updated user object
 */
const linkTelegramAccount = async (user_id, chatId) => {
  try {
    const user = await prisma.user.update({
      where: { id: user_id },
      data: {
        telegramChatId: chatId,
        telegramLinkCode: null,
        telegramLinkExpiry: null
      }
    });

    return user;
  } catch (error) {
    console.error('Error linking Telegram account:', error);
    throw error;
  }
};

module.exports = {
  handleIncomingMessage,
  generateLinkCode,
  validateLinkCode,
  linkTelegramAccount
};
