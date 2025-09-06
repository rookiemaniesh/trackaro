"use client";

import ChatMockup from "@/components/ChatMockup";
import React from "react";
import { motion } from "framer-motion";

export default function MockupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-3xl mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Financial Assistant Demo
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Experience our AI-powered chat interface for financial services
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <ChatMockup />
      </motion.div>
    </div>
  );
}
