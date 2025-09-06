const axios = require('axios');

const getTelegramApiUrl = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }
  return `https://api.telegram.org/bot${token}`;
};

/**
 * Send a text message to a Telegram chat
 * @param {string} chatId - Telegram chat ID
 * @param {string} text - Message text to send
 * @param {Object} options - Additional options (parse_mode, reply_to_message_id, etc.)
 * @returns {Promise<Object>} Telegram API response
 */
const sendText = async (chatId, text, options = {}) => {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    const payload = {
      chat_id: chatId,
      text: text,
      ...options
    };

    const response = await axios.post(`${getTelegramApiUrl()}/sendMessage`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send a message with inline keyboard
 * @param {string} chatId - Telegram chat ID
 * @param {string} text - Message text
 * @param {Array} keyboard - Inline keyboard buttons
 * @returns {Promise<Object>} Telegram API response
 */
const sendKeyboard = async (chatId, text, keyboard) => {
  try {
    const payload = {
      chat_id: chatId,
      text: text,
      reply_markup: {
        inline_keyboard: keyboard
      }
    };

    const response = await axios.post(`${getTelegramApiUrl()}/sendMessage`, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error sending Telegram keyboard:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Set webhook for Telegram bot
 * @param {string} webhookUrl - Webhook URL
 * @returns {Promise<Object>} Telegram API response
 */
const setWebhook = async (webhookUrl) => {
  try {
    const response = await axios.post(`${getTelegramApiUrl()}/setWebhook`, {
      url: webhookUrl
    });

    return response.data;
  } catch (error) {
    console.error('Error setting webhook:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get webhook info
 * @returns {Promise<Object>} Webhook information
 */
const getWebhookInfo = async () => {
  try {
    const response = await axios.get(`${getTelegramApiUrl()}/getWebhookInfo`);
    return response.data;
  } catch (error) {
    console.error('Error getting webhook info:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete webhook
 * @returns {Promise<Object>} Telegram API response
 */
const deleteWebhook = async () => {
  try {
    const response = await axios.post(`${getTelegramApiUrl()}/deleteWebhook`);
    return response.data;
  } catch (error) {
    console.error('Error deleting webhook:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get bot information
 * @returns {Promise<Object>} Bot information
 */
const getBotInfo = async () => {
  try {
    const response = await axios.get(`${getTelegramApiUrl()}/getMe`);
    return response.data;
  } catch (error) {
    console.error('Error getting bot info:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  sendText,
  sendKeyboard,
  setWebhook,
  getWebhookInfo,
  deleteWebhook,
  getBotInfo
};
