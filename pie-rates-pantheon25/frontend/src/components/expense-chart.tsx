"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

interface Expense {
  id: string;
  amount: number | string;
  category: string;
  date: string;
  paymentMethod: string;
}

interface ChartData {
  date: string;
  amount: number;
  formattedDate: string;
}

export function ExpenseChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("7d");
  const [category, setCategory] = useState("all");
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenseData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, timeRange, category]);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<{
        success: boolean;
        data: {
          expenses: Expense[];
        };
      }>("/api/expenses");

      if (response.success && response.data) {
        const expenses = response.data.expenses;
        const processedData = processExpenseData(expenses, timeRange, category);
        setChartData(processedData);
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
      setError("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  };

  const processExpenseData = (expenses: Expense[], range: string, cat: string) => {
    const now = new Date();
    let startDate: Date;
    
    // Calculate start date based on range
    switch (range) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Filter expenses by date range and category
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const categoryMatch = cat === "all" || expense.category.toLowerCase() === cat.toLowerCase();
      return expenseDate >= startDate && categoryMatch;
    });

    // Group expenses by date (convert Decimal to number)
    const groupedData: { [key: string]: number } = {};
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      groupedData[date] = (groupedData[date] || 0) + Number(expense.amount);
    });

    // Create chart data array
    const chartDataArray: ChartData[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const amount = groupedData[dateStr] || 0;
      
      chartDataArray.push({
        date: dateStr,
        amount: amount,
        formattedDate: currentDate.toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
        }),
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartDataArray;
  };

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const totalSpending = chartData.reduce((sum, item) => sum + item.amount, 0);
  const averageSpending = chartData.length > 0 ? totalSpending / chartData.length : 0;
  const maxSpending = Math.max(...chartData.map(item => item.amount), 0);
  const minSpending = Math.min(...chartData.map(item => item.amount), 0);

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
          <CardDescription>Please log in to view your expense trends</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
          <CardDescription>Loading your expense data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <CardTitle>Expense Trends</CardTitle>
            <CardDescription>
              Your spending patterns over time
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            className="grid w-full grid-cols-2 lg:w-auto"
          >
            <ToggleGroupItem value="amount" aria-label="Toggle amount">
              Amount
            </ToggleGroupItem>
            <ToggleGroupItem value="trend" aria-label="Toggle trend">
              Trend
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-500 mb-2">No expense data found</div>
              <div className="text-sm text-gray-400">
                Add some expenses to see your spending trends
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  ₹{totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Average</p>
                <p className="text-2xl font-bold">
                  ₹{averageSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Highest</p>
                <p className="text-2xl font-bold">
                  ₹{maxSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Lowest</p>
                <p className="text-2xl font-bold">
                  ₹{minSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Area
                  dataKey="amount"
                  type="natural"
                  fill="var(--color-amount)"
                  fillOpacity={0.4}
                  stroke="var(--color-amount)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
