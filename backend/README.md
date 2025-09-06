
## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Telegram Bot Token (optional)
- AI Service credentials (optional)

### Installation

```bash
# Clone and install dependencies
git clone <repository-url>
cd backend
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Set up database
npm run db:migrate
npm run db:generate

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trackaro"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Session Secret (for Google OAuth)
SESSION_SECRET="your-session-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_BOT_USERNAME="YourBotName"
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram/webhook"

# AI Service (Optional)
AI_SERVICE_URL="https://your-ai-service.com/api/process"
AI_SERVICE_KEY="your-ai-service-api-key"

# Server Configuration
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## 📊 Database Schema

### Core Models

#### User
```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String?  // Nullable for OAuth users
  googleId        String?  @unique
  profilePicture  String?
  telegramChatId  String?  @unique
  telegramLinkCode String?
  telegramLinkExpiry DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  expenses        Expense[]
  messages        Message[]
  conversationStates ConversationState[]
}
```

#### Expense
```prisma
model Expense {
  id            String   @id @default(cuid())
  userId        String
  amount        Float
  category      String
  subCategory   String
  companions    String[] // Array of companion names
  description   String
  paymentMethod String?
  date          DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id])
  messages      Message[]
}
```

#### Message
```prisma
model Message {
  id          String   @id @default(cuid())
  userId      String
  sender      Sender   // "user" or "ai"
  source      Source   // "web" or "telegram"
  content     String
  expenseId   String?
  createdAt   DateTime @default(now())
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
  expense     Expense? @relation(fields: [expenseId], references: [id])
}
```

#### ConversationState
```prisma
model ConversationState {
  id      Int    @id @default(autoincrement())
  userId  String
  type    String // "pending_expense"
  payload Json   // Stores partial expense data
  user    User   @relation(fields: [userId], references: [id])
  
  @@unique([userId, type])
}
```

## 🔐 Authentication

### Supported Methods

1. **Email/Password** - Traditional registration and login
2. **Google OAuth** - Social authentication
3. **Telegram Linking** - Link Telegram account to existing user

### Authentication Flow

```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant G as Google
    participant T as Telegram

    Note over F,T: Email/Password Flow
    F->>B: POST /api/auth/local/register
    B->>B: Hash password, create user
    B->>F: JWT token

    Note over F,T: Google OAuth Flow
    F->>G: Redirect to Google OAuth
    G->>F: Authorization code
    F->>B: POST /api/auth/google/callback
    B->>G: Verify token
    B->>B: Create/find user
    B->>F: JWT token

    Note over F,T: Telegram Linking Flow
    F->>B: POST /api/auth/telegram/start (JWT required)
    B->>F: 6-digit link code
    F->>T: Send code to bot
    T->>B: POST /api/telegram/webhook
    B->>B: Link Telegram to user
    B->>T: Confirmation message
```

## �� API Endpoints

### Authentication Endpoints

#### Local Authentication
```http
POST /api/auth/local/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

```http
POST /api/auth/local/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}