"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";
import ChatSidebar from "@/components/ChatSidebar";

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

export default function PaymentPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [upiId, setUpiId] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentNote, setPaymentNote] = useState("");
    const [generatedUpiUrl, setGeneratedUpiUrl] = useState("");
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [isCreatingExpense, setIsCreatingExpense] = useState(false);
    const router = useRouter();
    const api = useApi();

    const validateUpiId = (upi: string) => {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        return upiRegex.test(upi);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("UPI link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            alert("UPI link copied to clipboard!");
        }
    };

    const handlePaymentContinue = async () => {
        if (paymentAmount && upiId && validateUpiId(upiId)) {
            setIsCreatingExpense(true);
            try {
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

                const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${encodeURIComponent(paymentAmount)}&cu=INR&tn=${encodeURIComponent(paymentNote || "Payment")}`;

                setGeneratedUpiUrl(upiUrl);
                setShowCopyButton(true);

                const paymentDetails = {
                    upiId,
                    amount: paymentAmount,
                    note: paymentNote || "Payment",
                    upiUrl,
                    expenseId: expenseResponse.data?.expense?.id
                };

                sessionStorage.setItem("lastPaymentDetails", JSON.stringify(paymentDetails));

                try {
                    const link = document.createElement("a");
                    link.href = upiUrl;
                    link.style.display = "none";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    alert(`Payment initiated! 
          
UPI ID: ${upiId}
Amount: ₹${paymentAmount}
Note: ${paymentNote || "Payment"}
Expense ID: ${expenseResponse.data?.expense?.id}
`);
                } catch (error) {
                    console.error("Error opening UPI payment:", error);
                    alert(`



Copy this UPI link: ${upiUrl}`);
                }
            } catch (error) {
                console.error("Error creating expense:", error);
                alert("Failed to create expense record. Please try again.");
            } finally {
                setIsCreatingExpense(false);
            }
        }
    };

    const resetForm = () => {
        setUpiId("");
        setPaymentAmount("");
        setPaymentNote("");
        setGeneratedUpiUrl("");
        setShowCopyButton(false);
        setIsCreatingExpense(false);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
            <ChatSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                currentPath="/payment"
            />

            <motion.main
                className="flex-1 flex flex-col overflow-hidden h-screen"
                style={{
                    marginLeft: isSidebarOpen ? "260px" : "80px",
                    transition: "margin-left 0.3s",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="bg-white px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        UPI Payment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Make secure UPI payments and track expenses automatically
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                    

                        <div className="space-y-5">
                            {/* UPI ID Field */}
                            <div className="relative">
                                <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 items-center">
                                    <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                                    UPI ID *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="Enter UPI ID (e.g., user@paytm)"
                                        className={`w-full p-4 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200 ${upiId && !validateUpiId(upiId)
                                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                                        ) : null}
                                    </div>
                                </div>
                                {upiId && !validateUpiId(upiId) && (
                                    <p className="text-red-500 text-xs mt-2">Please enter a valid UPI ID format</p>
                                )}
                            </div>

                            {/* Amount Field */}
                            <div className="relative">
                                <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 items-center">
                                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                    Amount *
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                        ₹
                                    </div>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Enter amount (e.g., 100)"
                                        className="w-full p-4 pl-8 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Note Field */}
                            <div className="relative">
                                <label className="flex text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 items-center">
                                    <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                                    Note 
                                </label>
                                <textarea
                                    value={paymentNote}
                                    onChange={(e) => setPaymentNote(e.target.value)}
                                    placeholder="Add a note about this payment (e.g., Dinner, Groceries)"
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none h-20"
                                />
                            </div>
                        </div>

                        

                        {/* Actions */}
                        <div className="mt-8 space-y-3">
                            <motion.button
                                onClick={handlePaymentContinue}
                                disabled={!paymentAmount || !upiId || !validateUpiId(upiId) || isCreatingExpense}
                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    }`}
                                whileHover={paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense ? { scale: 1.02 } : {}}
                                whileTap={paymentAmount && upiId && validateUpiId(upiId) && !isCreatingExpense ? { scale: 0.98 } : {}}
                            >
                                {isCreatingExpense ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Creating Expense...</span>
                                    </span>
                                ) : (
                                    "Open Google Pay"
                                )}
                            </motion.button>

                            <button
                                onClick={() => router.back()}
                                className="w-full py-3 px-6 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}
