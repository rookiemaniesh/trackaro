# Unified Message Handler System

A comprehensive backend message handling system that integrates with external AI services for expense tracking and query processing across web UI and Telegram.

## 🏗️ Architecture

### Components

1. **AI Service Client** (`src/services/aiClient.js`)
   - Handles communication with external AI service
   - Manages API authentication and error handling
   - Validates AI responses

2. **Message Handler** (`src/services/messageHandler.js`)
   - Unified message processing for all sources
   - Handles expense parsing and query processing
   - Manages conversation state for incomplete expenses

3. **Web Messages API** (`src/routes/messages.js`)
   - RESTful endpoints for web UI
   - JWT authentication required
   - Message history and conversation state management

4. **Telegram Integration** (`src/routes/telegram.webhook.js`)
   - Webhook endpoint for Telegram messages
   - Uses same message handler as web UI
   - Automatic user linking via codes

### Database Schema

#### ConversationState Table
```sql
model ConversationState {
  id      Int     @id @default(autoincrement())
  userId  String
  type    String
  payload Json
  user    User    @relation(fields: [userId], references: [id])

  @@unique([userId, type])
}
```

## 🔄 Message Flow

### 1. User Sends Message
- **Web UI**: `POST /api/messages` with JWT token
- **Telegram**: `POST /api/telegram/webhook` (automatic user detection)

### 2. Message Processing
1. Save user message to database
2. Check for pending expenses in conversation state
3. If pending expense exists → process as payment method reply
4. If no pending expense → send to AI service

### 3. AI Service Response Handling

#### Case A: Complete Expense
```json
{
  "type": "expense",
  "data": {
    "amount": 500,
    "date": "2025-09-05T19:45:00Z",
    "companions": ["anjali"],
    "description": "Dinner with Anjali",
    "category": "food",
    "sub_category": "dinner",
    "paymentMethod": "upi"
  },
  "message": "Logged ₹500 for dinner with Anjali via UPI."
}
```
**Action**: Save expense to database, save AI response

#### Case B: Incomplete Expense (Missing Payment Method)
```json
{
  "type": "expense",
  "data": {
    "amount": 500,
    "date": "2025-09-05T19:45:00Z",
    "companions": ["anjali"],
    "description": "Dinner with Anjali",
    "category": "food",
    "sub_category": "dinner",
    "paymentMethod": null
  },
  "message": "Logged ₹500 for dinner with Anjali."
}
```
**Action**: Store in conversation state, ask for payment method

#### Case C: Query Response
```json
{
  "type": "query",
  "data": { "total": 1200 },
  "message": "You spent ₹1,200 on dinner last month."
}
```
**Action**: Save AI response, return to user

### 4. Payment Method Follow-up
When user provides payment method:
1. Extract payment method from message
2. Merge with stored expense data
3. Save complete expense
4. Clear conversation state
5. Send confirmation

## 🚀 API Endpoints

### Web Messages API

#### Send Message
```http
POST /api/messages
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "I spent 500 rupees on dinner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged ₹500 for dinner via UPI.",
  "data": {
    "messageId": "uuid",
    "expenseId": "uuid",
    "queryData": null,
    "requiresPaymentMethod": false
  }
}
```

#### Get Message History
```http
GET /api/messages?limit=50&offset=0
Authorization: Bearer <JWT_TOKEN>
```

#### Get Conversation State
```http
GET /api/messages/state
Authorization: Bearer <JWT_TOKEN>
```

#### Clear Conversation State
```http
DELETE /api/messages/state
Authorization: Bearer <JWT_TOKEN>
```

### Telegram Webhook

```http
POST /api/telegram/webhook
Content-Type: application/json

{
  "message": {
    "chat": { "id": "123456789" },
    "text": "I spent 500 rupees on dinner",
    "message_id": 123
  }
}
```

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```env
# AI Service Configuration
AI_SERVICE_URL="https://your-ai-service.com/api/process"
AI_SERVICE_KEY="your-ai-service-api-key"
```

### AI Service Contract

Your AI service must implement this contract:

**Request:**
```json
{
  "user_prompt": "I spent 500 rupees on dinner with Anjali",
  "user_id": "user-uuid"
}
```

**Response (Expense):**
```json
{
  "type": "expense",
  "data": {
    "amount": 500,
    "date": "2025-09-05T19:45:00Z",
    "companions": ["anjali"],
    "description": "Dinner with Anjali",
    "category": "food",
    "sub_category": "dinner",
    "paymentMethod": "upi"
  },
  "message": "Logged ₹500 for dinner with Anjali via UPI."
}
```

**Response (Query):**
```json
{
  "type": "query",
  "data": { "total": 1200 },
  "message": "You spent ₹1,200 on dinner last month."
}
```

## 🧪 Testing

### Test the System

```bash
# Run the test script
node test-unified-messages.js
```

### Manual Testing

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test web API:**
   ```bash
   # Login to get JWT token
   curl -X POST http://localhost:5000/api/auth/local/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   
   # Send message (replace YOUR_JWT_TOKEN)
   curl -X POST http://localhost:5000/api/messages \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"content":"I spent 500 rupees on dinner"}'
   ```

3. **Test Telegram:**
   - Send message to your bot
   - Bot should process and respond

## 🔒 Security

- **Web API**: Requires JWT authentication
- **Telegram**: Uses chat ID mapping for user identification
- **AI Service**: API key authentication
- **Input Validation**: Message length and content validation
- **Error Handling**: Comprehensive error handling and logging

## 📊 Features

### Expense Processing
- ✅ Complete expense logging
- ✅ Incomplete expense handling with follow-up
- ✅ Payment method extraction
- ✅ Category and subcategory support
- ✅ Companion tracking
- ✅ Date parsing

### Query Processing
- ✅ Natural language queries
- ✅ Expense analytics
- ✅ Historical data queries

### Conversation Management
- ✅ State persistence
- ✅ Follow-up handling
- ✅ Context awareness
- ✅ Multi-turn conversations

### Multi-Platform Support
- ✅ Web UI integration
- ✅ Telegram bot integration
- ✅ Unified message handling
- ✅ Cross-platform consistency

## 🚀 Usage Examples

### Complete Expense Flow
1. User: "I spent 500 rupees on dinner with Anjali via UPI"
2. AI: "Logged ₹500 for dinner with Anjali via UPI."
3. Expense saved to database

### Incomplete Expense Flow
1. User: "I spent 300 rupees on groceries"
2. AI: "What's the payment method?"
3. User: "I paid with cash"
4. AI: "✅ Expense logged! groceries - ₹300 via cash"
5. Expense saved to database

### Query Flow
1. User: "How much did I spend last month?"
2. AI: "You spent ₹1,200 on dinner last month."
3. Query data returned

## 🔧 Customization

### Adding New Payment Methods
Update the `extractPaymentMethod` function in `messageHandler.js`:

```javascript
const patterns = [
  { method: 'upi', keywords: ['upi', 'gpay', 'phonepe'] },
  { method: 'cash', keywords: ['cash', 'money'] },
  { method: 'card', keywords: ['card', 'credit', 'debit'] },
  // Add new patterns here
];
```

### Customizing AI Responses
Modify the response handling in `messageHandler.js` to customize how different AI response types are processed.

### Adding New Message Sources
Extend the `handleIncomingMessage` function to support additional message sources beyond web and Telegram.

## 📝 Logging

The system includes comprehensive logging:
- Message processing steps
- AI service communication
- Database operations
- Error handling
- User actions

Check server logs for detailed information about message processing flow.

## 🎯 Next Steps

1. **Configure AI Service**: Set up your external AI service with the required contract
2. **Test Integration**: Run the test script to verify functionality
3. **Deploy**: Deploy to production with proper environment variables
4. **Monitor**: Monitor logs and user interactions
5. **Extend**: Add new features and payment methods as needed

The unified message handler is now ready for production use! 🚀
