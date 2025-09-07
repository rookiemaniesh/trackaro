const express = require('express');
const { PrismaClient } = require('../../generated/prisma');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/recommendations/spending-analysis
router.get('/spending-analysis', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's expenses from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const expenses = await prisma.expense.findMany({
      where: {
        user_id: userId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total spending (30-day period)
    const totalSpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    
    // Calculate average daily spending
    const days = 30;
    const averageDailySpending = totalSpending / days;
    
    // Calculate estimated monthly spending (assuming 30-day period represents monthly spending)
    const estimatedMonthlySpending = totalSpending;
    
    // Calculate category breakdown
    const categoryBreakdown = {};
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = 0;
      }
      categoryBreakdown[category] += Number(expense.amount);
    });

    // Convert to array and sort by amount
    const categoryArray = Object.entries(categoryBreakdown)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
        percentage: parseFloat(((amount / totalSpending) * 100).toFixed(2))
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate potential savings scenarios based on monthly spending
    const savingsScenarios = [
      {
        reductionPercent: 5,
        monthlySavings: (estimatedMonthlySpending * 0.05),
        description: "5% reduction in monthly spending"
      },
      {
        reductionPercent: 10,
        monthlySavings: (estimatedMonthlySpending * 0.10),
        description: "10% reduction in monthly spending"
      },
      {
        reductionPercent: 15,
        monthlySavings: (estimatedMonthlySpending * 0.15),
        description: "15% reduction in monthly spending"
      }
    ];

    // Calculate SIP investment projections
    const sipProjections = calculateSIPProjections(savingsScenarios);

    res.json({
      success: true,
      data: {
        totalSpending: parseFloat(totalSpending.toFixed(2)),
        estimatedMonthlySpending: parseFloat(estimatedMonthlySpending.toFixed(2)),
        averageDailySpending: parseFloat(averageDailySpending.toFixed(2)),
        categoryBreakdown: categoryArray,
        savingsScenarios: savingsScenarios.map(scenario => ({
          ...scenario,
          monthlySavings: parseFloat(scenario.monthlySavings.toFixed(2))
        })),
        sipProjections
      }
    });

  } catch (error) {
    console.error('Error in spending analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze spending data',
      error: error.message
    });
  }
});

// GET /api/recommendations/category-analysis
router.get('/category-analysis', async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category parameter is required'
      });
    }

    // Get expenses for specific category from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const expenses = await prisma.expense.findMany({
      where: {
        user_id: userId,
        category: category,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalCategorySpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const averageTransactionAmount = expenses.length > 0 ? totalCategorySpending / expenses.length : 0;

    res.json({
      success: true,
      data: {
        category,
        totalSpending: parseFloat(totalCategorySpending.toFixed(2)),
        transactionCount: expenses.length,
        averageTransactionAmount: parseFloat(averageTransactionAmount.toFixed(2)),
        expenses: expenses.map(expense => ({
          id: expense.id,
          amount: Number(expense.amount),
          description: expense.description,
          createdAt: expense.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Error in category analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze category data',
      error: error.message
    });
  }
});

// GET /api/recommendations/savings-goals
router.get('/savings-goals', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's expenses from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const expenses = await prisma.expense.findMany({
      where: {
        user_id: userId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const totalSpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
    const averageDailySpending = totalSpending / 30;
    const estimatedMonthlySpending = totalSpending; // 30-day period represents monthly spending

    // Define common savings goals
    const savingsGoals = [
      {
        name: "Emergency Fund (3 months)",
        targetAmount: averageDailySpending * 90, // 3 months of expenses
        description: "Build an emergency fund to cover 3 months of expenses"
      },
      {
        name: "Vacation Fund",
        targetAmount: 50000, // ₹50,000
        description: "Save for a dream vacation"
      },
      {
        name: "New Gadget Fund",
        targetAmount: 25000, // ₹25,000
        description: "Save for the latest smartphone or laptop"
      },
      {
        name: "Home Down Payment",
        targetAmount: 500000, // ₹5,00,000
        description: "Save for a home down payment"
      }
    ];

    // Calculate achievable goals based on current spending
    const achievableGoals = savingsGoals.map(goal => {
      const monthlySavings = estimatedMonthlySpending * 0.10; // Assuming 10% savings from monthly spending
      const monthsToAchieve = Math.ceil(goal.targetAmount / monthlySavings);
      
      return {
        ...goal,
        targetAmount: parseFloat(goal.targetAmount.toFixed(2)),
        monthlySavings: parseFloat(monthlySavings.toFixed(2)),
        monthsToAchieve,
        isAchievable: monthsToAchieve <= 60 // Achievable within 5 years
      };
    });

    res.json({
      success: true,
      data: {
        currentMonthlySpending: parseFloat(estimatedMonthlySpending.toFixed(2)),
        achievableGoals
      }
    });

  } catch (error) {
    console.error('Error in savings goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate savings goals',
      error: error.message
    });
  }
});

// Helper function to calculate SIP investment projections
function calculateSIPProjections(savingsScenarios) {
  const sipProjections = [];
  
  // SIP assumptions
  const annualReturnRate = 0.12; // 12% annual return (conservative estimate)
  // Correct monthly rate calculation: (1 + annual_rate)^(1/12) - 1
  const monthlyReturnRate = Math.pow(1 + annualReturnRate, 1/12) - 1;
  
  savingsScenarios.forEach(scenario => {
    const monthlyInvestment = scenario.monthlySavings;
    
    // Calculate SIP returns for 5 and 10 years
    const projections = [
      {
        years: 5,
        months: 60,
        totalInvested: monthlyInvestment * 60,
        expectedValue: calculateSIPValue(monthlyInvestment, monthlyReturnRate, 60),
        description: `5-year SIP with ₹${monthlyInvestment.toFixed(0)}/month`
      },
      {
        years: 10,
        months: 120,
        totalInvested: monthlyInvestment * 120,
        expectedValue: calculateSIPValue(monthlyInvestment, monthlyReturnRate, 120),
        description: `10-year SIP with ₹${monthlyInvestment.toFixed(0)}/month`
      }
    ];
    
    sipProjections.push({
      reductionPercent: scenario.reductionPercent,
      monthlyInvestment: parseFloat(monthlyInvestment.toFixed(2)),
      projections: projections.map(proj => ({
        years: proj.years,
        totalInvested: parseFloat(proj.totalInvested.toFixed(2)),
        expectedValue: parseFloat(proj.expectedValue.toFixed(2)),
        profit: parseFloat((proj.expectedValue - proj.totalInvested).toFixed(2)),
        description: proj.description,
        returnPercentage: parseFloat((((proj.expectedValue - proj.totalInvested) / proj.totalInvested) * 100).toFixed(2))
      }))
    });
  });
  
  return sipProjections;
}

// Helper function to calculate SIP future value
function calculateSIPValue(monthlyInvestment, monthlyRate, months) {
  if (monthlyRate === 0) {
    return monthlyInvestment * months;
  }
  
  // Correct SIP formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
  // Where P = monthly investment, r = monthly rate, n = number of months
  // This formula accounts for the fact that SIP investments are made at the beginning of each month
  const futureValue = monthlyInvestment * 
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  
  return futureValue;
}

module.exports = router;