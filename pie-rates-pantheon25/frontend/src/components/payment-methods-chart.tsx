"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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

interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function PaymentMethodsChart() {
  const [data, setData] = useState<PaymentMethodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchPaymentMethodData();
  }, [isAuthenticated]);

  const fetchPaymentMethodData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Payment Methods Chart - Starting fetch, isAuthenticated:', isAuthenticated);
      const response = await api.get<{ success: boolean; data: { expenses: Expense[] } }>('/api/expenses');
      console.log('Payment Methods Chart - API Response:', response);
      const expenses = response.data?.expenses || [];
      console.log('Payment Methods Chart - Expenses:', expenses);
      console.log('Payment Methods Chart - Expenses length:', expenses.length);

      // Group expenses by payment method
      const paymentMethodSpending: { [key: string]: number } = {};
      expenses.forEach(expense => {
        const method = expense.paymentMethod || 'Unknown';
        paymentMethodSpending[method] = (paymentMethodSpending[method] || 0) + Number(expense.amount);
      });

      // Convert to chart data format
      const chartData = Object.entries(paymentMethodSpending)
        .map(([method, amount], index) => ({
          name: method.charAt(0).toUpperCase() + method.slice(1),
          value: amount,
          color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value);

      console.log('Payment Methods Chart - Chart data:', chartData);
      setData(chartData);
    } catch (error) {
      console.error('Error fetching payment method data:', error);
      setError(`Failed to load payment method data: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: {((data.value / data.payload?.total || 1) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
          <CardDescription>Spending breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="mb-2">Please log in to view payment method data</p>
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
          <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
          <CardDescription>Spending breakdown by payment method</CardDescription>
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
          <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
          <CardDescription>Spending breakdown by payment method</CardDescription>
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
          <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
          <CardDescription>Spending breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No payment method data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Methods</CardTitle>
        <CardDescription>Spending breakdown by payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value}: {formatCurrency(entry.payload?.value || 0)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total: {formatCurrency(totalAmount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
