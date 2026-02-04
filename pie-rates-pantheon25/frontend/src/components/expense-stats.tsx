"use client";

import { useState, useEffect } from "react";
import { IconTrendingDown, IconTrendingUp, IconCurrencyRupee } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";

interface ExpenseStats {
  totalSpending: number;
  monthlySpending: number;
  totalExpenses: number;
  monthlyGrowth: number;
  topCategory: {
    category: string;
    amount: number;
  };
}

export function ExpenseStats() {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenseStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchExpenseStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch expenses from the backend
      const response = await api.get<{
        success: boolean;
        data: {
          expenses: Array<{
            id: string;
            amount: number | string;
            category: string;
            date: string;
            paymentMethod: string;
            description: string;
          }>;
        };
      }>("/api/expenses");

      if (response.success && response.data) {
        const expenses = response.data.expenses;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate total spending (convert Decimal to number)
        const totalSpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

        // Calculate monthly spending (current month)
        const monthlyExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        const monthlySpending = monthlyExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

       

        // Calculate growth (simplified - comparing with previous periods)
        const previousMonthExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear;
        });
        const previousMonthSpending = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
        const monthlyGrowth = previousMonthSpending > 0 
          ? ((monthlySpending - previousMonthSpending) / previousMonthSpending) * 100 
          : 0;


        // Calculate top spending category
        const categorySpending: { [key: string]: number } = {};
        expenses.forEach(expense => {
          const category = expense.category || 'Other';
          categorySpending[category] = (categorySpending[category] || 0) + Number(expense.amount);
        });
        const topCategory = Object.entries(categorySpending)
          .sort(([,a], [,b]) => b - a)[0] || ['Other', 0];

       
      

        setStats({
          totalSpending,
          monthlySpending,
          totalExpenses: expenses.length,
          monthlyGrowth,
          topCategory: {
            category: topCategory[0],
            amount: topCategory[1],
          },
        });
      }
    } catch (error) {
      console.error("Error fetching expense stats:", error);
      setError("Failed to load expense statistics");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Please log in to view your expense statistics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-red-500">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return {
      value: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
      icon: isPositive ? IconTrendingUp : IconTrendingDown,
      variant: isPositive ? 'default' : 'destructive' as const,
    };
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-3 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Total Spending</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums flex items-center gap-1">
            <IconCurrencyRupee className="h-4 w-4" />
            {formatCurrency(stats.totalSpending)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs px-2 py-1">
              <IconCurrencyRupee className="h-3 w-3" />
              All Time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total expenses: {stats.totalExpenses}
          </div>
          <div className="text-muted-foreground">
            Lifetime spending overview
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">This Month</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums flex items-center gap-1">
            <IconCurrencyRupee className="h-4 w-4" />
            {formatCurrency(stats.monthlySpending)}
          </CardTitle>
          <CardAction>
            <Badge variant={formatGrowth(stats.monthlyGrowth).variant} className="text-xs px-2 py-1">
              {formatGrowth(stats.monthlyGrowth).value}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.monthlyGrowth >= 0 ? 'Increased' : 'Decreased'} this month
            {stats.monthlyGrowth >= 0 ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />}
          </div>
          <div className="text-muted-foreground">
            Compared to last month
          </div>
        </CardFooter>
      </Card>

      

      {/* Additional Statistics Cards */}
      <Card className="@container/card">
        <CardHeader className="pb-2">
          <CardDescription className="text-xs">Top Category</CardDescription>
          <CardTitle className="text-lg font-semibold tabular-nums flex items-center gap-1">
            <IconCurrencyRupee className="h-4 w-4" />
            {formatCurrency(stats.topCategory.amount)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs px-2 py-1">
              {stats.topCategory.category}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-0">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Most spent on {stats.topCategory.category}
          </div>
          <div className="text-muted-foreground">
            Your highest spending category
          </div>
        </CardFooter>
      </Card>

    

    </div>
  );
}
