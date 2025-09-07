"use client";

import { useState, useEffect } from "react";
import { IconCurrencyRupee, IconCalendar, IconTag, IconCreditCard, IconFileText } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";

interface Expense {
  id: string;
  amount: number | string;
  category: string;
  subcategory?: string;
  companions: string[];
  date: string;
  paymentMethod: string;
  description?: string;
  createdAt: string;
}

export function ExpenseHistory() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const api = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch expenses from the backend
      const response = await api.get<{
        success: boolean;
        data: {
          expenses: Expense[];
        };
      }>("/api/expenses");

      if (response.success && response.data) {
        // Sort expenses by date (newest first)
        const sortedExpenses = response.data.expenses.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setExpenses(sortedExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expense history");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = Number(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'upi':
        return '💳';
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'netbanking':
        return '🏦';
      default:
        return '💳';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'food': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'transport': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'shopping': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'health': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'utilities': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[category.toLowerCase()] || colors['other'];
  };

  if (!isAuthenticated) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>Please log in to view your expense history</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>Loading your expense records...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-4 lg:mx-6">
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconFileText className="h-5 w-5" />
          Expense History
        </CardTitle>
        <CardDescription>
          Your recent expense records ({expenses.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentExpenses.length === 0 ? (
          <div className="text-center py-8">
            <IconFileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No expenses found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start adding expenses through the chat to see them here
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <IconCalendar className="h-4 w-4 text-gray-400" />
                          {formatDate(expense.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {expense.description || expense.category}
                        </div>
                        {expense.companions.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            With: {expense.companions.join(', ')}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(expense.category)}>
                          <IconTag className="h-3 w-3 mr-1" />
                          {expense.category}
                        </Badge>
                        {expense.subcategory && (
                          <div className="text-xs text-gray-500 mt-1">
                            {expense.subcategory}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPaymentMethodIcon(expense.paymentMethod)}</span>
                          <span className="capitalize">{expense.paymentMethod}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <IconCurrencyRupee className="h-4 w-4" />
                          {formatCurrency(expense.amount)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, expenses.length)} of {expenses.length} expenses
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
