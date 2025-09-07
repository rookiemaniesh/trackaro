"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, Info, Lightbulb, DollarSign } from "lucide-react";

interface SavingsSuggestionsCardProps {
  savingsScenarios: Array<{
    reductionPercent: number;
    monthlySavings: number;
    yearlySavings: number;
    newMonthlySpending: number;
    savingsDescription: string;
  }>;
  recommendations: Array<{
    type: string;
    category: string;
    message: string;
    potentialSavings: number;
  }>;
}

export function SavingsSuggestionsCard({ savingsScenarios, recommendations }: SavingsSuggestionsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20';
      case 'suggestion':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      case 'info':
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Savings Suggestions</h2>
            <p className="text-green-100 text-sm">Optimize your spending with these recommendations</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Savings Scenarios */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Potential Savings Scenarios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {savingsScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.reductionPercent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  scenario.reductionPercent === 5
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : scenario.reductionPercent === 10
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                    scenario.reductionPercent === 5
                      ? 'bg-green-500'
                      : scenario.reductionPercent === 10
                      ? 'bg-blue-500'
                      : 'bg-purple-500'
                  }`}>
                    <span className="text-white font-bold text-lg">{scenario.reductionPercent}%</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {scenario.reductionPercent}% Reduction
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Savings:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(scenario.monthlySavings)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Yearly Savings:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(scenario.yearlySavings)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">New Spending:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(scenario.newMonthlySpending)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                    {scenario.savingsDescription}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Smart Recommendations
          </h3>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getRecommendationColor(recommendation.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(recommendation.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {recommendation.category} Spending
                      </h4>
                      {recommendation.potentialSavings > 0 && (
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Save {formatCurrency(recommendation.potentialSavings)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendation.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SIP Investment Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            SIP Investment Benefits
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• <strong>Compound Growth:</strong> Your savings can grow significantly over 5-10 years</li>
            <li>• <strong>Discipline:</strong> Automatic monthly investments build financial discipline</li>
            <li>• <strong>Rupee Cost Averaging:</strong> Reduces impact of market volatility</li>
            <li>• <strong>Tax Benefits:</strong> ELSS SIPs offer tax deductions under Section 80C</li>
            <li>• <strong>Long-term Wealth:</strong> Start early to maximize compound returns</li>
          </ul>
        </div>

        {/* Action Tips */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
            Quick Action Tips
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Set monthly spending limits for discretionary categories</li>
            <li>• Use the 24-hour rule before making non-essential purchases</li>
            <li>• Track your expenses daily to stay aware of spending patterns</li>
            <li>• Look for free alternatives to paid entertainment options</li>
            <li>• Plan meals weekly to reduce food waste and impulse purchases</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
