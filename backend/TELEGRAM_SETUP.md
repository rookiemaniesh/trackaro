# Telegram Bot Integration Setup

This guide will help you set up Telegram bot integration for your Trackaro application.

## Prerequisites

1. A Telegram account
2. A Telegram bot token (from @BotFather)
3. Your Trackaro backend running
4. A public URL for webhook (for production)

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the instructions to create your bot
5. Save the bot token you receive
6. (Optional) Configure bot settings with `/setcommands`:

```
start - Welcome message
help - Show help and commands
expenses - View recent expenses
link - Get account linking instructions
```

## Step 2: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
TELEGRAM_BOT_USERNAME="your_bot_username"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram/webhook"
```

## Step 3: Set Up Webhook (Production)

For production, you need to set up a webhook so Telegram can send messages to your server:

```bash
# Set webhook URL
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/api/telegram/webhook"}'
```

Or use the built-in setup script:

```bash
npm run telegram:setup
```

## Step 4: Test the Integration

### 1. Start your server

```bash
npm run dev
```

### 2. Test webhook endpoint

```bash
curl -X POST http://localhost:5000/api/telegram/webhook/info
```

### 3. Test link code generation

First, get a JWT token by logging in:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login to get token
curl -X POST http://localhost:5000/api/auth/local/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Then generate a link code:

```bash
curl -X POST http://localhost:5000/api/auth/telegram/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Test Telegram linking

1. Send the generated code to your bot in Telegram
2. The bot should respond with a success message
3. Send `/help` to test the bot functionality

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/telegram/start` - Generate link code (requires JWT)
- `GET /api/auth/telegram/status` - Get linking status (requires JWT)
- `DELETE /api/auth/telegram/unlink` - Unlink Telegram account (requires JWT)

### Webhook Endpoints

- `POST /api/telegram/webhook` - Receive messages from Telegram
- `GET /api/telegram/webhook/info` - Get webhook information
- `POST /api/telegram/webhook/setup` - Set webhook URL

## User Flow

1. **User Registration/Login**: User signs up or logs in via web app (email/password or Google)
2. **Generate Link Code**: User goes to Settings > Telegram and generates a link code
3. **Link Telegram**: User sends the code to the bot in Telegram
4. **Account Linked**: Bot confirms linking and user can now chat with the bot
5. **Chat with Bot**: User can send messages to the bot, which are processed by your backend

## Bot Commands

The bot supports these commands:

- `/start` - Welcome message
- `/help` - Show available commands
- `/expenses` - View recent expenses
- `/link` - Get account linking instructions

## Message Processing

All messages sent to the bot are processed by the `handleIncomingMessage` function, which:

1. Saves the message to the database
2. Processes the message (commands, natural language, etc.)
3. Generates a response
4. Saves the response to the database
5. Sends the response back to the user

## Security Considerations

1. **Webhook Security**: In production, consider validating webhook requests from Telegram
2. **Rate Limiting**: Implement rate limiting for webhook endpoints
3. **Token Security**: Keep your bot token secure and never commit it to version control
4. **User Privacy**: Only process messages from linked accounts

## Troubleshooting

### Bot not responding

1. Check if the webhook is set correctly:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

2. Check server logs for errors

3. Verify the bot token is correct

### Link code not working

1. Check if the code has expired (10 minutes)
2. Verify the user is logged in and has a valid JWT token
3. Check database for the link code

### Webhook not receiving updates

1. Ensure your server is accessible from the internet
2. Check if the webhook URL is correct
3. Verify SSL certificate (required for webhooks)

## Development vs Production

### Development
- Use ngrok or similar tool to expose local server
- Set webhook to your ngrok URL
- Test with your personal Telegram account

### Production
- Deploy to a server with a public domain
- Set up SSL certificate
- Configure proper webhook URL
- Monitor logs and errors

## Example Frontend Integration

```javascript
// Generate link code
const generateLinkCode = async () => {
  const response = await fetch('/api/auth/telegram/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  if (data.success) {
    // Show code to user: "Send '123456' to @your_bot"
    showLinkCode(data.data.code, data.data.instructions);
  }
};

// Check linking status
const checkTelegramStatus = async () => {
  const response = await fetch('/api/auth/telegram/status', {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });
  
  const data = await response.json();
  return data.data.isLinked;
};
```

## Support

If you encounter issues:

1. Check the server logs
2. Verify all environment variables are set
3. Test the webhook endpoint manually
4. Check Telegram Bot API documentation
5. Review the Prisma database for data consistency
