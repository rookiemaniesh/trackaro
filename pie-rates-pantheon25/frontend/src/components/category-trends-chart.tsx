"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/app/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Expense {
  id: string;
  amount: number | string;
  category: string;
  subcategory: string;
  companions: string[];
  date: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
}

interface CategoryTrendData {
  date: string;
  [key: string]: string | number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export function CategoryTrendsChart() {
  const [data, setData] = useState<CategoryTrendData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchCategoryTrendData();
  }, [isAuthenticated]);

  const fetchCategoryTrendData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Category Trends Chart - Starting fetch, isAuthenticated:', isAuthenticated);
      const response = await api.get<{ success: boolean; data: { expenses: Expense[] } }>('/api/expenses');
      console.log('Category Trends Chart - API Response:', response);
      const expenses = response.data?.expenses || [];
      console.log('Category Trends Chart - Expenses:', expenses);
      console.log('Category Trends Chart - Expenses length:', expenses.length);

      // Get the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      // Filter expenses from the last 30 days
      const recentExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });

      // Group expenses by date and category
      const dailySpending: { [date: string]: { [category: string]: number } } = {};
      const allCategories = new Set<string>();

      recentExpenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const dateKey = expenseDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        const category = expense.category || 'Other';
        
        if (!dailySpending[dateKey]) {
          dailySpending[dateKey] = {};
        }
        
        dailySpending[dateKey][category] = (dailySpending[dateKey][category] || 0) + Number(expense.amount);
        allCategories.add(category);
      });

      // Convert to chart data format
      const chartData: CategoryTrendData[] = [];
      const sortedDates = Object.keys(dailySpending).sort();

      sortedDates.forEach(date => {
        const dayData: CategoryTrendData = { date };
        
        // Add all categories for this date
        Array.from(allCategories).forEach(category => {
          dayData[category] = dailySpending[date][category] || 0;
        });
        
        chartData.push(dayData);
      });

      // If no data, create empty data for the last 7 days
      if (chartData.length === 0) {
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateKey = date.toISOString().split('T')[0];
          const dayData: CategoryTrendData = { date: dateKey };
          Array.from(allCategories).forEach(category => {
            dayData[category] = 0;
          });
          chartData.push(dayData);
        }
      }

      setData(chartData);
      setCategories(Array.from(allCategories));
    } catch (error) {
      console.error('Error fetching category trend data:', error);
      setError(`Failed to load category trend data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
          <CardDescription>Daily spending trends by category (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="mb-2">Please log in to view category trend data</p>
              <p className="text-sm">Authentication required to access expense data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
          <CardDescription>Daily spending trends by category (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
          <CardDescription>Daily spending trends by category (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
          <CardDescription>Daily spending trends by category (Last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No category trend data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Category Trends</CardTitle>
        <CardDescription>Daily spending trends by category (Last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `₹${value}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
