"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token and success status from URL parameters
        const token = searchParams.get("token");
        const success = searchParams.get("success");

        if (!token) {
          throw new Error("No authentication token received");
        }

        if (success !== "true") {
          throw new Error("Authentication was not successful");
        }

        // Decode the JWT token to get user information
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          throw new Error("Invalid token format");
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Validate token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          throw new Error("Token has expired");
        }

        // Store token in localStorage with the key expected by AuthContext
        localStorage.setItem("accessToken", token);

        setStatus("success");
        setMessage("Authentication successful! Redirecting...");

        // Force a page reload to trigger AuthContext initialization
        // This ensures the AuthContext picks up the new token and fetches user data
        setTimeout(() => {
          window.location.href = "/chat";
        }, 1500);

      } catch (error) {
        console.error("Auth callback error:", error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Authentication failed");
        
        // Redirect to login page after showing error
        setTimeout(() => {
          router.replace("/auth/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-trackaro-bg dark:bg-[#0f0f0f] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-trackaro-card rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            {status === "loading" && (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trackaro-accent mx-auto"></div>
            )}
            {status === "success" && (
              <div className="text-green-500 text-4xl mb-4">✅</div>
            )}
            {status === "error" && (
              <div className="text-red-500 text-4xl mb-4">❌</div>
            )}
          </div>
          
          <h1 className="text-xl font-semibold text-trackaro-text dark:text-white mb-2">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "Welcome!"}
            {status === "error" && "Authentication Failed"}
          </h1>
          
          <p className="text-sm text-trackaro-text/70 dark:text-white/70 mb-6">
            {message}
          </p>

          {status === "error" && (
            <div className="text-xs text-red-500 mb-4">
              You will be redirected to the login page shortly.
            </div>
          )}

          {status === "success" && (
            <div className="text-xs text-green-500 mb-4">
              Taking you to your dashboard...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
