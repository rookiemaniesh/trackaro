const { PrismaClient } = require('../../generated/prisma');
const AIClient = require('./aiClient');

const prisma = new PrismaClient();
const aiClient = new AIClient();

/**
 * Unified Message Handler
 * Processes messages from both web UI and Telegram, integrating with AI service
 */

/**
 * Handle incoming messages from any source (web or Telegram)
 * @param {Object} params - Message parameters
 * @param {string} params.user_id - User ID
 * @param {string} params.content - Message content
 * @param {string} params.source - Message source ('web' or 'telegram')
 * @param {string} params.extMessageId - External message ID (for Telegram)
 * @param {string} params.extChatId - External chat ID (for Telegram)
 * @returns {Promise<Object>} Response object with success status and message
 */
const handleIncomingMessage = async ({ user_id, content, source, extMessageId, extChatId }) => {
  try {
    console.log(`📨 Processing message from ${source}: ${content.substring(0, 50)}...`);

    // Save the incoming user message
    const userMessage = await prisma.message.create({
      data: {
        user_id,
        content,
        source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
        sender: 'user',
        extMessageId,
        extChatId
      }
    });

    console.log(`💾 Saved user message: ${userMessage.id}`);

    // Send to AI service
    console.log(`🤖 Sending message to AI service: "${content}"`);
    const aiResponse = await aiClient.processMessage(content, user_id);

    // Log the complete AI response for debugging
    console.log('📥 Complete AI Response:', JSON.stringify(aiResponse, null, 2));

    if (!aiResponse.success) {
      console.error('❌ AI service returned error:', aiResponse);
      // AI service error - return error message
      const errorMessage = await prisma.message.create({
        data: {
          user_id,
          content: `Sorry, I'm having trouble processing your request. ${aiResponse.message}`,
          source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
          sender: 'ai'
        }
      });

      return {
        success: false,
        message: errorMessage.content,
        messageId: errorMessage.id
      };
    }

    const aiData = aiResponse.data;
    console.log('📊 AI Data extracted:', JSON.stringify(aiData, null, 2));

    // Validate AI response
    if (!aiClient.validateResponse(aiData)) {
      console.error('❌ Invalid AI response format:', aiData);
      
      const errorMessage = await prisma.message.create({
        data: {
          user_id,
          content: "I'm sorry, I received an invalid response from the AI service. Please try again.",
          source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
          sender: 'ai'
        }
      });

      return {
        success: false,
        message: errorMessage.content,
        messageId: errorMessage.id
      };
    }

    // Process based on AI response type
    if (aiData.type === 'expense') {
      return await handleExpenseResponse({ user_id, aiData, source, extMessageId, extChatId });
    } else if (aiData.type === 'query') {
      return await handleQueryResponse({ user_id, aiData, source, extMessageId, extChatId });
    } else {
      // Unknown response type - log the response for debugging
      console.log('❓ Unknown AI response type:', aiData.type);
      console.log('📥 Full AI response:', JSON.stringify(aiData, null, 2));
      
      // Try to extract a message from the response
      let responseMessage = "I'm not sure how to process that. Please try asking about expenses or queries.";
      
      if (aiData.message && aiData.message.output) {
        // Railway AI model has nested message structure
        responseMessage = aiData.message.output;
      } else if (aiData.message && typeof aiData.message === 'string') {
        responseMessage = aiData.message;
      }
      
      const errorMessage = await prisma.message.create({
        data: {
          user_id,
          content: responseMessage,
          source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
          sender: 'ai'
        }
      });

      return {
        success: true, // Still return success since we got a response
        message: responseMessage,
        messageId: errorMessage.id
      };
    }

  } catch (error) {
    console.error('❌ Error in handleIncomingMessage:', error);
    
    // Save error message
    const errorMessage = await prisma.message.create({
      data: {
        user_id,
        content: "I encountered an error processing your message. Please try again.",
        source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
        sender: 'ai'
      }
    });

    return {
      success: false,
      message: errorMessage.content,
      messageId: errorMessage.id
    };
  }
};

/**
 * Handle expense response from AI service
 * @param {Object} params - Parameters
 * @returns {Promise<Object>} Response object
 */
const handleExpenseResponse = async ({ user_id, aiData, source, extMessageId, extChatId }) => {
  try {
    console.log('📊 Expense AI Data:', JSON.stringify(aiData, null, 2));
    
    const expenseData = aiData.data;
    console.log('💳 Expense Data extracted:', JSON.stringify(expenseData, null, 2));
    
    // Extract message from Railway AI model response format
    let responseMessage = aiData.message;
    if (aiData.message && aiData.message.output) {
      responseMessage = aiData.message.output;
      console.log('💬 Using nested message.output:', responseMessage);
    } else {
      console.log('💬 Using direct message:', responseMessage);
    }
    
    console.log('📝 Final response message:', responseMessage);

    // Always save the expense directly to database (no payment method check)
    console.log(`💰 Saving expense directly to database`);
    
    // Ensure user_id is added to expense data
    const expenseDataWithUserId = {
      ...expenseData,
      user_id: user_id
    };
    
    console.log('💾 Expense data with user_id:', JSON.stringify(expenseDataWithUserId, null, 2));
    
    const expense = await prisma.expense.create({
      data: {
        user_id: expenseDataWithUserId.user_id,
        amount: expenseDataWithUserId.amount,
        category: expenseDataWithUserId.category, // Save exact category from AI model
        subcategory: expenseDataWithUserId.subcategory, // Save exact subcategory from AI model
        companions: expenseDataWithUserId.companions || [],
        date: new Date(expenseDataWithUserId.date),
        paymentMethod: expenseDataWithUserId.paymentMethod || 'unknown', // Default to 'unknown' if not provided
        description: expenseDataWithUserId.description || null
      }
    });
    
    console.log('Expense saved to database:', JSON.stringify(expense, null, 2));

    // Save AI response message with expense reference
    const aiMessage = await prisma.message.create({
      data: {
        user_id,
        content: responseMessage,
        source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
        sender: 'ai',
        expenseId: expense.id
      }
    });

    return {
      success: true,
      message: responseMessage,
      messageId: aiMessage.id,
      expenseId: expense.id
    };

  } catch (error) {
    console.error('Error handling expense response:', error);
    throw error;
  }
};

/**
 * Handle query response from AI service
 * @param {Object} params - Parameters
 * @returns {Promise<Object>} Response object
 */
const handleQueryResponse = async ({ user_id, aiData, source, extMessageId, extChatId }) => {
  try {
    console.log(`Processing query response`);
    console.log('Query AI Data:', JSON.stringify(aiData, null, 2));

    // Extract message from Railway AI model response format
    let responseMessage = aiData.message;
    if (aiData.message && aiData.message.output) {
      responseMessage = aiData.message.output;
      console.log('Using nested message.output:', responseMessage);
    } else {
      console.log('Using direct message:', responseMessage);
    }
    
    console.log('Final query response message:', responseMessage);

    // Save AI response message
    const aiMessage = await prisma.message.create({
      data: {
        user_id,
        content: responseMessage,
        source: source.toLowerCase() === 'web' ? 'web' : 'telegram',
        sender: 'ai'
      }
    });

    return {
      success: true,
      message: responseMessage,
      messageId: aiMessage.id,
      queryData: aiData.data
    };

  } catch (error) {
    console.error('Error handling query response:', error);
    throw error;
  }
};



/**
 * Clear conversation state for a user
 * @param {string} user_id - User ID
 * @returns {Promise<boolean>} Success status
 */
const clearConversationState = async (user_id) => {
  try {
    await prisma.conversationState.deleteMany({
      where: { user_id }
    });

    return true;
  } catch (error) {
    console.error('Error clearing conversation state:', error);
    return false;
  }
};

module.exports = {
  handleIncomingMessage,
  clearConversationState
};
