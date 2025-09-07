# Trackaro Backend API

A comprehensive expense tracking and financial management backend built with Node.js, Express.js, and PostgreSQL. Features AI-powered expense parsing, Telegram integration, and intelligent financial recommendations.

## 🚀 Features

### Core Functionality
- **Multi-Authentication**: Local email/password, Google OAuth, and Telegram integration
- **AI-Powered Expense Parsing**: Natural language processing for expense extraction
- **Smart Recommendations**: SIP investment projections and savings analysis
- **Receipt OCR**: Automatic expense extraction from receipt images
- **Real-time Chat**: Web and Telegram messaging with AI assistance
- **Financial Analytics**: Spending analysis, category breakdowns, and trends

### Integrations
- **Telegram Bot**: Link accounts and track expenses via Telegram
- **Google OAuth**: Seamless authentication with Google accounts
- **Railway AI**: Advanced AI service for expense parsing and queries
- **OCR Service**: Receipt image processing and data extraction

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
   ```

2. **Install dependencies**
   ```bash
npm install
   ```

3. **Set up environment variables**
   ```bash
cp env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#environment-variables))

4. **Set up the database**
   ```bash
   # Generate Prisma client
npm run db:generate

   # Run database migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trackaro_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Session Secret (for Google OAuth)
SESSION_SECRET="your-session-secret-key-change-this-in-production"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_BOT_USERNAME="your_bot_username"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram/webhook"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# AI Service Configuration (Railway)
AI_SERVICE_URL="https://insightful-laughter-production-7c35.up.railway.app/process"
AI_SERVICE_KEY="not-required-for-railway"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

## 📊 Database Schema

### User Model
```prisma
model User {
  id                 String    @id @default(uuid())
  email              String    @unique
  password           String?
  googleId           String?   @unique
  profilePicture     String?
  telegramChatId     String?   @unique
  telegramLinkCode   String?
  telegramLinkExpiry DateTime?
  createdAt          DateTime  @default(now())
  
  expenses           Expense[]
  messages           Message[]
  conversationStates ConversationState[]
}
```

### Expense Model
```prisma
model Expense {
  id            String    @id @default(uuid())
  user_id       String
  amount        Decimal   @db.Decimal(14,2)
  category      String
  subcategory   String?
  companions    String[]
  date          DateTime
  paymentMethod String?
  description   String?
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [user_id], references: [id])
  messages      Message[]
}
```

### Message Model
```prisma
model Message {
  id            String   @id @default(uuid())
  user_id       String
  sender        Sender   // 'user' or 'ai'
  source        Source   // 'web' or 'telegram'
  content       String
  extMessageId  String?
  extChatId     String?
  expenseId     String?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [user_id], references: [id])
  expense       Expense? @relation(fields: [expenseId], references: [id])
}
```

## 🛣️ API Endpoints

### Authentication

#### Local Authentication
- `POST /api/auth/local/register` - Register new user
- `POST /api/auth/local/login` - Login with email/password
- `PUT /api/auth/local/change-password` - Change password

#### Google OAuth
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/google/url` - Get Google OAuth URL

#### Telegram Integration
- `POST /api/auth/telegram/start` - Generate Telegram link code
- `GET /api/auth/telegram/status` - Get Telegram linking status
- `DELETE /api/auth/telegram/unlink` - Unlink Telegram account

### Expenses
- `GET /api/expenses` - Get user expenses (with pagination and filters)
- `GET /api/expenses/:id` - Get specific expense
- `POST /api/expenses/payment` - Create expense from payment form
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Messages & Chat
- `POST /api/messages` - Send message (web UI)
- `GET /api/messages` - Get conversation history
- `GET /api/messages/state` - Get conversation state
- `DELETE /api/messages/state` - Clear conversation state

### Recommendations
- `GET /api/recommendations/spending-analysis` - Get spending analysis and SIP projections
- `GET /api/recommendations/category-analysis/:category` - Get detailed category analysis
- `GET /api/recommendations/savings-goals` - Get savings goal recommendations

### OCR & Receipt Processing
- `POST /api/ocr/process-receipt` - Process receipt image with OCR
- `GET /api/ocr/history` - Get OCR processing history

### Telegram Webhook
- `POST /api/telegram/webhook` - Telegram webhook endpoint
- `GET /api/telegram/webhook/info` - Get webhook information
- `POST /api/telegram/webhook/setup` - Set webhook URL

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Health Check
- `GET /health` - Server health check

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "googleId": "google-id-or-null",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🤖 AI Integration

### Railway AI Service
The backend integrates with a Railway-hosted AI service for:
- **Expense Parsing**: Extract structured data from natural language
- **Query Processing**: Answer questions about spending patterns
- **Smart Categorization**: Automatically categorize expenses

### AI Response Format
```json
{
  "type": "expense|query",
  "message": "Response message",
  "data": {
    "amount": 100.50,
    "category": "food",
    "subcategory": "dining",
    "date": "2024-01-15",
    "paymentMethod": "upi",
    "description": "Lunch at restaurant",
    "companions": ["friend1", "friend2"]
  }
}
```

## 📱 Telegram Integration

### Bot Setup
1. Create a Telegram bot via [@BotFather](https://t.me/botfather)
2. Get the bot token and username
3. Set webhook URL to your server's `/api/telegram/webhook` endpoint

### Account Linking
1. User generates a 6-digit link code via web interface
2. User sends the code to the Telegram bot
3. Bot automatically links the account and enables expense tracking

### Supported Commands
- Natural language expense entries
- Spending queries and analysis
- Account management

## 🧮 SIP Investment Calculations

The recommendations system includes SIP (Systematic Investment Plan) projections:

### Calculation Formula
```javascript
// SIP Future Value Formula
FV = P * [((1 + r)^n - 1) / r] * (1 + r)

Where:
- P = Monthly investment amount
- r = Monthly return rate (12% annual / 12 months)
- n = Number of months
```

### Projection Scenarios
- **5% Reduction**: Conservative savings scenario
- **10% Reduction**: Moderate savings scenario  
- **15% Reduction**: Aggressive savings scenario

### Time Horizons
- **5-year SIP**: 60 months of investment
- **10-year SIP**: 120 months of investment

## 📸 OCR Receipt Processing

### Supported Features
- **Image Formats**: JPEG, PNG, WebP
- **File Size**: Up to 10MB
- **Automatic Extraction**: Amount, date, category, payment method
- **Expense Creation**: Automatically creates expense records

### OCR Service Integration
- External OCR service via Railway
- Automatic data validation and expense creation
- Error handling for processing failures

## 🛡️ Security Features

### Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Google OAuth integration
- Telegram account linking

### Data Protection
- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- CORS configuration for cross-origin requests
- Helmet.js for security headers

### Rate Limiting & Validation
- File upload size limits (10MB)
- Message length limits (1000 characters)
- Input validation on all endpoints

## 🚀 Deployment

### Production Setup
1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Database Migration**
   ```bash
   npm run db:deploy
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Railway Deployment
The backend is optimized for Railway deployment with:
- Automatic environment variable configuration
- Railway AI service integration
- PostgreSQL database support

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm start           # Start production server

# Database
npm run db:generate # Generate Prisma client
npm run db:migrate  # Run database migrations
npm run db:deploy   # Deploy migrations to production
npm run db:studio   # Open Prisma Studio

# Telegram
npm run telegram:setup # Setup Telegram webhook
```

## 🧪 Testing

### Manual Testing
- Use the provided test scripts in the root directory
- Test AI integration with `test-ai-integration.js`
- Test Railway deployment with `test-railway-only.js`

### API Testing
Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Documentation

### Additional Documentation
- `RECOMMENDATIONS_API.md` - Detailed recommendations API documentation
- `TELEGRAM_SETUP.md` - Telegram bot setup guide
- `UNIFIED_MESSAGES.md` - Message handling system documentation
- `POWERBI_INTEGRATION.md` - PowerBI integration guide
- `RAILWAY_AI_INTEGRATION.md` - Railway AI service integration

### API Response Format
All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation files in the backend directory
- Review the API endpoint documentation
- Test with the provided test scripts

---

**Trackaro Backend** - Intelligent expense tracking and financial management powered by AI.