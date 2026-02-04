"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

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

const RecommendationIcon = ({ className }: { className?: string }) => (
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
    <path d="M9 12l2 2 4-4"></path>
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"></path>
    <path d="M12 3v6l3-3"></path>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
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
    <path d="M21.198 3.148a1.093 1.093 0 0 0-.872-.174L2.822 8.713c-1.483.4-1.434 1.404-.247 1.73l4.457 1.38 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.21-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434Z"></path>
  </svg>
);

const PaymentIcon = ({ className }: { className?: string }) => (
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
    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
    <line x1="2" x2="22" y1="10" y2="10"></line>
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
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" x2="9" y1="12" y2="12"></line>
  </svg>
);

interface ChatSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onTelegramClick?: () => void;
  onPaymentClick?: () => void;
  currentPath?: string;
}

export default function ChatSidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  onTelegramClick,
  onPaymentClick,
  currentPath = "/"
}: ChatSidebarProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    router.push(path);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.aside
      className={`backdrop-blur-lg bg-trackaro-card/50 border-r border-trackaro-border/30 fixed h-full z-10 shadow-lg`}
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
                className="text-sm text-center font-semibold tracking-wide text-trackaro-text dark:text-trackaro-text font-poppins"
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

        {/* User Profile Bar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 mb-4 overflow-hidden"
            >
              <motion.a
                href="/profile"
                onClick={(e) => handleNavigation(e, "/profile")}
                className=" rounded-lg backdrop-blur-sm bg-trackaro-card/30 border border-trackaro-border/30 shadow-sm hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 transition-colors cursor-pointer block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-trackaro-accent/10 flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                      <div className="h-full w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    ) : user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5 text-trackaro-text" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isLoading ? (
                      <>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-trackaro-text dark:text-trackaro-text truncate">
                          {user?.name || "User"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          <motion.a
            href="/notification"
            onClick={(e) => handleNavigation(e, "/notification")}
            className="flex items-center space-x-2 p-1.5 text-zinc-500 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
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
                  className="font-inter text-zinc-500"
                >
                  Notifications
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
          
          <motion.a
            href="/chat"
            onClick={(e) => handleNavigation(e, "/chat")}
            className={`flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10 ${
              currentPath === "/chat" ? "bg-blue-200 dark:bg-trackaro-accent/10" : ""
            }`}
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
                  className="font-inter"
                >
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
          
          <motion.a
            href="/dashboard"
            onClick={(e) => handleNavigation(e, "/dashboard")}
            className={`flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10 ${
              currentPath === "/dashboard" ? "bg-blue-200 dark:bg-trackaro-accent/10" : ""
            }`}
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
                  className="font-inter"
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
          
          <motion.a
            href="/recommendations"
            onClick={(e) => handleNavigation(e, "/recommendations")}
            className={`flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10 ${
              currentPath === "/recommendations" ? "bg-blue-200 dark:bg-trackaro-accent/10" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RecommendationIcon className="h-4 w-4" />
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.span
                  key="recommendations-label"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="font-inter"
                >
                  Recommendations
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
          
          {onTelegramClick && (
            <motion.button
              onClick={onTelegramClick}
              className="flex w-full items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                    className="font-inter"
                  >
                    Telegram
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
          
          {onPaymentClick && (
            <motion.button
              onClick={onPaymentClick}
              className="flex w-full items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PaymentIcon className="h-4 w-4" />
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    key="payment-label"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="font-inter"
                  >
                    Payment
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </nav>

        {/* Logout button at bottom */}
        <div className="mt-auto px-2 space-y-1">
          <motion.a
            href="/settings"
            onClick={(e) => handleNavigation(e, "/settings")}
            className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-blue-200 dark:hover:bg-trackaro-accent/10"
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
                  className="font-inter"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
          
          <motion.a
            href="/"
            onClick={handleLogout}
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
                  className="font-inter"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        </div>
      </div>
    </motion.aside>
  );
}
