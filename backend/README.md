# Trackaro Backend API

Expense tracking backend with AI-powered parsing, Telegram integration, rate limiting, and async job queues.

## Tech Stack

- **Runtime**: Node.js + Express 5
- **Database**: PostgreSQL + Prisma ORM
- **Queue**: BullMQ + Redis
- **Auth**: JWT, Google OAuth, Telegram

## Quick Start

```bash
# Install
npm install

# Setup database
npm run db:generate
npm run db:migrate

# Run (2 terminals)
npm run dev      # API server
npm run worker   # Background worker
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/trackaro"

# JWT
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
SESSION_SECRET="session-secret"

# Telegram
TELEGRAM_BOT_TOKEN="bot-token"
TELEGRAM_BOT_USERNAME="bot_username"

# Services
FRONTEND_URL="http://localhost:3000"
AI_SERVICE_URL="https://your-ai-service/process"
OCR_API_URL="https://your-ocr-service/process-receipt/"
REDIS_URL="redis://default:pass@host:port"

# Rate Limiting (optional)
RATE_LIMIT_AI_MAX=10
RATE_LIMIT_OCR_MAX=5
RATE_LIMIT_GENERAL_MAX=100

# Server
PORT=5000
NODE_ENV="development"
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/local/register` | Register user |
| POST | `/api/auth/local/login` | Login |
| GET | `/api/auth/google` | Google OAuth |
| POST | `/api/auth/telegram/start` | Link Telegram |
| POST | `/api/auth/logout` | Logout |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses |
| GET | `/api/expenses/:id` | Get expense |
| POST | `/api/expenses/payment` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Messages (Async)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages` | Send message → returns `jobId` |
| GET | `/api/messages` | Get history |
| GET | `/api/jobs/:jobId` | Poll job status |

### OCR
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ocr/process-receipt` | Upload receipt |
| GET | `/api/ocr/history` | OCR history |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/telegram/webhook` | Telegram webhook |

## Rate Limiting

| Limiter | Endpoint | Limit |
|---------|----------|-------|
| AI | `/api/messages` | 10/min |
| OCR | `/api/ocr/*` | 5/min |
| General | `/api/*` | 100/15min |

Exceeded limit returns `429 Too Many Requests`.

## Async Job Queue

Messages are processed asynchronously:

```
POST /api/messages → 202 { jobId }
                          ↓
GET /api/jobs/:jobId → { state: "waiting" | "active" | "completed" | "failed" }
```

**Job Result (when completed):**
```json
{
  "state": "completed",
  "result": { "messageId": "...", "expenseId": "..." }
}
```

## Database Models

```prisma
User { id, email, password?, googleId?, telegramChatId?, ... }
Expense { id, user_id, amount, category, date, paymentMethod, ... }
Message { id, user_id, sender, source, content, expenseId?, ... }
ConversationState { id, user_id, type, payload }
```

## Scripts

```bash
npm run dev           # Development server
npm run worker        # Background worker
npm start             # Production server
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:studio     # Prisma Studio
npm run telegram:setup # Setup Telegram webhook
```

## Deployment

1. Set all environment variables
2. `npm run db:deploy`
3. Start API: `npm start`
4. Start Worker: `npm run worker`

For Railway: Deploy API and Worker as separate services.
