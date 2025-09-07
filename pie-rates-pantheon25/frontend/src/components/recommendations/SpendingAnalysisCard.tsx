"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Calendar, PieChart } from "lucide-react";

interface SpendingAnalysisCardProps {
  data: {
    totalSpending: number;
    estimatedMonthlySpending: number;
    averageDailySpending: number;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    sipProjections: Array<{
      reductionPercent: number;
      monthlyInvestment: number;
      projections: Array<{
        years: number;
        totalInvested: number;
        expectedValue: number;
        profit: number;
        description: string;
        returnPercentage: number;
      }>;
    }>;
  };
}

export function SpendingAnalysisCard({ data }: SpendingAnalysisCardProps) {
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
      month: 'short',
      year: 'numeric'
    });
  };

  const getPeriodLabel = (type: string) => {
    switch (type) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Spending Analysis</h2>
              <p className="text-blue-100 text-sm">{getPeriodLabel(data.period?.type || '30d')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-sm">Period</p>
            <p className="text-blue-100 text-sm">
              {formatDate(data.period?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())} - {formatDate(data.period?.endDate || new Date().toISOString())}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">Monthly Spending</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(data.estimatedMonthlySpending)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
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
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Daily Average</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {formatCurrency(data.averageDailySpending)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {data.categoryBreakdown?.length || 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{data.categoryBreakdown?.length || 0}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={`p-4 rounded-lg border ${
              (data.spendingTrend || 0) >= 0
                ? 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700'
                : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  (data.spendingTrend || 0) >= 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  Trend
                </p>
                <p className={`text-2xl font-bold ${
                  (data.spendingTrend || 0) >= 0
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-green-700 dark:text-green-300'
                }`}>
                  {(data.spendingTrend || 0) >= 0 ? '+' : ''}{(data.spendingTrend || 0).toFixed(1)}%
                </p>
              </div>
              {(data.spendingTrend || 0) >= 0 ? (
                <TrendingUp className="h-8 w-8 text-red-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-green-500" />
              )}
            </div>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {data.categoryBreakdown.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {category.category}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.amount ? '1' : '0'} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SIP Investment Projections */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            SIP Investment Projections
          </h3>
          <div className="space-y-4">
            {data.sipProjections.map((sip, index) => (
              <motion.div
                key={sip.reductionPercent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {sip.reductionPercent}% Reduction Scenario
                  </h4>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Invest ₹{sip.monthlyInvestment.toFixed(0)}/month
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sip.projections.map((projection, projIndex) => (
                    <motion.div
                      key={projection.years}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index * 0.1) + (projIndex * 0.05) }}
                      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700"
                    >
                      <div className="text-center">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {projection.years} Year SIP
                        </h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Total Invested:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(projection.totalInvested)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Expected Value:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(projection.expectedValue)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Profit:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(projection.profit)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Return:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {projection.returnPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                  💡 <strong>Note:</strong> SIP returns are calculated at 12% annual return (conservative estimate). 
                  Past performance doesn't guarantee future returns.
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
