# Recommendations API Documentation

## Overview

The Recommendations API provides intelligent spending analysis and savings suggestions for users. It analyzes spending patterns in food and entertainment categories and provides actionable recommendations for reducing expenses by 5-10%.

## Endpoints

### 1. Spending Analysis
**GET** `/api/recommendations/spending-analysis`

Analyzes spending patterns and provides comprehensive recommendations.

#### Query Parameters
- `period` (optional): Time period for analysis
  - `7d` - Last 7 days
  - `30d` - Last 30 days (default)
  - `90d` - Last 90 days
  - `1y` - Last year
- `categories` (optional): Comma-separated list of categories to analyze (default: "food,entertainment")

#### Response
```json
{
  "success": true,
  "data": {
    "period": {
      "type": "30d",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z",
      "days": 30
    },
    "summary": {
      "totalSpent": 15000.50,
      "expenseCount": 45,
      "averageDailySpending": 500.02,
      "spendingTrend": 5.2
    },
    "categoryBreakdown": [
      {
        "category": "food",
        "total": 8000.00,
        "count": 25,
        "averagePerExpense": 320.00,
        "percentageOfTotal": 53.3
      },
      {
        "category": "entertainment",
        "total": 3000.50,
        "count": 8,
        "averagePerExpense": 375.06,
        "percentageOfTotal": 20.0
      }
    ],
    "savingsScenarios": [
      {
        "reductionPercent": 5,
        "monthlySavings": 750.03,
        "yearlySavings": 9000.36,
        "newMonthlySpending": 14250.48,
        "savingsDescription": "Save ₹750 per month (₹9000 per year)"
      },
      {
        "reductionPercent": 10,
        "monthlySavings": 1500.05,
        "yearlySavings": 18000.72,
        "newMonthlySpending": 13500.45,
        "savingsDescription": "Save ₹1500 per month (₹18000 per year)"
      },
      {
        "reductionPercent": 15,
        "monthlySavings": 2250.08,
        "yearlySavings": 27001.08,
        "newMonthlySpending": 12750.43,
        "savingsDescription": "Save ₹2250 per month (₹27000 per year)"
      }
    ],
    "recommendations": [
      {
        "type": "warning",
        "category": "food",
        "message": "You're spending 53.3% of your budget on food. Consider cooking at home more often.",
        "potentialSavings": 1200.00
      },
      {
        "type": "suggestion",
        "category": "entertainment",
        "message": "Entertainment spending is 20.0% of your budget. Look for free or low-cost alternatives.",
        "potentialSavings": 600.10
      }
    ],
    "recentExpenses": [
      {
        "id": "expense_id",
        "amount": 250.00,
        "category": "food",
        "subcategory": "dining out",
        "date": "2024-01-31T12:00:00.000Z",
        "description": "Lunch at restaurant"
      }
    ]
  }
}
```

### 2. Category Analysis
**GET** `/api/recommendations/category-analysis/:category`

Provides detailed analysis for a specific category.

#### Path Parameters
- `category`: The category to analyze (e.g., "food", "entertainment")

#### Query Parameters
- `period` (optional): Time period (same as above)

#### Response
```json
{
  "success": true,
  "data": {
    "category": "food",
    "period": {
      "type": "30d",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-01-31T23:59:59.999Z"
    },
    "summary": {
      "totalSpent": 8000.00,
      "expenseCount": 25,
      "averagePerExpense": 320.00
    },
    "subcategoryBreakdown": [
      {
        "subcategory": "dining out",
        "total": 4000.00,
        "count": 10,
        "averagePerExpense": 400.00,
        "percentageOfTotal": 50.0
      },
      {
        "subcategory": "groceries",
        "total": 3000.00,
        "count": 12,
        "averagePerExpense": 250.00,
        "percentageOfTotal": 37.5
      }
    ],
    "recommendations": [
      "Consider cooking at home more often to reduce per-meal costs",
      "Try reducing dining out frequency and opt for home-cooked meals",
      "Plan your meals weekly to avoid impulse food purchases",
      "Look for grocery deals and buy in bulk for non-perishables"
    ],
    "expenses": [
      {
        "id": "expense_id",
        "amount": 400.00,
        "category": "food",
        "subcategory": "dining out",
        "date": "2024-01-31T12:00:00.000Z",
        "description": "Dinner at restaurant",
        "paymentMethod": "card"
      }
    ]
  }
}
```

### 3. Savings Goals
**GET** `/api/recommendations/savings-goals`

Provides savings goal recommendations based on spending patterns.

#### Query Parameters
- `targetAmount` (optional): Target savings amount
- `timeframe` (optional): Timeframe in months (default: 12)

#### Response
```json
{
  "success": true,
  "data": {
    "currentSpending": {
      "monthlyAverage": 5000.00,
      "totalSpent": 15000.00
    },
    "savingsGoals": [
      {
        "type": "target_based",
        "targetAmount": 50000,
        "timeframe": 12,
        "monthlySavingsNeeded": 4166.67,
        "achievable": true,
        "recommendations": [
          {
            "category": "food",
            "currentSpending": 3000.00,
            "potentialSavings": 450.00,
            "action": "Reduce food spending by 15%"
          }
        ]
      },
      {
        "type": "percentage_based",
        "reductionPercent": 10,
        "monthlySavings": 500.00,
        "yearlySavings": 6000.00,
        "description": "Reduce discretionary spending by 10%"
      },
      {
        "type": "percentage_based",
        "reductionPercent": 15,
        "monthlySavings": 750.00,
        "yearlySavings": 9000.00,
        "description": "Reduce discretionary spending by 15%"
      }
    ]
  }
}
```

## Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Usage Examples

### Get spending analysis for last 30 days
```bash
curl -X GET "http://localhost:5000/api/recommendations/spending-analysis" \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Get food category analysis for last 90 days
```bash
curl -X GET "http://localhost:5000/api/recommendations/category-analysis/food?period=90d" \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Get savings goals with target amount
```bash
curl -X GET "http://localhost:5000/api/recommendations/savings-goals?targetAmount=50000&timeframe=12" \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Features

### Smart Recommendations
- **Food Spending**: Analyzes dining out vs. groceries, suggests meal planning
- **Entertainment**: Identifies high-cost activities, suggests alternatives
- **General**: Provides overall spending pattern insights

### Savings Calculations
- **5% Reduction**: Conservative savings approach
- **10% Reduction**: Moderate savings approach  
- **15% Reduction**: Aggressive savings approach
- **Custom Goals**: Target-based savings with timeframe

### Spending Trends
- Compares current period with previous period
- Shows spending trend percentage
- Identifies areas of concern

### Category Breakdown
- Detailed subcategory analysis
- Percentage of total spending
- Average per expense calculations
- Recent expense history

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid parameters)
- `401`: Unauthorized (missing or invalid JWT)
- `404`: Not found (no expenses in period)
- `500`: Internal server error
