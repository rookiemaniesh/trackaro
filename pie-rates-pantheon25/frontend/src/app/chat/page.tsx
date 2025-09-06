"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatBox from "../../components/ChatBox";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    router.push(path);
  };

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
                    TracKARO
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
                onClick={(e) => handleNavigation(e, "/")}
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
                      profile
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
    </motion.div>
  );
}
