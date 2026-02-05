"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlassChatBox from "./GlassChatBox";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/app/utils/api";
import ChatSidebar from "@/components/ChatSidebar";

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
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramCode, setTelegramCode] = useState("");
  const [telegramExpiry, setTelegramExpiry] = useState("");
  const [isLoadingTelegramCode, setIsLoadingTelegramCode] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [generatedUpiUrl, setGeneratedUpiUrl] = useState("");
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [isCreatingExpense, setIsCreatingExpense] = useState(false);
  const router = useRouter();
  const api = useApi();


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

  const copyTelegramCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Telegram code copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Telegram code copied to clipboard!");
    }
  };

  const generateTelegramCode = async () => {
    try {
      setIsLoadingTelegramCode(true);
      const response = await api.post<{
        success: boolean;
        message: string;
        data?: {
          code: string;
          expiry: string;
          instructions: string;
        };
      }>("/api/auth/telegram/start", {});

      if (response.success && response.data) {
        setTelegramCode(response.data.code);
        setTelegramExpiry(response.data.expiry);
      } else {
        alert("Failed to generate Telegram code. Please try again.");
      }
    } catch (error) {
      console.error("Error generating Telegram code:", error);
      alert("Failed to generate Telegram code. Please try again.");
    } finally {
      setIsLoadingTelegramCode(false);
    }
  };

  const handlePaymentContinue = async () => {
    if (paymentAmount && upiId && validateUpiId(upiId)) {
      setIsCreatingExpense(true);
      try {
        // First, create the expense in the backend
        const expenseResponse = await api.post<{
          success: boolean;
          message: string;
          data?: {
            expense: any;
            message: any;
          };
        }>("/api/expenses/payment", {
          amount: paymentAmount,
          description: paymentNote || "UPI Payment"
        });

        if (!expenseResponse.success) {
          alert("Failed to create expense record. Please try again.");
          return;
        }

        console.log("Expense created:", expenseResponse.data);

        // Create UPI payment URL with proper format for Google Pay
        const upiUrl = `upi://pay?pa=${encodeURIComponent(
          upiId
        )}&am=${encodeURIComponent(
          paymentAmount
        )}&cu=INR&tn=${encodeURIComponent(paymentNote || "Payment")}`;

        console.log("Generated UPI URL:", upiUrl);
        console.log("Payment Details:", {
          upiId,
          amount: paymentAmount,
          note: paymentNote || "Payment",
        });

        // Store the generated URL and show copy button
        setGeneratedUpiUrl(upiUrl);
        setShowCopyButton(true);

        // Create a more user-friendly payment initiation
        const paymentDetails = {
          upiId,
          amount: paymentAmount,
          note: paymentNote || "Payment",
          upiUrl,
          expenseId: expenseResponse.data?.expense?.id
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
Expense ID: ${expenseResponse.data?.expense?.id}

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
        // setPaymentAmount("");
        // setPaymentNote("");
      } catch (error) {
        console.error("Error creating expense:", error);
        alert("Failed to create expense record. Please try again.");
      } finally {
        setIsCreatingExpense(false);
      }
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setUpiId("");
    setPaymentAmount("");
    setPaymentNote("");
    setGeneratedUpiUrl("");
    setShowCopyButton(false);
    setIsCreatingExpense(false);
  };

  const closeTelegramModal = () => {
    setIsTelegramModalOpen(false);
    setTelegramCode("");
    setTelegramExpiry("");
  };

  const openTelegramModal = () => {
    setIsTelegramModalOpen(true);
    if (!telegramCode) {
      generateTelegramCode();
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50/20 to-neutral-50/15 dark:from-gray-900/15 dark:to-neutral-900/10 overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-trackaro-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-96 h-96 bg-trackaro-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-trackaro-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onTelegramClick={openTelegramModal}
          onPaymentClick={() => setIsPaymentModalOpen(true)}
          currentPath="/chat"
        />

        {/* Main content */}
        <motion.main
          className="flex-1 flex flex-col overflow-hidden h-screen"
          style={{
            marginLeft: isSidebarOpen ? "260px" : "80px",
            transition: "margin-left 0.3s",
            width: `calc(100% - ${isSidebarOpen ? "260px" : "80px"})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-full h-full">
            <GlassChatBox />
          </div>
        </motion.main>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePaymentModal}
          >
            <motion.div
              className="backdrop-blur-xl bg-gradient-to-br from-white/90 via-gray-50/85 to-white/90 dark:from-gray-800/90 dark:via-gray-900/85 dark:to-gray-800/90 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] border border-white/20 dark:border-gray-700/30 flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
              }}
            >
              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 relative">
                {/* Header with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl p-4 border border-blue-200/20 dark:border-blue-800/20">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <PaymentIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-poppins">
                          💳 UPI Payment
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                          Secure & Instant Payments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-inter leading-relaxed">
                  Fill in the details below and click "Open Google Pay" to
                  initiate payment with pre-filled information.
                </p>


                <div className="space-y-5">
                  {/* UPI ID Field */}
                  <div className="relative">
                    <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 font-inter items-center">
                      <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                      UPI ID *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID (e.g., user@paytm, user@phonepe)"
                        className={`w-full p-4 border-2 rounded-xl font-inter bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 backdrop-blur-sm ${upiId && !validateUpiId(upiId)
                            ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/20"
                            : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                          }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {upiId && validateUpiId(upiId) ? (
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : upiId && !validateUpiId(upiId) ? (
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    {upiId && !validateUpiId(upiId) && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-xs mt-2 font-inter flex items-center"
                      >
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Please enter a valid UPI ID format
                      </motion.p>
                    )}
                  </div>


                  {/* Amount Field */}
                  <div className="relative">
                    <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 font-inter items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      Amount *
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                        ₹
                      </div>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount (e.g., 100)"
                        className="w-full p-4 pl-8 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-inter bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-200 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Note Field */}
                  <div className="relative">
                    <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 font-inter items-center">
                      <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                      Note (Optional)
                    </label>
                    <textarea
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="Add a note about this payment (e.g., Dinner, Groceries)"
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-inter bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-200 resize-none h-20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                {/* Scroll fade indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-gray-800/90 dark:via-gray-800/50 pointer-events-none rounded-b-2xl"></div>
              </div>

              {/* Fixed Footer with Buttons */}
              <div className="flex-shrink-0 p-6 pt-0 border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-b-2xl space-y-4">
                {/* UPI Link Display */}
                {showCopyButton && generatedUpiUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-inter">
                        UPI Payment Link Generated
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="text"
                        value={generatedUpiUrl}
                        readOnly
                        className="flex-1 p-3 text-xs bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-lg font-mono text-gray-600 dark:text-gray-400 focus:outline-none"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(generatedUpiUrl)}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center space-x-1">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          <span>Copy</span>
                        </div>
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-inter flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Copy this link and paste it in your browser or share it with others
                    </p>
                  </motion.div>
                )}

                {/* Payment Button */}
                <motion.button
                  onClick={handlePaymentContinue}
                  disabled={!paymentAmount || !upiId || !validateUpiId(upiId) || isCreatingExpense}
                  className={`w-full py-4 px-6 rounded-xl font-semibold font-inter transition-all duration-300 relative overflow-hidden ${paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  whileHover={paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense ? { scale: 1.02 } : {}}
                  whileTap={paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense ? { scale: 0.98 } : {}}
                >
                  {paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                  <div className="relative flex items-center justify-center space-x-2">
                    {isCreatingExpense ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Creating Expense...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span>💰 Open Google Pay</span>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={closePaymentModal}
                  className="w-full py-3 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium font-inter text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Close</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telegram Modal */}
      <AnimatePresence>
        {isTelegramModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTelegramModal}
          >
            <motion.div
              className="bg-white dark:bg-trackaro-bg rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <TelegramIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 font-poppins">
                  Connect Telegram
                </h2>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-inter">
                Link your Telegram account to receive expense notifications and chat with Trackaro AI.
              </p>

              {/* Code Display */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 font-inter">
                    Your Telegram Code:
                  </label>
                  {telegramCode && (
                    <button
                      onClick={() => copyTelegramCode(telegramCode)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  )}
                </div>

                {isLoadingTelegramCode ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Generating code...</span>
                  </div>
                ) : telegramCode ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={telegramCode}
                      readOnly
                      className="flex-1 p-3 text-lg font-mono font-bold text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                ) : (
                  <button
                    onClick={generateTelegramCode}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Generate Code
                  </button>
                )}

                {telegramExpiry && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Code expires: {new Date(telegramExpiry).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 font-inter">
                  How to connect:
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 font-inter">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Open Telegram and search for <strong>@TrackaroBot</strong></span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Start a conversation with the bot</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Send the code: <strong>{telegramCode || "XXXXXX"}</strong></span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Wait for confirmation message</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeTelegramModal}
                  className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium font-inter text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {telegramCode && (
                  <button
                    onClick={() => copyTelegramCode(telegramCode)}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium font-inter hover:bg-blue-700 transition-colors"
                  >
                    Copy Code
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}