"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatMockup() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  // New state for typed content of each message
  const [typedContent, setTypedContent] = useState<string[]>([]);

  // State to track if typing is complete for each message
  const [typingComplete, setTypingComplete] = useState<boolean[]>([]);

  // Messages appear sequentially with looping
  useEffect(() => {
    const totalMessages = 4;

    if (visibleMessages < totalMessages) {
      // Only show next message when current message typing is complete
      if (visibleMessages === 0 || typingComplete[visibleMessages - 1]) {
        const timer = setTimeout(
          () => {
            setVisibleMessages((prev) => prev + 1);
          },
          visibleMessages === 0 ? 200 : 400
        ); // Longer pause after first message
        return () => clearTimeout(timer);
      }
    } else if (typingComplete[totalMessages - 1]) {
      // Reset to start the loop again after a longer delay
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0);
        setTypedContent([]);
        setTypingComplete([]);
      }, 5000); // Wait 5 seconds before restarting the sequence (increased from 2000)
      return () => clearTimeout(resetTimer);
    }
  }, [visibleMessages, typingComplete]);

  // Define the messages specific to Trackaro
  const messages = [
    {
      type: "user",
      content: "How can I track my monthly expenses in Trackaro?",
      isVisible: visibleMessages >= 1,
    },
    {
      type: "ai",
      content:
        "With Trackaro, you can easily categorize and track your expenses.",
      isVisible: visibleMessages >= 2,
    },
    {
      type: "user",
      content: "Can Trackaro help me set a budget?",
      isVisible: visibleMessages >= 3,
    },
    {
      type: "ai",
      content:
        "Absolutely! Trackaro offers customizable budget goals for different categories.",
      isVisible: visibleMessages >= 4,
    },
  ];

  // Typing animation variables for AI responses
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState(-1);

  // Interval ref for typewriter effect
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for typing animation - for ALL messages
  useEffect(() => {
    // For all messages when they appear
    if (visibleMessages >= 1 && visibleMessages <= messages.length) {
      setIsTyping(true);
      setTypingMessageIndex(visibleMessages - 1);

      // Wait for typing dots to appear first
      const typingTimer = setTimeout(() => {
        setIsTyping(false);

        // Start typewriter effect for this message
        startTypewriter(visibleMessages - 1);
      }, 1000); // Show typing indicator for 2 seconds (slower)

      return () => {
        clearTimeout(typingTimer);
        if (typeIntervalRef.current) {
          clearInterval(typeIntervalRef.current);
        }
      };
    }
  }, [visibleMessages]);

  // Function to handle typewriter effect
  const startTypewriter = (messageIndex: number) => {
    const fullText = messages[messageIndex].content;
    let i = 0;

    // Initialize the typed content for this message
    setTypedContent((prev) => {
      const newTyped = [...prev];
      newTyped[messageIndex] = "";
      return newTyped;
    });

    // Create an interval to add one character at a time
    typeIntervalRef.current = setInterval(
      () => {
        if (i < fullText.length) {
          setTypedContent((prev) => {
            const newTyped = [...prev];
            newTyped[messageIndex] = fullText.substring(0, i + 1);
            return newTyped;
          });
          i++;
        } else {
          // Clear the interval when typing is complete
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
          }
          // Mark this message typing as complete
          setTypingComplete((prev) => {
            const newComplete = [...prev];
            newComplete[messageIndex] = true;
            return newComplete;
          });
        }
      },
      // Both user and AI messages type at the same speed (only first message is faster)
      messageIndex === 0 ? 40 : 60
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      {/* Simple white chat box background - only acts as a backdrop */}
      <div className="relative w-[80%] h-[520px] mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Top Pills / Category Selectors */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 text-sm font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20m-9-9h18" />
            </svg>
            <span>Expenses</span>
          </button>

          <button className="flex items-center gap-2 text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-1.5 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Budget</span>
          </button>
        </div>

        {/* Empty chat content - this is just the white box */}
        <div className="absolute inset-0 mt-[70px]">
          {/* Intentionally empty */}
        </div>
      </div>

      {/* Chat messages container - positioned absolutely over the white box */}
      <div className="absolute inset-0 mt-[70px] px-4 flex flex-col space-y-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {messages.map(
            (message, index) =>
              message.isVisible && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    mass: 1,
                    delay: index === 0 ? 0.3 : 0.1, // Slightly delayed for smoother appearance
                  }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } z-30 pointer-events-auto`}
                  style={{
                    width: "110%", // Wider than the white box
                    marginLeft: message.type === "user" ? "0" : "-1%",
                    marginRight: message.type === "user" ? "-1%" : "0",
                  }}
                >
                  <div
                    className={`max-w-[400px] md:max-w-[400px] ${
                      message.type === "user"
                        ? "mr-[10px] md:mr-[-10px]" // More negative margin to push outside
                        : "ml-[-30px] md:ml-[-60px]" // More negative margin to push outside
                    }`}
                  >
                    {isTyping &&
                    typingMessageIndex === index &&
                    message.type === "ai" ? (
                      <div className="flex items-center space-x-1 ml-4 mb-2">
                        <motion.div
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: index === 0 ? 2.0 : 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                          }}
                          className="w-2 h-2 rounded-full bg-blue-600"
                        ></motion.div>
                        <motion.div
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: index === 0 ? 2.0 : 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            delay: 0.2,
                          }}
                          className="w-2 h-2 rounded-full bg-blue-600"
                        ></motion.div>
                        <motion.div
                          animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: index === 0 ? 2.0 : 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            delay: 0.4,
                          }}
                          className="w-2 h-2 rounded-full bg-blue-600"
                        ></motion.div>
                      </div>
                    ) : (
                      <div
                        className={`${
                          message.type === "user"
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-lg"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 shadow-md"
                        } p-4`}
                      >
                        <p className="text-sm md:text-base">
                          {typedContent[index] !== undefined
                            ? typedContent[index]
                            : message.content}
                          {typedContent[index] !== undefined &&
                          typedContent[index].length <
                            message.content.length ? (
                            <span
                              className={`inline-block w-1 h-4 ml-0.5 ${
                                message.type === "user"
                                  ? "bg-white"
                                  : "bg-blue-600"
                              } animate-pulse`}
                            ></span>
                          ) : null}
                        </p>
                        {message.type === "ai" && (
                          <p className="text-gray-500 dark:text-gray-400 mt-2 text-xs font-medium">
                            Trackaro Assistant
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
