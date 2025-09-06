# Railway AI Model Integration Guide

## 🚀 Overview

Your backend has been successfully integrated with the Railway-deployed AI model. The AI model processes user messages and returns structured responses for expense tracking and queries.

## 🔧 Configuration

### Environment Variables

Update your `.env` file with the following:

```env
# AI Service Configuration (Railway)
AI_SERVICE_URL="https://insightful-laughter-production-7c35.up.railway.app/process"
AI_SERVICE_KEY="not-required-for-railway"
```

### Request Format

The Railway AI model expects requests in this format:

```json
{
  "text": "I spent 500 today on dinner",
  "user_id": "22f8e821-16ea-4f98-a945-30f0e20181f5"
}
```

### Response Format

The Railway AI model returns responses in this format:

```json
{
  "type": "expense",
  "data": {
    "amount": 500,
    "date": "2024-08-08T00:00:00",
    "companions": [],
    "description": "Dinner",
    "category": "Food",
    "subcategory": "Restaurant",
    "paymentMethod": null
  },
  "message": {
    "output": "You had a great day! 🎉 On August 8th, you treated yourself to a delicious dinner 🍽 at a restaurant! The total came to $500.00 💸, quite a splurge for a delicious meal! It was a fantastic food experience in the Restaurant category. Enjoy the memories! 😄\n"
  }
}
```

## 🧪 Testing

### 1. Test Railway AI Model Directly

Run the test script to verify the Railway AI model is working:

```bash
cd backend
node test-railway-ai.js
```

This will test various input scenarios and validate the response format.

### 2. Test Backend Integration

Start your backend server:

```bash
cd backend
npm run dev
```

Test the integration through the API:

```bash
# Test expense input
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content": "I spent 500 today on dinner"}'

# Test query input
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"content": "How much did I spend last month?"}'
```

### 3. Test Frontend Integration

1. Start your frontend:
   ```bash
   cd pie-rates-pantheon25/frontend
   npm run dev
   ```

2. Login and go to the chat page
3. Send messages like:
   - "I spent 500 today on dinner"
   - "How much did I spend last month?"
   - "I spent 1000 on groceries using UPI"

## 🔄 How It Works

### 1. Message Flow

```
User Input → Frontend → Backend → Railway AI Model → Backend → Database → Frontend
```

### 2. Processing Steps

1. **User sends message** via frontend chat interface
2. **Backend receives** message at `/api/messages`
3. **AI Client** sends request to Railway AI model
4. **Railway AI model** processes and returns structured response
5. **Backend** validates and processes the response:
   - If `type: "expense"` → Save to database or store as pending
   - If `type: "query"` → Return query response
6. **Response** sent back to frontend

### 3. Expense Processing

- **Complete expenses** (with payment method) are saved immediately
- **Incomplete expenses** (missing payment method) are stored as pending
- **Payment method replies** complete the pending expense

### 4. Query Processing

- **Query responses** are returned directly to the user
- **No database storage** for query responses

## 🛠️ Key Changes Made

### 1. AI Client (`src/services/aiClient.js`)

- ✅ Updated request format to match Railway AI model
- ✅ Removed authentication headers (not required for Railway)
- ✅ Enhanced logging for debugging
- ✅ Updated test connection method

### 2. Message Handler (`src/services/messageHandler.js`)

- ✅ Updated to handle Railway AI model response format
- ✅ Added support for nested message structure (`message.output`)
- ✅ Fixed field mapping (`subcategory` vs `sub_category`)
- ✅ Enhanced error handling and logging

### 3. Environment Configuration

- ✅ Updated `env.example` with Railway AI model URL
- ✅ Set `AI_SERVICE_KEY` to "not-required-for-railway"

### 4. Test Script

- ✅ Created `test-railway-ai.js` for direct testing
- ✅ Tests various input scenarios
- ✅ Validates response structure

## 🐛 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check if Railway AI model is running
   - Verify the URL is correct
   - Check network connectivity

2. **Invalid Response Format**
   - Check Railway AI model logs
   - Verify request format matches expected structure
   - Check for any changes in the AI model response

3. **Authentication Errors**
   - Ensure JWT token is valid
   - Check if user is logged in
   - Verify backend authentication middleware

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd backend
   npm run dev
   # Look for AI service logs
   ```

2. **Test Railway AI Model Directly**
   ```bash
   cd backend
   node test-railway-ai.js
   ```

3. **Check Frontend Console**
   - Open browser DevTools
   - Look for API request/response logs
   - Check for any error messages

## 📊 Monitoring

### Backend Logs

Look for these log messages:

- `🤖 Sending to Railway AI service: ...`
- `✅ Railway AI service response status: ...`
- `📥 Response data: ...`
- `💰 Saving complete expense`
- `❓ Processing query response`

### Frontend Logs

Check browser console for:

- API request/response logs
- Error messages
- Chat message updates

## 🚀 Next Steps

1. **Test the integration** with various input scenarios
2. **Monitor performance** and response times
3. **Add error handling** for edge cases
4. **Consider caching** for frequently asked queries
5. **Add analytics** to track usage patterns

## 📝 Notes

- The Railway AI model doesn't require authentication
- Response times may vary based on Railway's infrastructure
- The AI model handles both expense tracking and query processing
- All responses are logged for debugging purposes

---

**Integration Status**: ✅ Complete and Ready for Testing

