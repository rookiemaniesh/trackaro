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

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [generatedUpiUrl, setGeneratedUpiUrl] = useState("");
  const [showCopyButton, setShowCopyButton] = useState(false);
  const router = useRouter();

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    router.push(path);
  };

  const validateUpiId = (upi: string) => {
    // Basic UPI ID validation - should contain @ and be in format like user@paytm, user@phonepe, etc.
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upi);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("UPI link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("UPI link copied to clipboard!");
    }
  };

  const handlePaymentContinue = () => {
    if (paymentAmount && upiId && validateUpiId(upiId)) {
      // Create UPI payment URL with proper format for Google Pay
      const upiUrl = `upi://pay?pa=${encodeURIComponent(
        upiId
      )}&pn=${encodeURIComponent(payeeName || "Payee")}&am=${encodeURIComponent(
        paymentAmount
      )}&cu=INR&tn=${encodeURIComponent(paymentNote || "Payment")}`;

      console.log("Generated UPI URL:", upiUrl);
      console.log("Payment Details:", {
        upiId,
        payeeName: payeeName || "Payee",
        amount: paymentAmount,
        note: paymentNote || "Payment",
      });

      // Store the generated URL and show copy button
      setGeneratedUpiUrl(upiUrl);
      setShowCopyButton(true);

      // Create a more user-friendly payment initiation
      const paymentDetails = {
        upiId,
        payeeName: payeeName || "Payee",
        amount: paymentAmount,
        note: paymentNote || "Payment",
        upiUrl,
      };

      // Store payment details in sessionStorage for debugging
      sessionStorage.setItem(
        "lastPaymentDetails",
        JSON.stringify(paymentDetails)
      );

      // Try to open UPI payment
      try {
        // Create a hidden link and click it
        const link = document.createElement("a");
        link.href = upiUrl;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        alert(`Payment initiated! 
        
UPI ID: ${upiId}
Amount: ₹${paymentAmount}
Note: ${paymentNote || "Payment"}

If Google Pay didn't open automatically, please:
1. Open Google Pay manually
2. Tap "Send Money" 
3. Enter UPI ID: ${upiId}
4. Enter Amount: ₹${paymentAmount}`);
      } catch (error) {
        console.error("Error opening UPI payment:", error);

        // Show fallback instructions
        alert(`Unable to open Google Pay automatically.

Please manually open Google Pay and use these details:
UPI ID: ${upiId}
Amount: ₹${paymentAmount}
Note: ${paymentNote || "Payment"}

Or copy this UPI link: ${upiUrl}`);
      }

      // Don't close modal immediately, let user copy the link if needed
      // setIsPaymentModalOpen(false);
      // setUpiId("");
      // setPayeeName("");
      // setPaymentAmount("");
      // setPaymentNote("");
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setUpiId("");
    setPayeeName("");
    setPaymentAmount("");
    setPaymentNote("");
    setGeneratedUpiUrl("");
    setShowCopyButton(false);
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
          className={`bg-secondary dark:bg-trackaro-bg border-r border-trackaro-border dark:border-trackaro-border fixed h-full z-10`}
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
                      className="font-inter"
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
                className="flex items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
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
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex w-full items-center space-x-2 p-1.5 rounded-lg text-sm text-trackaro-text dark:text-trackaro-text hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
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

        {/* Main content */}
        <motion.main
          className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden ml-[45px]"
          style={{
            marginLeft: isSidebarOpen ? "200px" : "45px",
            transition: "margin-left 0.3s",
          }}
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

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePaymentModal}
          >
            <motion.div
              className="bg-white dark:bg-trackaro-bg rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 font-poppins">
                💳 UPI Payment
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-inter">
                Fill in the details below and click "Open Google Pay" to
                initiate payment with pre-filled information.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 font-inter">
                  UPI ID *
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g., user@paytm, user@phonepe)"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md font-inter bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {upiId && !validateUpiId(upiId) && (
                  <p className="text-red-500 text-xs mt-1 font-inter">
                    Please enter a valid UPI ID format
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 font-inter">
                  Payee Name (Optional)
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="Enter payee name (e.g., John Doe, Store Name)"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md font-inter bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 font-inter">
                  Amount *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 100)"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md font-inter bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 font-inter">
                  Note (Optional)
                </label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Add a note about this payment (e.g., Dinner, Groceries)"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md font-inter bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                />
              </div>

              <button
                onClick={handlePaymentContinue}
                disabled={!paymentAmount || !upiId || !validateUpiId(upiId)}
                className={`w-full py-3 px-4 rounded-lg font-medium mb-4 ${
                  paymentAmount && upiId && validateUpiId(upiId)
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                } font-inter transition-all duration-200`}
              >
                💰 Open Google Pay
              </button>

              {showCopyButton && generatedUpiUrl && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-inter">
                    UPI Payment Link:
                  </p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedUpiUrl}
                      readOnly
                      className="flex-1 p-2 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedUpiUrl)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-inter">
                    Copy this link and paste it in your browser or share it with
                    others
                  </p>
                </div>
              )}

              <button
                onClick={closePaymentModal}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium font-inter text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
