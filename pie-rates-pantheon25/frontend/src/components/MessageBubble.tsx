"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: string;
  sender: "user" | "bot";
  timestamp: Date;
  animateTypewriter?: boolean;
  requiresPaymentMethod?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  timestamp,
  animateTypewriter = false,
  requiresPaymentMethod = false,
}) => {
  const isUser = sender === "user";

  // Format the timestamp with explicit formatting to avoid hydration mismatch
  const formattedTime = formatTime(timestamp);

  // Helper function to format time consistently between server and client
  function formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  // Convert markdown-style formatting to HTML
  const formatMessage = (text: string) => {
    // Handle null/undefined text
    if (!text || typeof text !== "string") {
      return "";
    }

    // Bold text (wrapped in *)
    let formattedText = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

    // Line breaks
    formattedText = formattedText.replace(/\n/g, "<br/>");

    return formattedText;
  };

  // Typewriter effect for bot messages on demand
  const [displayed, setDisplayed] = useState<string>(message);
  useEffect(() => {
    if (!animateTypewriter || isUser) {
      setDisplayed(message || "");
      return;
    }
    setDisplayed("");
    const chars = (message || "").split("");
    let i = 0;
    const speed = 14; // ms per char
    const timer = setInterval(() => {
      i += 1;
      setDisplayed(chars.slice(0, i).join(""));
      if (i >= chars.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [animateTypewriter, isUser, message]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <motion.div
        className={`message-bubble max-w-[80%] px-4 py-3 rounded-lg ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : requiresPaymentMethod
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-600 text-trackaro-text dark:text-trackaro-text rounded-bl-none"
            : "bg-secondary dark:bg-secondary text-trackaro-text dark:text-trackaro-text rounded-bl-none"
        }`}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {requiresPaymentMethod && !isUser && (
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium">
                Payment Method Required
              </span>
            </div>
          </div>
        )}
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: formatMessage(displayed) }}
        />
        <div
          className={`text-xs mt-1 text-right ${
            isUser
              ? "text-blue-100"
              : "text-trackaro-accent dark:text-trackaro-accent"
          }`}
        >
          {formattedTime}
        </div>
        {/* Cursor for typing */}
        {animateTypewriter &&
          !isUser &&
          (displayed || "").length < (message || "").length && (
            <motion.span
              className="inline-block w-3 h-4 align-[-2px] ml-0.5 bg-trackaro-accent/70"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
      </motion.div>
    </div>
  );
};

export default MessageBubble;
