import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [isloggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for animations
  // Navigation handler
  const handleStartChatting = useCallback(() => {
    if (!isloggedIn) {
      router.push("/auth/login");
    } else {
      router.push("/chat");
    }
  }, [isloggedIn, router]);

  // Initialize
  useEffect(() => {
    // Set loading state to false
    setIsLoading(false);
  }, []);



  return (
    <div className="min-h-screen bg-trackaro-bg ">
      {isLoading ? (
        // Loading skeleton
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-full mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-5/6 mb-8"></div>
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full mx-auto"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection onStartChatting={handleStartChatting} />



          {/* Features Section */}
          <FeatureSection />






          {/* Footer */}
          <footer
            className="py-4 bg-white"
            
          >
            <div className="container mx-auto px-6 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-md">
               made with ♡ by Pie-Rates
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;
