"use client";

import { useState } from "react";
import { ExpenseChart } from "@/components/expense-chart"
import { ExpenseStats } from "@/components/expense-stats"
import { ExpenseHistory } from "@/components/expense-history"
import { PaymentMethodsChart } from "@/components/payment-methods-chart"
import { CategoryTrendsChart } from "@/components/category-trends-chart"
import ChatSidebar from "@/components/ChatSidebar"

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
      <ChatSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentPath="/dashboard"
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your expenses and spending patterns
          </p>
        </div>

        {/* Dashboard content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ExpenseStats />
            
            {/* Charts Section */}
            <div className="px-4 lg:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentMethodsChart />
                <CategoryTrendsChart />
              </div>
            </div>
            
            <div className="px-4 lg:px-6">
              <ExpenseChart />
            </div>
            <ExpenseHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
