"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, CreditCard, Calendar, AlertCircle } from "lucide-react";

interface CategoryAnalysisCardProps {
  data: {
    category: string;
    totalSpending: number;
    transactionCount: number;
    averageTransactionAmount: number;
    expenses: Array<{
      id: string;
      amount: number;
      description: string;
      createdAt: string;
    }>;
  };
}

export function CategoryAnalysisCard({ data }: CategoryAnalysisCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'upi':
        return <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">U</span>
        </div>;
      case 'cash':
        return <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">₹</span>
        </div>;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white capitalize">
              {data.category} Analysis
            </h2>
            <p className="text-purple-100 text-sm">
              Detailed breakdown of your {data.category} spending
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {formatCurrency(data.totalSpending)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {data.transactionCount}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Avg per Transaction</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(data.averageTransactionAmount)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">₹</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subcategory Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subcategory Breakdown</h3>
          <div className="space-y-3">
            {(data.subcategoryBreakdown || []).map((subcategory, index) => (
              <motion.div
                key={subcategory.subcategory}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {subcategory.subcategory}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(subcategory.total)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {subcategory.percentageOfTotal.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{subcategory.count} transactions</span>
                  <span>Avg: {formatCurrency(subcategory.averagePerExpense)}</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subcategory.percentageOfTotal}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
            Recommendations for {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
          </h3>
          <div className="space-y-2">
            {(data.recommendations || []).map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Expenses */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent {data.category.charAt(0).toUpperCase() + data.category.slice(1)} Expenses</h3>
          <div className="space-y-2">
            {(data.expenses || []).slice(0, 5).map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getPaymentMethodIcon(expense.paymentMethod)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {expense.subcategory} • {formatDate(expense.date)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(expense.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
