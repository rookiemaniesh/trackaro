"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApi } from "@/app/utils/api";
import { useAuth } from "@/context/AuthContext";
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

export default function ConnectTelegramPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [telegramCode, setTelegramCode] = useState("");
    const [telegramExpiry, setTelegramExpiry] = useState("");
    const [isLoadingCode, setIsLoadingCode] = useState(false);
    const router = useRouter();
    const api = useApi();

    const copyTelegramCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            alert("Telegram code copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
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
            setIsLoadingCode(true);
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
            setIsLoadingCode(false);
        }
    };

    // Auto-generate code on page load
    useEffect(() => {
        if (!telegramCode) {
            generateTelegramCode();
        }
    }, []);

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900">
            <ChatSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                currentPath="/connect-telegram"
            />

            {/* Main content */}
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
                <div className="bg-white  px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Connect Telegram
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Link your Telegram account to receive expense notifications, daily summaries, and chat with Trackaro AI directly from Telegram.

                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
                    <motion.div
                        className="bg-white  rounded-2xl shadow-xl max-w-lg w-full p-8"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                       

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                        </p>

                        {/* Code Display */}
                        <div className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Your Unique Code:
                                </label>
                               
                            </div>

                            {isLoadingCode ? (
                                <div className="flex items-center justify-center py-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600 dark:text-gray-400">Generating code...</span>
                                </div>
                            ) : telegramCode ? (
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={telegramCode}
                                        readOnly
                                        className="flex-1 p-4 text-2xl font-mono font-bold text-center bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400 tracking-widest"
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={generateTelegramCode}
                                    className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    Generate Code
                                </button>
                            )}

                            {telegramExpiry && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                                    Code expires: {new Date(telegramExpiry).toLocaleString()}
                                </p>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                📱 How to connect:
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { step: 1, text: <>Open Telegram and search for <strong className="text-blue-600">@TrackaroBot</strong></> },
                                    { step: 2, text: "Start a conversation with the bot" },
                                    { step: 3, text: <>Send the code: <strong className="text-blue-600 font-mono">{telegramCode || "XXXXXX"}</strong></> },
                                    { step: 4, text: "Wait for confirmation message ✅" },
                                ].map(({ step, text }) => (
                                    <div key={step} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                                            {step}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-400 pt-0.5">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="flex-1 py-3 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                ← Go Back
                            </button>
                            {telegramCode && (
                                <button
                                    onClick={() => copyTelegramCode(telegramCode)}
                                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
                                >
                                Copy 
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}
