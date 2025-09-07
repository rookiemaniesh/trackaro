"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, CheckCircle, AlertCircle, DollarSign, Calendar } from "lucide-react";

interface SavingsGoalsCardProps {
  data: {
    currentSpending: {
      monthlyAverage: number;
      totalSpent: number;
    };
    savingsGoals: Array<{
      type: string;
      reductionPercent?: number;
      monthlySavings?: number;
      yearlySavings?: number;
      description?: string;
      targetAmount?: number;
      timeframe?: number;
      monthlySavingsNeeded?: number;
      achievable?: boolean;
      recommendations?: Array<{
        category: string;
        currentSpending: number;
        potentialSavings: number;
        action: string;
      }>;
    }>;
  };
}

export function SavingsGoalsCard({ data }: SavingsGoalsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Savings Goals</h2>
            <p className="text-indigo-100 text-sm">Set and track your financial objectives</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Current Spending Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
            Current Spending Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Monthly Average</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(data.currentSpending.monthlyAverage)}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Spent (3 months)</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {formatCurrency(data.currentSpending.totalSpent)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Savings Goals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-500" />
            Recommended Savings Goals
          </h3>
          <div className="space-y-4">
            {data.savingsGoals.map((goal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  goal.type === 'target_based'
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                {goal.type === 'target_based' ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                        <Target className="h-4 w-4 mr-2 text-indigo-500" />
                        Target-Based Goal
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        goal.achievable
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      }`}>
                        {goal.achievable ? 'Achievable' : 'Challenging'}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Target Amount</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(goal.targetAmount || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Timeframe</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {goal.timeframe} months
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings Needed</p>
                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(goal.monthlySavingsNeeded || 0)}
                        </p>
                      </div>
                    </div>
                    {goal.recommendations && goal.recommendations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Action Plan:</h5>
                        <div className="space-y-2">
                          {goal.recommendations.map((rec, recIndex) => (
                            <div key={recIndex} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{rec.action}</span>
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                Save {formatCurrency(rec.potentialSavings)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        {goal.reductionPercent}% Reduction Goal
                      </h4>
                      <div className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-medium">
                        Recommended
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(goal.monthlySavings || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Yearly Savings</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(goal.yearlySavings || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-indigo-500" />
            Goal Achievement Tips
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Start with smaller, achievable goals and gradually increase them</li>
            <li>• Automate your savings by setting up recurring transfers</li>
            <li>• Track your progress weekly to stay motivated</li>
            <li>• Celebrate small milestones to maintain momentum</li>
            <li>• Review and adjust your goals monthly based on your financial situation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
