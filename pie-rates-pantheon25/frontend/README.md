# Trackaro Frontend

A modern, AI-powered expense tracking application built with Next.js, React, and TypeScript. Trackaro provides an intuitive interface for managing personal finances with advanced AI capabilities.

## 🚀 Features

### Core Features
- **AI-Powered Expense Tracking** - Natural language processing for easy expense entry
- **Interactive Dashboards** - Visual analytics and spending insights
- **Receipt Scanning** - OCR technology for automatic expense extraction
- **Voice Commands** - Hands-free expense logging
- **Telegram Integration** - Conversational interface via Telegram bot
- **Real-time Analytics** - Live financial data visualization

### Technical Features
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - Seamless theme switching
- **Advanced Animations** - GSAP and Framer Motion for smooth interactions
- **Type Safety** - Full TypeScript implementation
- **Performance Optimized** - Next.js 14 with App Router
- **Modern UI Components** - Custom component library

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React Context API
- **Authentication**: JWT-based auth system
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 📦 Installation

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trackaro-web02/pie-rates-pantheon25/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   NEXT_PUBLIC_AI_SERVICE_URL=your_ai_service_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── chat/              # Chat interface
│   │   ├── profile/           # User profile
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── ChatMockup.tsx     # Interactive chat demo
│   │   ├── Dashboard.tsx      # Analytics dashboard
│   │   ├── LandingPage.tsx    # Main landing page
│   │   ├── Navbar.tsx         # Navigation component
│   │   └── TechnologyPage.tsx # Tech stack showcase
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── utils/                 # Helper functions
├── public/                    # Static assets
│   ├── feature_pic/          # Feature images
│   └── team/                 # Team member photos
├── components.json           # UI component configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Custom Trackaro brand colors
- **Background**: Light cream (`rgb(250, 247, 240)`) for hero section
- **Secondary**: Warm beige (`rgb(237, 233, 222)`) for other sections
- **Accent**: Orange (`#f97316`) for CTAs and highlights
- **Text**: Dark gray for readability

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes for impact
- **Body Text**: Regular weight, optimized for readability

### Components
- **Buttons**: Rounded, with hover effects and smooth transitions
- **Cards**: Subtle shadows, rounded corners
- **Forms**: Clean inputs with focus states
- **Animations**: Smooth, purposeful motion design

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Code Quality
npm run format       # Format code with Prettier
npm run test         # Run tests (if configured)
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration:
- Custom color palette
- Extended spacing and sizing
- Custom animations
- Dark mode support

### Next.js
- App Router for modern routing
- Image optimization
- Font optimization
- Static generation where possible

### TypeScript
- Strict type checking
- Path aliases for clean imports
- Custom type definitions

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations

### GSAP Animations
- Hero section entrance animations
- Scroll-triggered animations
- Interactive hover effects
- Timeline-based sequences

### Framer Motion
- Page transitions
- Component animations
- Gesture interactions
- Layout animations

## 🔐 Authentication

The app supports multiple authentication methods:
- **Local Authentication** - Email/password
- **Google OAuth** - Social login
- **Telegram Integration** - Bot-based auth

## 🌐 API Integration

### Backend Communication
- RESTful API calls
- Real-time data updates
- Error handling and loading states
- JWT token management

### External Services
- AI service integration
- Telegram Bot API
- OCR services for receipt scanning

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Armaan** - Full Stack Developer
- **Himashu** - Frontend Developer
- **Kshitij** - Backend Developer
- **Manish** - AI/ML Engineer
- **Rajveer** - UI/UX Designer

## 📞 Support

For support, email support@trackaro.com or join our Discord community.

## 🔗 Links

- [Live Demo](https://trackaro.vercel.app)
- [Documentation](https://docs.trackaro.com)
- [API Documentation](https://api.trackaro.com/docs)

---

**Built with ❤️ by Team Pie-Rates**