const axios = require('axios');

// Always use Railway AI model URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://insightful-laughter-production-7c35.up.railway.app/process';
const AI_SERVICE_KEY = process.env.AI_SERVICE_KEY || 'not-required-for-railway';

/**
 * AI Service Client
 * Handles communication with external AI service for expense parsing and query processing
 */
class AIClient {
  constructor() {
    // Always use Railway AI model, no mock mode
    this.mockMode = false;
    console.log('🤖 AI Client initialized - using Railway AI model only');
  }

  /**
   * Send user prompt to AI service and get response
   * @param {string} userPrompt - The user's message/prompt
   * @param {string} userId - The user's ID
   * @returns {Promise<Object>} AI service response
   */
  async processMessage(userPrompt, userId) {
    try {
      // Always use Railway AI model - no mock responses
      console.log('🤖 Processing message with Railway AI model only');

      // Railway AI model expects: { "text": "message", "user_id": "uuid" }
      const requestBody = {
        text: userPrompt,
        user_id: userId
      };

      console.log(`🤖 Sending to Railway AI service: ${userPrompt.substring(0, 50)}...`);
      console.log(`📤 Request body:`, requestBody);

      const response = await axios.post(AI_SERVICE_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Trackaro-Backend/1.0'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log(`✅ Railway AI service response status: ${response.status}`);
      console.log(`📥 Raw Railway AI Response:`, JSON.stringify(response.data, null, 2));

      // Railway AI model returns the response directly (not wrapped in a data property)
      const aiResponse = response.data;
      
      // Log the response structure for debugging
      console.log('🔍 AI Response Structure Analysis:');
      console.log('- Type:', aiResponse.type);
      console.log('- Has data:', !!aiResponse.data);
      console.log('- Has message:', !!aiResponse.message);
      if (aiResponse.message) {
        console.log('- Message type:', typeof aiResponse.message);
        if (aiResponse.message.output) {
          console.log('- Has message.output:', !!aiResponse.message.output);
        }
      }

      return {
        success: true,
        data: aiResponse
      };

    } catch (error) {
      console.error('❌ Railway AI service error:', error.response?.data || error.message);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error: 'AI service error',
          message: error.response.data?.message || `AI service returned error ${error.response.status}`,
          statusCode: error.response.status
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: 'AI service unavailable',
          message: 'Unable to connect to Railway AI service'
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: 'Request error',
          message: error.message
        };
      }
    }
  }

  /**
   * Validate AI service response format
   * @param {Object} response - AI service response
   * @returns {boolean} Whether response is valid
   */
  validateResponse(response) {
    if (!response || typeof response !== 'object') {
      return false;
    }

    // Check required fields for Railway AI model
    if (!response.type || !response.message) {
      return false;
    }

    // Validate expense response
    if (response.type === 'expense') {
      if (!response.data || 
          typeof response.data.amount !== 'number' ||
          !response.data.date ||
          !response.data.category) {
        return false;
      }
    }

    // Validate query response
    if (response.type === 'query') {
      if (!response.data) {
        return false;
      }
    }

    return true;
  }

  /**
   * Test AI service connection
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      // Test with a simple message to Railway AI model
      const testRequestBody = {
        text: "test connection",
        user_id: "test-user-id"
      };

      const response = await axios.post(AI_SERVICE_URL, testRequestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      return {
        success: true,
        message: 'Railway AI service is reachable',
        status: response.status,
        responseType: response.data?.type || 'unknown'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Railway AI service is not reachable',
        error: error.message,
        statusCode: error.response?.status
      };
    }
  }

  // Mock responses removed - only using Railway AI model

  // extractAmount method removed - no longer needed without mock responses
}

module.exports = AIClient;
