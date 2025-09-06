const { getBotInfo, setWebhook, getWebhookInfo } = require('../utils/telegram');
require('dotenv').config();

/**
 * Setup script for Telegram bot
 * This script helps configure the Telegram webhook and verify bot setup
 */
async function setupTelegram() {
  try {
    console.log('🤖 Setting up Telegram bot...\n');

    // Check if bot token is configured
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN is not configured in .env file');
      console.log('Please add your bot token to the .env file:');
      console.log('TELEGRAM_BOT_TOKEN="your-bot-token-here"');
      return;
    }

    // Get bot information
    console.log('1. Getting bot information...');
    const botInfo = await getBotInfo();
    console.log(`✅ Bot: @${botInfo.result.username} (${botInfo.result.first_name})`);
    console.log(`   ID: ${botInfo.result.id}`);
    console.log(`   Can join groups: ${botInfo.result.can_join_groups}`);
    console.log(`   Can read all group messages: ${botInfo.result.can_read_all_group_messages}`);

    // Get current webhook info
    console.log('\n2. Checking current webhook...');
    const webhookInfo = await getWebhookInfo();
    
    if (webhookInfo.result.url) {
      console.log(`✅ Current webhook: ${webhookInfo.result.url}`);
      console.log(`   Pending updates: ${webhookInfo.result.pending_update_count}`);
      console.log(`   Last error: ${webhookInfo.result.last_error_message || 'None'}`);
    } else {
      console.log('ℹ️  No webhook currently set');
    }

    // Set webhook if URL is provided
    if (process.env.TELEGRAM_WEBHOOK_URL) {
      console.log('\n3. Setting webhook...');
      const webhookResult = await setWebhook(process.env.TELEGRAM_WEBHOOK_URL);
      
      if (webhookResult.ok) {
        console.log(`✅ Webhook set successfully: ${process.env.TELEGRAM_WEBHOOK_URL}`);
      } else {
        console.log(`❌ Failed to set webhook: ${webhookResult.description}`);
      }
    } else {
      console.log('\n3. Skipping webhook setup (TELEGRAM_WEBHOOK_URL not configured)');
      console.log('   To set webhook, add to .env:');
      console.log('   TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram/webhook"');
    }

    console.log('\n🎉 Telegram bot setup complete!');
    console.log('\nNext steps:');
    console.log('1. Make sure your server is running');
    console.log('2. Test the webhook by sending a message to your bot');
    console.log('3. Use the /api/auth/telegram/start endpoint to generate link codes');

  } catch (error) {
    console.error('❌ Error setting up Telegram bot:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Make sure your bot token is correct and the bot is properly configured');
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTelegram();
}

module.exports = setupTelegram;
