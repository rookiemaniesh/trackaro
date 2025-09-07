"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChatSidebar from "@/components/ChatSidebar";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";
import { SpendingAnalysisCard } from "@/components/recommendations/SpendingAnalysisCard";
import { SavingsSuggestionsCard } from "@/components/recommendations/SavingsSuggestionsCard";
import { CategoryAnalysisCard } from "@/components/recommendations/CategoryAnalysisCard";
import { SavingsGoalsCard } from "@/components/recommendations/SavingsGoalsCard";

interface SpendingAnalysis {
  period: {
    type: string;
    startDate: string;
    endDate: string;
    days: number;
  };
  summary: {
    totalSpent: number;
    expenseCount: number;
    averageDailySpending: number;
    spendingTrend: number;
  };
  categoryBreakdown: Array<{
    category: string;
    total: number;
    count: number;
    averagePerExpense: number;
    percentageOfTotal: number;
  }>;
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
}

interface CategoryAnalysis {
  category: string;
  period: {
    type: string;
    startDate: string;
    endDate: string;
  };
  summary: {
    totalSpent: number;
    expenseCount: number;
    averagePerExpense: number;
  };
  subcategoryBreakdown: Array<{
    subcategory: string;
    total: number;
    count: number;
    averagePerExpense: number;
    percentageOfTotal: number;
  }>;
  recommendations: string[];
  expenses: Array<{
    id: string;
    amount: number;
    category: string;
    subcategory: string;
    date: string;
    description: string;
    paymentMethod: string;
  }>;
}

interface SavingsGoals {
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
}

export default function RecommendationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [spendingAnalysis, setSpendingAnalysis] = useState<SpendingAnalysis | null>(null);
  const [categoryAnalysis, setCategoryAnalysis] = useState<CategoryAnalysis | null>(null);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { get } = useApi();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Fetch spending analysis
  const fetchSpendingAnalysis = async () => {
    try {
      const response = await get(`/api/recommendations/spending-analysis?period=${selectedPeriod}&categories=food,entertainment`);
      setSpendingAnalysis(response.data);
    } catch (err: any) {
      console.error("Error fetching spending analysis:", err);
      if (err.message === "Not authenticated") {
        setError("Please log in to view recommendations");
      } else {
        setError(err.message || "Failed to fetch spending analysis");
      }
    }
  };

  // Fetch category analysis
  const fetchCategoryAnalysis = async () => {
    try {
      const response = await get(`/api/recommendations/category-analysis/${selectedCategory}?period=${selectedPeriod}`);
      setCategoryAnalysis(response.data);
    } catch (err: any) {
      console.error("Error fetching category analysis:", err);
      if (err.message === "Not authenticated") {
        setError("Please log in to view recommendations");
      } else {
        setError(err.message || "Failed to fetch category analysis");
      }
    }
  };

  // Fetch savings goals
  const fetchSavingsGoals = async () => {
    try {
      const response = await get("/api/recommendations/savings-goals");
      setSavingsGoals(response.data);
    } catch (err: any) {
      console.error("Error fetching savings goals:", err);
      if (err.message === "Not authenticated") {
        setError("Please log in to view recommendations");
      } else {
        setError(err.message || "Failed to fetch savings goals");
      }
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load all data only when authenticated
  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchSpendingAnalysis(),
          fetchCategoryAnalysis(),
          fetchSavingsGoals()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, authLoading, selectedPeriod, selectedCategory]);

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <ChatSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentPath="/recommendations"
      />
      
      {/* Main content area */}
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen ? "200px" : "45px",
        }}
      >
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Smart Recommendations
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Get personalized insights to optimize your spending and save more
              </p>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Period:
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      Promise.all([
                        fetchSpendingAnalysis(),
                        fetchCategoryAnalysis(),
                        fetchSavingsGoals()
                      ]).finally(() => setLoading(false));
                    }}
                    className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Spending Analysis Card */}
                {spendingAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SpendingAnalysisCard data={spendingAnalysis} />
                  </motion.div>
                )}

                {/* Savings Suggestions Card */}
                {spendingAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <SavingsSuggestionsCard 
                      savingsScenarios={spendingAnalysis.savingsScenarios}
                      recommendations={spendingAnalysis.recommendations}
                    />
                  </motion.div>
                )}

                {/* Category Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Selector */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Analyze Category:
                      </label>
                      <div className="flex space-x-2">
                        {['food', 'entertainment'].map((category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              selectedCategory === category
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category Analysis Card */}
                  {categoryAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <CategoryAnalysisCard data={categoryAnalysis} />
                    </motion.div>
                  )}

                  {/* Savings Goals Card */}
                  {savingsGoals && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <SavingsGoalsCard data={savingsGoals} />
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
