"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Types for our expense data
type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  participants: string[];
};

type CategorySummary = {
  category: string;
  total: number;
  percentage: number;
};



export default function UserProfile() {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  
  // State for profile data and dashboard data
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | undefined>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  // Dashboard data
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categorySummary, setCategorySummary] = useState<CategorySummary[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage(user.profilePicture);
    }
  }, [user]);
  
  // Load mock expense data when component mounts
  useEffect(() => {
    const loadMockData = () => {
      try {
        setLoadingData(true);
        
        // Mock expense data for demonstration
        const mockExpenses: Expense[] = [
          {
            id: 1,
            amount: 2500,
            category: "Food & Dining",
            description: "Dinner at restaurant",
            date: "2024-01-15",
            participants: ["You", "John"]
          },
          {
            id: 2,
            amount: 1200,
            category: "Transportation",
            description: "Uber rides",
            date: "2024-01-14",
            participants: ["You"]
          },
          {
            id: 3,
            amount: 800,
            category: "Entertainment",
            description: "Movie tickets",
            date: "2024-01-13",
            participants: ["You", "Sarah", "Mike"]
          },
          {
            id: 4,
            amount: 3500,
            category: "Shopping",
            description: "Grocery shopping",
            date: "2024-01-12",
            participants: ["You"]
          },
          {
            id: 5,
            amount: 1500,
            category: "Food & Dining",
            description: "Lunch with colleagues",
            date: "2024-01-11",
            participants: ["You", "Alex", "Emma"]
          }
        ];
        
        setExpenses(mockExpenses);
        
        // Set recent expenses (last 5)
        setRecentExpenses(mockExpenses.slice(0, 5));
        
        // Calculate total spent
        const total = mockExpenses.reduce(
          (sum: number, expense: Expense) => sum + expense.amount, 
          0
        );
        setTotalSpent(total);
        
        // Calculate category summary
        const categories: Record<string, number> = {};
        
        // Sum up by category
        mockExpenses.forEach((expense: Expense) => {
          categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        });
        
        // Convert to array and calculate percentages
        const summaryArray = Object.entries(categories).map(([category, catTotal]) => ({
          category,
          total: catTotal,
          percentage: total > 0 ? Math.round((catTotal / total) * 100) : 0
        }));
        
        // Sort by total (descending)
        summaryArray.sort((a, b) => b.total - a.total);
        
        setCategorySummary(summaryArray);
      } catch (err) {
        console.error("Failed to load mock data:", err);
      } finally {
        setLoadingData(false);
      }
    };
    
    if (user) {
      loadMockData();
    }
  }, [user]);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    try {
      setSaving(true);
      await updateProfile({
        name,
        email,
        profilePicture: profileImage
      });
      setEditMode(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trackaro-accent"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Please log in to view your profile</h2>
        <Link href="/auth/login" className="text-trackaro-accent hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="text-trackaro-text dark:text-on-dark w-full p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-trackaro-card dark:bg-trackaro-card rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-trackaro-accent/10 border-2 border-trackaro-accent flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-16 h-16 text-trackaro-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-trackaro-border bg-trackaro-bg dark:bg-trackaro-bg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-trackaro-border bg-trackaro-bg dark:bg-trackaro-bg"
                      disabled
                    />
                    <p className="text-xs text-trackaro-accent mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile Image URL</label>
                    <input
                      type="text"
                      value={profileImage || ""}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                      className="w-full px-4 py-2 rounded-lg border border-trackaro-border bg-trackaro-bg dark:bg-trackaro-bg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-trackaro-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{user.name}</h1>
                      <p className="text-trackaro-accent">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-1 bg-trackaro-bg dark:bg-trackaro-bg border border-trackaro-border rounded-lg text-sm hover:bg-trackaro-accent hover:text-white transition-all"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-3 rounded-lg">
                      <p className="text-sm text-trackaro-accent">Account ID</p>
                      <p className="font-medium">{user.id}</p>
                    </div>
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-3 rounded-lg">
                      <p className="text-sm text-trackaro-accent">Member Since</p>
                      <p className="font-medium">September 2025</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-trackaro-border">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "overview"
                  ? "border-b-2 border-trackaro-accent text-trackaro-accent"
                  : "text-trackaro-text dark:text-on-dark hover:text-trackaro-accent"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "expenses"
                  ? "border-b-2 border-trackaro-accent text-trackaro-accent"
                  : "text-trackaro-text dark:text-on-dark hover:text-trackaro-accent"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "analytics"
                  ? "border-b-2 border-trackaro-accent text-trackaro-accent"
                  : "text-trackaro-text dark:text-on-dark hover:text-trackaro-accent"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "settings"
                  ? "border-b-2 border-trackaro-accent text-trackaro-accent"
                  : "text-trackaro-text dark:text-on-dark hover:text-trackaro-accent"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
        
        {/* Dashboard Content */}
        <div className="bg-trackaro-card dark:bg-trackaro-card rounded-xl p-6 shadow-lg min-h-[400px]">
          {loadingData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trackaro-accent"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg shadow">
                      <p className="text-sm text-trackaro-accent mb-1">Total Expenses</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(totalSpent)}</h3>
                    </div>
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg shadow">
                      <p className="text-sm text-trackaro-accent mb-1">Expense Count</p>
                      <h3 className="text-2xl font-bold">{expenses.length}</h3>
                    </div>
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg shadow">
                      <p className="text-sm text-trackaro-accent mb-1">Top Category</p>
                      <h3 className="text-2xl font-bold">
                        {categorySummary.length > 0 ? categorySummary[0].category : "N/A"}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Recent Expenses & Category Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
                      {recentExpenses.length === 0 ? (
                        <p className="text-trackaro-accent p-4 bg-trackaro-bg dark:bg-trackaro-bg rounded-lg">
                          No recent expenses found.
                        </p>
                      ) : (
                        <div className="bg-trackaro-bg dark:bg-trackaro-bg rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-trackaro-border">
                            <thead className="bg-trackaro-bg/50 dark:bg-trackaro-bg/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                                  Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                                  Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-trackaro-border">
                              {recentExpenses.map((expense) => (
                                <tr key={expense.id}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {formatDate(expense.date)}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {expense.description}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {expense.category}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                    {formatCurrency(expense.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                      {categorySummary.length === 0 ? (
                        <p className="text-trackaro-accent p-4 bg-trackaro-bg dark:bg-trackaro-bg rounded-lg">
                          No category data available.
                        </p>
                      ) : (
                        <div className="bg-trackaro-bg dark:bg-trackaro-bg rounded-lg p-4">
                          {categorySummary.map((category) => (
                            <div key={category.category} className="mb-3">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{category.category}</span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(category.total)} ({category.percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-trackaro-card dark:bg-trackaro-card rounded-full h-2.5">
                                <div
                                  className="bg-trackaro-accent h-2.5 rounded-full"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Expenses Tab */}
              {activeTab === "expenses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">All Expenses</h2>
                    <Link 
                      href="/chat" 
                      className="px-4 py-2 bg-trackaro-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
                    >
                      Add New Expense
                    </Link>
                  </div>
                  
                  {expenses.length === 0 ? (
                    <div className="text-center p-8 bg-trackaro-bg dark:bg-trackaro-bg rounded-lg">
                      <p className="text-trackaro-accent mb-4">You haven't recorded any expenses yet.</p>
                      <Link 
                        href="/chat" 
                        className="px-4 py-2 bg-trackaro-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
                      >
                        Start Tracking Expenses
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-trackaro-border">
                        <thead className="bg-trackaro-bg/50 dark:bg-trackaro-bg/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                              Participants
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-trackaro-accent uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-trackaro-border">
                          {expenses.map((expense) => (
                            <tr key={expense.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {formatDate(expense.date)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {expense.description}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {expense.category}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {expense.participants?.join(", ") || "Just you"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                {formatCurrency(expense.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Expense Analytics</h2>
                  
                  {expenses.length === 0 ? (
                    <div className="text-center p-8 bg-trackaro-bg dark:bg-trackaro-bg rounded-lg">
                      <p className="text-trackaro-accent">Record some expenses to see analytics.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Category Distribution */}
                      <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
                        <div className="space-y-4">
                          {categorySummary.map((category) => (
                            <div key={category.category} className="mb-3">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{category.category}</span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(category.total)}
                                </span>
                              </div>
                              <div className="w-full bg-trackaro-card dark:bg-trackaro-card rounded-full h-2.5">
                                <div
                                  className="bg-trackaro-accent h-2.5 rounded-full"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-trackaro-accent text-right mt-1">
                                {category.percentage}% of total
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Spending Insights */}
                      <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Spending Insights</h3>
                        <div className="space-y-4">
                          <div className="p-3 border border-trackaro-border rounded-lg">
                            <p className="text-sm font-medium">Highest Expense</p>
                            <p className="text-xl font-bold">
                              {formatCurrency(
                                Math.max(...expenses.map((e) => e.amount))
                              )}
                            </p>
                            <p className="text-xs text-trackaro-accent">
                              {expenses.find(
                                (e) => e.amount === Math.max(...expenses.map((ex) => ex.amount))
                              )?.description || ""}
                            </p>
                          </div>
                          
                          <div className="p-3 border border-trackaro-border rounded-lg">
                            <p className="text-sm font-medium">Average Expense</p>
                            <p className="text-xl font-bold">
                              {formatCurrency(
                                totalSpent / expenses.length
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 border border-trackaro-border rounded-lg">
                            <p className="text-sm font-medium">Most Common Category</p>
                            <p className="text-xl font-bold">
                              {(() => {
                                const counts: Record<string, number> = {};
                                expenses.forEach((e) => {
                                  counts[e.category] = (counts[e.category] || 0) + 1;
                                });
                                const entries = Object.entries(counts);
                                if (entries.length === 0) return "N/A";
                                
                                entries.sort((a, b) => b[1] - a[1]);
                                return entries[0][0];
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
                      <p className="text-sm text-trackaro-accent mb-4">
                        Update your account information and how your profile appears.
                      </p>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-trackaro-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
                      >
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Password</h3>
                      <p className="text-sm text-trackaro-accent mb-4">
                        Change your password to keep your account secure.
                      </p>
                      <button
                        className="px-4 py-2 bg-trackaro-accent text-white rounded-lg hover:bg-opacity-90 transition-all"
                        onClick={() => alert("Password change functionality will be implemented soon.")}
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                      <p className="text-sm text-trackaro-accent mb-4">
                        Configure how and when you receive notifications.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Email Notifications</label>
                          <input type="checkbox" className="toggle toggle-accent" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Weekly Expense Summary</label>
                          <input type="checkbox" className="toggle toggle-accent" checked />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Large Expense Alerts</label>
                          <input type="checkbox" className="toggle toggle-accent" checked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-trackaro-bg dark:bg-trackaro-bg p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
                      <p className="text-sm text-trackaro-accent mb-4">
                        Permanently delete your account and all associated data.
                      </p>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                            alert("Account deletion functionality will be implemented soon.");
                          }
                        }}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
