import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";
import { useAuth } from "@/context/AuthContext";
import {
  ThumbsUp,
  ThumbsDown,
  Plus,
  Settings,
  MessageCircle,
} from "lucide-react";

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
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21.73 2.27a3.63 3.63 0 0 0-3.06-.2L4.5 8.5h-.03a1.95 1.95 0 0 0 .21 3.61L7.5 13.14v5.53a2.17 2.17 0 0 0 3.46 1.7l2.5-2 3.82 2.9a2.05 2.05 0 0 0 3.35-1.1l3.72-16.29a3.65 3.65 0 0 0-2.62-1.62Z"></path>
    <path d="M8 13.5 16 8"></path>
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

const ChatInterface = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    router.push(path);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // This would integrate with your existing ChatBox component's functionality
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-700 overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-[60%] right-[25%] w-64 h-64 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-[25%] left-[40%] w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Sidebar */}
      <motion.aside
        className="backdrop-blur-lg bg-gradient-to-b from-black/20 to-black/10 border-r border-white/20 fixed h-full z-10 shadow-lg"
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
                  className="text-sm text-center font-semibold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200 font-poppins"
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
              className="text-white hover:bg-white/20 rounded-full p-1"
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

          {/* User Profile Section */}
          {isSidebarOpen && (
            <div className="px-3 mb-4">
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border border-white/20 shadow-md">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-inner">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">
                    {user?.name || "User"}
                  </span>
                  <span className="text-xs text-white/70">Premium User</span>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-1 px-2">
            <motion.a
              href="/"
              onClick={(e) => handleNavigation(e, "/")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
              href="/notification"
              onClick={(e) => handleNavigation(e, "/notification")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
                    className="font-inter"
                  >
                    Notifications
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
            <motion.a
              href="/profile"
              onClick={(e) => handleNavigation(e, "/profile")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
                    className="font-inter"
                  >
                    Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.a>
            <motion.a
              href="/dashboard"
              onClick={(e) => handleNavigation(e, "/dashboard")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
              href="/telegram"
              onClick={(e) => handleNavigation(e, "/telegram")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
            </motion.a>
            <motion.button
              onClick={() => console.log("Payment button clicked")}
              className="flex w-full items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
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
          </nav>

          {/* Logout button at bottom */}
          <div className="mt-auto px-2 space-y-1">
            <motion.a
              href="/settings"
              onClick={(e) => handleNavigation(e, "/settings")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-white hover:bg-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="h-4 w-4" />
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
              onClick={(e) => handleNavigation(e, "/")}
              className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20"
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

      {/* Main Content */}
      <motion.main
        className="flex-1 flex items-center justify-center relative"
        style={{
          marginLeft: isSidebarOpen ? "200px" : "45px",
          transition: "margin-left 0.3s",
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-[80%] h-[90%] backdrop-blur-xl bg-gradient-to-b from-white/20 to-white/10 border border-white/30 rounded-3xl shadow-xl relative flex overflow-hidden animate-shimmer">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-10">
            {/* Logo */}
            <div className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-cyan-200 tracking-wider">
              ✦ TracKARO ✦
            </div>

            {/* Chat Content - Using existing ChatBox but styling more like glass effect */}
            <div
              className="w-full h-full flex flex-col backdrop-blur-md bg-gradient-to-br from-rose-400/10 via-fuchsia-500/10 to-indigo-700/10 rounded-2xl p-4 transition-all duration-300 border border-white/30 hover:border-white/40 relative overflow-hidden"
              style={{
                boxShadow:
                  "0 0 15px rgba(244, 114, 182, 0.15), 0 0 30px rgba(139, 92, 246, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(244, 114, 182, 0.2), 0 0 40px rgba(139, 92, 246, 0.15), inset 0 0 15px rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(244, 114, 182, 0.15), 0 0 30px rgba(139, 92, 246, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.1)";
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-400/5 to-transparent rounded-full mix-blend-overlay -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-700/5 to-transparent rounded-full mix-blend-overlay -ml-16 -mb-16"></div>

              {/* Chat component */}
              {/* <ChatBox /> */}
            </div>

            {/* Feedback */}
            <div className="flex space-x-4 mt-4">
              <button className="p-2 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full hover:from-white/40 hover:to-white/20 text-white transition-all shadow-md">
                <ThumbsUp size={18} />
              </button>
              <button className="p-2 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full hover:from-white/40 hover:to-white/20 text-white transition-all shadow-md">
                <ThumbsDown size={18} />
              </button>
            </div>

            {/* Input */}
            <div className="absolute bottom-6 flex w-[60%] bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 items-center shadow-lg">
              <input
                placeholder="Ask TracKARO anything..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/70"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="ml-2 p-2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md"
                onClick={handleSendMessage}
              >
                ↑
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-64 border-l border-white/30 p-6 backdrop-blur-lg bg-gradient-to-b from-white/15 to-white/5 rounded-r-3xl flex flex-col">
            {/* AI Module */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-white/70">AI Module</p>
              <div className="flex items-center justify-between backdrop-blur-sm bg-white/20 border border-white/30 rounded-lg px-3 py-2 mt-2 hover:bg-white/30 transition-colors">
                <span className="text-sm text-white">Thinker</span>
                <span className="text-pink-300 text-xs">▼</span>
              </div>
            </div>

            {/* Conversations */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-white/70 mb-2">
                Conversations
              </p>
              <div className="flex space-x-3 text-xs mb-2">
                <span className="font-semibold text-white">Recent</span>
                <span className="text-white/50">Favorite</span>
              </div>
              <ul className="text-white/80 text-sm space-y-1">
                <li>How do I reset my password?</li>
                <li>What's on my schedule today?</li>
                <li>Remind me to submit the project report…</li>
                <li>Can you help me track my order?</li>
              </ul>
            </div>

            {/* Collections */}
            <div>
              <p className="text-xs font-semibold text-white/70 mb-2">
                Collections <span className="text-green-300">New</span>
              </p>
              <ul className="text-white/80 text-sm space-y-2">
                <li>📂 Project Management</li>
                <li>
                  📂 Personal Assistant
                  <ul className="ml-4 text-white/60 text-xs space-y-1">
                    <li>• Schedule a dentist appointment for…</li>
                    <li>• Remind me to call Sarah at 5 PM…</li>
                  </ul>
                </li>
                <li>📂 Customer Support</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default ChatInterface;
