"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
};

type TelegramStatus = {
  isLinked: boolean;
  hasActiveCode: boolean;
  linkCode: string | null;
  expiry: string | null;
  botUsername: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  getTelegramStatus: () => Promise<TelegramStatus>;
  generateTelegramCode: () => Promise<{ code: string; expiry: string; instructions: string }>;
  unlinkTelegram: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("accessToken");

      if (storedToken) {
        try {
          // Verify token and get user data
          const response = await fetch(`${API_URL}/api/profile`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
            setAccessToken(storedToken);
          } else {
            // If token is invalid or expired, try to refresh it
            await refreshToken();
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          handleLogout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Function to refresh the access token
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include", // Needed for cookies
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);

        // Get user data with new token
        await fetchUserData(data.accessToken);
        return true;
      } else {
        handleLogout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      handleLogout();
      return false;
    }
  };

  // Function to fetch user data
  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.data.user);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Fetch user data error:", error);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/local/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = "Login failed";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            message = errorData.message || message;
          } else {
            const text = await response.text();
            if (text) message = text;
          }
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      setUser(data.data.user);
      setAccessToken(data.data.token);
      localStorage.setItem("accessToken", data.data.token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let message = "Registration failed";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            message = errorData.message || message;
          } else {
            const text = await response.text();
            if (text) message = text;
          }
        } catch {}
        throw new Error(message);
      }

      const data = await response.json();
      setUser(data.data.user);
      setAccessToken(data.data.token);
      localStorage.setItem("accessToken", data.data.token);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (accessToken) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      handleLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we should still clear local state
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let message = "Profile update failed";
        try {
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            message = errorData.message || message;
          } else {
            const text = await response.text();
            if (text) message = text;
          }
        } catch {}
        throw new Error(message);
      }

      const responseData = await response.json();
      setUser((prev) => (prev ? { ...prev, ...responseData.data.user } : null));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create an axios interceptor-like function to handle token expiration
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    // Add authorization header
    const authOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(url, authOptions);

      // If unauthorized and the error is due to token expiration
      if (response.status === 401) {
        try {
          const contentType = response.headers.get("content-type") || "";
          const errorData = contentType.includes("application/json")
            ? await response.json()
            : null;
          // If token expired, try to refresh it
          if (errorData && errorData.code === "TOKEN_EXPIRED") {
            const refreshed = await refreshToken();
            // If token refresh was successful, retry the original request
            if (refreshed && accessToken) {
              return fetch(url, {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${accessToken}`,
                },
              });
            }
          }
        } catch {}
      }

      return response;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  // Telegram methods
  const getTelegramStatus = async (): Promise<TelegramStatus> => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    try {
      console.log("Attempting to fetch Telegram status from:", `${API_URL}/api/auth/telegram/status`);
      
      const response = await fetch(`${API_URL}/api/auth/telegram/status`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Telegram status response:", response.status, response.statusText);

      if (!response.ok) {
        let message = "Failed to get Telegram status";
        try {
          const contentType = response.headers.get("content-type") || "";
          console.log("Response content type:", contentType);
          if (contentType.includes("application/json")) {
            const errorData = await response.json();
            console.log("Error data:", errorData);
            message = errorData.message || errorData.error || message;
          } else {
            const text = await response.text();
            console.log("Response text:", text);
            if (text) message = text;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
        }
        
        // Provide more specific error messages
        if (response.status === 404) {
          message = "Telegram endpoint not found. Please make sure the backend server is running.";
        } else if (response.status === 401) {
          message = "Authentication failed. Please log in again.";
        } else if (response.status === 500) {
          message = "Server error. Please try again later.";
        }
        
        throw new Error(message);
      }

      const data = await response.json();
      console.log("Telegram status data:", data);
      return data.data;
    } catch (error) {
      console.error("Telegram status error:", error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Cannot connect to server. Please make sure the backend is running on port 5000.");
      }
      
      throw error;
    }
  };

  const generateTelegramCode = async (): Promise<{ code: string; expiry: string; instructions: string }> => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/api/auth/telegram/start`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let message = "Failed to generate Telegram code";
      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          message = errorData.message || message;
        }
      } catch {}
      throw new Error(message);
    }

    const data = await response.json();
    return data.data;
  };

  const unlinkTelegram = async (): Promise<void> => {
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/api/auth/telegram/unlink`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let message = "Failed to unlink Telegram";
      try {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          message = errorData.message || message;
        }
      } catch {}
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        register,
        logout,
        updateProfile,
        getTelegramStatus,
        generateTelegramCode,
        unlinkTelegram,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
