"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatBox from "../../components/ChatBox";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

// Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramCode, setTelegramCode] = useState<string | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<{
    isLinked: boolean;
    hasActiveCode: boolean;
    linkCode: string | null;
    expiry: string | null;
    botUsername: string;
  } | null>(null);
  
  const router = useRouter();
  const { generateTelegramCode, getTelegramStatus, unlinkTelegram, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    router.push(path);
  };

  // Load Telegram status on component mount
  useEffect(() => {
    const loadTelegramStatus = async () => {
      try {
        // Only load status if user is authenticated
        if (isAuthenticated) {
          // First check if backend is accessible
          const healthCheck = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/health`);
          if (!healthCheck.ok) {
            throw new Error("Backend server is not accessible");
          }
          
          const status = await getTelegramStatus();
          setTelegramStatus(status);
        }
      } catch (error) {
        console.error("Failed to load Telegram status:", error);
        // Set default status if Telegram is not available
        setTelegramStatus({
          isLinked: false,
          hasActiveCode: false,
          linkCode: null,
          expiry: null,
          botUsername: 'your_bot'
        });
        
        // Show error in UI if it's a connection issue
        if (error instanceof Error && error.message.includes('connect to server')) {
          setTelegramError("Backend server is not running. Please start the backend server.");
        }
      }
    };

    loadTelegramStatus();
  }, [getTelegramStatus, isAuthenticated]);

  const handleTelegramConnect = async () => {
    if (!isAuthenticated) {
      setTelegramError("Please log in to connect Telegram");
      return;
    }

    setTelegramLoading(true);
    setTelegramError(null);
    
    try {
      const data = await generateTelegramCode();
      setTelegramCode(data.code);
      setShowTelegramModal(true);
      
      // Refresh status after generating code
      const status = await getTelegramStatus();
      setTelegramStatus(status);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Telegram connect error:", err);
      setTelegramError(msg || "Failed to generate Telegram code. Please make sure the backend server is running.");
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleTelegramUnlink = async () => {
    if (!isAuthenticated) {
      setTelegramError("Please log in to disconnect Telegram");
      return;
    }

    setTelegramLoading(true);
    setTelegramError(null);
    
    try {
      await unlinkTelegram();
      const status = await getTelegramStatus();
      setTelegramStatus(status);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTelegramError(msg || "Failed to unlink Telegram");
    } finally {
      setTelegramLoading(false);
    }
  };

  const copyTelegramCode = () => {
    if (telegramCode) {
      navigator.clipboard.writeText(telegramCode);
      // You could add a toast notification here
    }
  };

  const closeTelegramModal = () => {
    setShowTelegramModal(false);
    setTelegramCode(null);
    setTelegramError(null);
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col min-h-screen"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          className={`bg-secondary dark:bg-trackaro-bg border-r border-trackaro-border dark:border-trackaro-border`}
          animate={{ width: isSidebarOpen ? 200 : 45 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ willChange: "width" }}
        >
          <div className="flex flex-col h-full py-3">
            {/* Sidebar header with title and toggle */}
            <div className="px-3 mb-2 flex items-center justify-between">
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    key="brand"
                    className="text-sm text-center font-semibold tracking-wide text-trackaro-text dark:text-trackaro-text"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    Trackaro
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-trackaro-text dark:text-trackaro-text"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                {isSidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </motion.button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 space-y-1 px-2">
              <motion.a
                href="/"
                onClick={(e) => handleNavigation(e, "/chat")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HomeIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="home-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Home
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <motion.a
                href="/dashboard"
                onClick={(e) => handleNavigation(e, "/dashboard")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <DashboardIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="dashboard-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Dashboard
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <motion.a
                href="/notification"
                onClick={(e) => handleNavigation(e, "/notification")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NotificationIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="notif-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Notifications
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <motion.a
                href="/profile"
                onClick={(e) => handleNavigation(e, "/profile")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="profile-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Profile
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
             

              {/* Telegram Connection Button */}
              <motion.button
                onClick={telegramStatus?.isLinked ? handleTelegramUnlink : handleTelegramConnect}
                disabled={telegramLoading || !isAuthenticated}
                className={`flex items-center space-x-2 p-1.5 rounded-lg text-sm w-full ${
                  !isAuthenticated
                    ? "text-gray-400 cursor-not-allowed"
                    : telegramError && telegramError.includes('Backend server')
                      ? "text-orange-500 hover:bg-orange-500/10"
                      : telegramStatus?.isLinked 
                        ? "text-red-500 hover:bg-red-500/10" 
                        : "text-[#0088cc] hover:bg-[#0088cc]/10"
                }`}
                whileHover={{ scale: isAuthenticated ? 1.02 : 1 }}
                whileTap={{ scale: isAuthenticated ? 0.98 : 1 }}
              >
                <TelegramIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="telegram-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {!isAuthenticated
                        ? "Login Required"
                        : telegramError && telegramError.includes('Backend server')
                          ? "Server Offline"
                        : telegramLoading 
                          ? "Loading..." 
                          : telegramStatus?.isLinked 
                            ? "Disconnect Telegram" 
                            : "Connect Telegram"
                      }
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </nav>

            {/* Logout button at bottom */}
            <div className="mt-auto px-2 space-y-1">
              <motion.a
                href="/settings"
                onClick={(e) => handleNavigation(e, "/settings")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <SettingsIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="settings-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
              <motion.a
                href="/"
                onClick={(e) => handleNavigation(e, "/")}
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogoutIcon className="h-4 w-4" />
                <AnimatePresence initial={false}>
                  {isSidebarOpen && (
                    <motion.span
                      key="logout-label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <motion.main
          className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="w-full h-full max-w-6xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            layout
          >
            <ChatBox />
          </motion.div>
        </motion.main>
      </div>

      {/* Telegram Connection Modal */}
      <AnimatePresence>
        {showTelegramModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTelegramModal}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <TelegramIcon className="h-6 w-6 text-[#0088cc] mr-2" />
                  Connect to Telegram
                </h3>
                <button
                  onClick={closeTelegramModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {telegramError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{telegramError}</p>
                </div>
              )}

              {telegramCode && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Send this code to your Telegram bot to connect your account:
                    </p>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center mb-2">
                        <code className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                          {telegramCode}
                        </code>
                      </div>
                      <button
                        onClick={copyTelegramCode}
                        className="text-sm text-[#0088cc] hover:text-[#0077b3] font-medium"
                      >
                        Click to copy code
                      </button>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      <p>1. Open Telegram</p>
                      <p>2. Find @{telegramStatus?.botUsername || 'your_bot'}</p>
                      <p>3. Send the code: <span className="font-mono font-bold">{telegramCode}</span></p>
                      <p>4. Your account will be linked automatically</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={closeTelegramModal}
                      className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Refresh status to check if linked
                        getTelegramStatus().then(setTelegramStatus);
                      }}
                      className="flex-1 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0077b3] transition-colors"
                    >
                      Check Status
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
