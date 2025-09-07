# Frontend Recommendations Feature

## Overview

The Recommendations feature provides a comprehensive frontend interface for analyzing spending patterns and receiving personalized savings suggestions. It integrates with the backend recommendations API to display intelligent insights about food and entertainment spending.

## Features

### 🎯 **Smart Spending Analysis**
- **Period Selection**: Choose from 7 days, 30 days, 90 days, or 1 year
- **Category Focus**: Analyze food and entertainment spending patterns
- **Visual Breakdown**: Interactive charts and progress bars
- **Trend Analysis**: Compare current vs. previous period spending

### 💡 **Savings Suggestions**
- **5% Reduction**: Conservative savings approach
- **10% Reduction**: Moderate savings approach  
- **15% Reduction**: Aggressive savings approach
- **Smart Recommendations**: AI-powered suggestions based on spending patterns
- **Action Tips**: Practical advice for reducing expenses

### 📊 **Category Analysis**
- **Detailed Breakdown**: Subcategory analysis for food and entertainment
- **Payment Method Tracking**: Visual indicators for different payment types
- **Recent Expenses**: Latest transactions with detailed information
- **Category-Specific Recommendations**: Tailored advice for each category

### 🎯 **Savings Goals**
- **Target-Based Goals**: Set specific savings targets with timeframes
- **Percentage-Based Goals**: Reduce spending by specific percentages
- **Achievability Assessment**: Smart evaluation of goal feasibility
- **Action Plans**: Step-by-step recommendations to achieve goals

## Components

### 1. Recommendations Page (`/recommendations`)
**Location**: `src/app/recommendations/page.tsx`

Main page component that orchestrates all recommendation features:
- Period and category selection
- Data fetching and state management
- Component layout and responsive design
- Error handling and loading states

### 2. Spending Analysis Card
**Location**: `src/components/recommendations/SpendingAnalysisCard.tsx`

Displays comprehensive spending overview:
- Total spent, daily average, transaction count
- Spending trend analysis
- Category breakdown with percentages
- Recent expenses list

### 3. Savings Suggestions Card
**Location**: `src/components/recommendations/SavingsSuggestionsCard.tsx`

Shows potential savings scenarios:
- 5%, 10%, and 15% reduction scenarios
- Monthly and yearly savings calculations
- Smart recommendations with icons
- Quick action tips

### 4. Category Analysis Card
**Location**: `src/components/recommendations/CategoryAnalysisCard.tsx`

Detailed category-specific analysis:
- Subcategory breakdown with progress bars
- Payment method indicators
- Category-specific recommendations
- Recent expenses for the category

### 5. Savings Goals Card
**Location**: `src/components/recommendations/SavingsGoalsCard.tsx`

Goal setting and tracking:
- Current spending overview
- Target-based and percentage-based goals
- Achievability assessment
- Goal achievement tips

## Navigation Integration

The recommendations feature is integrated into the main navigation:

### Sidebar Integration
- **Route**: `/recommendations`
- **Icon**: RecommendationIcon (checkmark with clock)
- **Label**: "Recommendations"
- **Active State**: Blue background when on recommendations page

### Navigation Flow
1. **Dashboard** → **Recommendations**: Access from main dashboard
2. **Chat** → **Recommendations**: Access from chat interface
3. **Profile** → **Recommendations**: Access from user profile

## API Integration

### Data Fetching
The frontend uses the `useApi` hook to fetch data from the backend:

```typescript
const { get } = useApi();

// Fetch spending analysis
const response = await get(`/api/recommendations/spending-analysis?period=${selectedPeriod}&categories=food,entertainment`);

// Fetch category analysis
const response = await get(`/api/recommendations/category-analysis/${selectedCategory}?period=${selectedPeriod}`);

// Fetch savings goals
const response = await get("/api/recommendations/savings-goals");
```

### Error Handling
- **Loading States**: Spinner animation during data fetching
- **Error Display**: User-friendly error messages
- **Retry Logic**: Automatic retry on period/category changes
- **Fallback UI**: Graceful degradation when data is unavailable

## Responsive Design

### Mobile Optimization
- **Grid Layout**: Responsive grid that adapts to screen size
- **Card Stacking**: Cards stack vertically on mobile devices
- **Touch-Friendly**: Large touch targets for mobile interaction
- **Readable Text**: Optimized font sizes for mobile screens

### Desktop Enhancement
- **Side-by-Side Layout**: Cards display side-by-side on larger screens
- **Hover Effects**: Interactive hover states for better UX
- **Smooth Animations**: Framer Motion animations for polished feel

## Styling and Theming

### Design System
- **Color Palette**: Consistent color scheme with gradients
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins
- **Borders**: Subtle borders with rounded corners

### Dark Mode Support
- **Automatic Detection**: Respects user's system preference
- **Consistent Theming**: All components support dark mode
- **Accessibility**: High contrast ratios maintained

### Animation System
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Staggered Animations**: Cards animate in sequence
- **Loading States**: Skeleton loaders and spinners
- **Hover Effects**: Subtle scale and color transitions

## User Experience Features

### Interactive Elements
- **Period Selector**: Dropdown for time period selection
- **Category Tabs**: Toggle between food and entertainment analysis
- **Hover States**: Visual feedback on interactive elements
- **Click Animations**: Satisfying micro-interactions

### Data Visualization
- **Progress Bars**: Visual representation of spending percentages
- **Color Coding**: Intuitive color schemes for different data types
- **Icons**: Meaningful icons for quick recognition
- **Charts**: Clean, readable data presentation

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations
- **Focus Indicators**: Clear focus states for navigation

## Performance Optimizations

### Code Splitting
- **Dynamic Imports**: Components loaded on demand
- **Lazy Loading**: Images and heavy components loaded as needed
- **Bundle Optimization**: Minimal JavaScript bundle size

### Data Management
- **Caching**: API responses cached to reduce server requests
- **Debouncing**: Search and filter inputs debounced
- **Memoization**: Expensive calculations memoized
- **State Optimization**: Minimal re-renders with proper state management

## Future Enhancements

### Planned Features
- **Export Functionality**: Download reports as PDF/CSV
- **Goal Tracking**: Visual progress tracking for savings goals
- **Notifications**: Alerts for spending milestones
- **Comparison Tools**: Compare spending across different periods

### Integration Opportunities
- **Calendar Integration**: Link expenses to calendar events
- **Budget Planning**: Set and track monthly budgets
- **Social Features**: Share achievements with friends
- **AI Insights**: More advanced AI-powered recommendations

## Usage Examples

### Basic Usage
```tsx
import RecommendationsPage from '@/app/recommendations/page';

// The page is automatically routed to /recommendations
// Users can access it through the sidebar navigation
```

### Custom Integration
```tsx
import { SpendingAnalysisCard } from '@/components/recommendations/SpendingAnalysisCard';

// Use individual components in other pages
<SpendingAnalysisCard data={spendingData} />
```

## Troubleshooting

### Common Issues
1. **Data Not Loading**: Check API endpoint and authentication
2. **Styling Issues**: Verify Tailwind CSS classes are properly configured
3. **Animation Problems**: Ensure Framer Motion is properly installed
4. **Responsive Issues**: Test on different screen sizes

### Debug Mode
Enable debug mode by adding `?debug=true` to the URL to see:
- API request/response logs
- Component render information
- Performance metrics
- Error details

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access recommendations: `http://localhost:3000/recommendations`

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Component Structure**: Consistent component organization

### Testing
- **Unit Tests**: Component-level testing
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user journey testing
- **Accessibility Tests**: WCAG compliance testing
