
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

// --- Icons ---
const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

const HistoryIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
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

const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    {isOpen ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
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
  currentPath = "/",
}: ChatSidebarProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();






  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Reusable Nav Item Component
  const NavItem = ({
    icon: Icon,
    label,
    isActive = false,
    onClick,
    categoryItem = false
  }: {
    icon: any;
    label: string;
    isActive?: boolean;
    onClick: () => void;
    categoryItem?: boolean;
  }) => (
    <motion.button
      onClick={onClick}
      className={`group flex items-center w-full p-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
        ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100"
        : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex-shrink-0 ${isActive ? "text-gray-900 dark:text-white" : ""}`}>
        <Icon className="w-5 h-5" />
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="ml-3 font-medium text-sm whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Active Indicator on left (optional style choice, keeping it clean for now) */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-900 rounded-r-full hidden"
        />
      )}
    </motion.button>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="px-3 mt-6 mb-2"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.aside
      className="fixed h-full z-10 bg-[#F3F5F1] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl"
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ willChange: "width" }}
    >
      {/* Toggle Button - Absolute positioned or top aligned */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-5 top-18 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md hover:bg-gray-50 z-20 text-gray-500"
      >
        <ToggleIcon isOpen={isSidebarOpen} />
      </button>


      <div className="flex flex-col h-full p-4 overflow-y-auto no-scrollbar">

        {/* App Logo */}
        <div className={`mx-2 mb-4 transition-all duration-300 ${isSidebarOpen ? "opacity-100 placeholder-opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
          <img src="/logo-1.png" alt="Logo" className="w-20 h-auto" />
        </div>

        {/* User Profile Card */}
        <div className={`relative bg-white dark:bg-gray-800 rounded-3xl p-1 mb-6 transition-all duration-300 ${isSidebarOpen ? "" : "bg-transparent dark:bg-transparent"}`}>
          <div className={`flex items-center ${isSidebarOpen ? "gap-4" : "justify-center flex-col gap-2"}`}>
            <div className="relative">
              <div className="w-12 h-12 rounded-[18px] bg-red-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm ring-2 ring-red-50">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-400">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
                    {isLoading ? "Loading..." : (user?.name || "User")}
                  </h3>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>


        {/* Navigation Sections */}
        <nav className="flex-1 space-y-1">

          <SectionHeader title="General" />
          <NavItem
            icon={HomeIcon}
            label="Home"
            isActive={currentPath === "/chat"}
            onClick={() => handleNavigation("/chat")}
          />

          <NavItem
            icon={DashboardIcon}
            label="Dashboard"
            isActive={currentPath === "/dashboard"}
            onClick={() => handleNavigation("/dashboard")}
          />

          <SectionHeader title="Services" />
          <NavItem
            icon={TelegramIcon}
            label="Telegram"
            onClick={onTelegramClick || (() => { })}
          />
          <NavItem
            icon={PaymentIcon}
            label="Payment"
            onClick={onPaymentClick || (() => { })}
          />
          <NavItem
            icon={HistoryIcon}
            label="History"
            isActive={currentPath === "/history"}
            onClick={() => handleNavigation("/history")}
          />


          <SectionHeader title="Other" />
          <NavItem
            icon={SettingsIcon}
            label="Settings"
            isActive={currentPath === "/settings"}
            onClick={() => handleNavigation("/settings")}
          />
          <NavItem
            icon={LogoutIcon}
            label="Logout"
            onClick={handleLogout}
          />

        </nav>



      </div>
    </motion.aside>
  );
}
