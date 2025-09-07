"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

export default function ChatMockup() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  // New state for typed content of each message
  const [typedContent, setTypedContent] = useState<string[]>([]);

  // State to track if typing is complete for each message
  const [typingComplete, setTypingComplete] = useState<boolean[]>([]);

  // Smooth spring animations
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });

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
          visibleMessages === 0 ? 300 : 600
        ); // Smoother timing
        return () => clearTimeout(timer);
      }
    } else if (typingComplete[totalMessages - 1]) {
      // Reset to start the loop again after a longer delay
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0);
        setTypedContent([]);
        setTypingComplete([]);
      }, 4000); // Slightly faster loop
      return () => clearTimeout(resetTimer);
    }
  }, [visibleMessages, typingComplete]);

  // Handle hover effects
  useEffect(() => {
    if (isHovered) {
      scale.set(1.02);
      rotateY.set(2);
    } else {
      scale.set(1);
      rotateY.set(0);
    }
  }, [isHovered, scale, rotateY]);

  // Define the messages specific to Trackaro - Financial Services AI theme
  const messages = [
    {
      type: "user",
      content: "I Spent Rs. 10 on balloons ",
      isVisible: visibleMessages >= 1,
    },
    {
      type: "ai",
      content:
        "you spent ₹10 on balloons! 🎈 It was just you, enjoying some fun. This falls under the 'Other' category.  Keep those good times rolling! ✨",
      isVisible: visibleMessages >= 2,
    },
    {
      type: "user",
      content: "Can you check my recent food expenses? ",
      isVisible: visibleMessages >= 3,
    },
    {
      type: "ai",
      content:
        "Sure! Recently, you spent ₹150 on pizza 🍕 and ₹200 on groceries 🛒. ",
      isVisible: visibleMessages >= 4,
    },
  ];

  // Removed typing animation variables

  // Effect for fade-in animation - for all messages
  useEffect(() => {
    // For all messages when they appear
    if (visibleMessages >= 1 && visibleMessages <= messages.length) {
      // Mark all messages as complete immediately (no typing animation)
      setTypingComplete((prev) => {
        const newComplete = [...prev];
        newComplete[visibleMessages - 1] = true;
        return newComplete;
      });
    }
  }, [visibleMessages]);

  // Removed typewriter function

  return (
    <div className="relative">
      {/* Block Pattern Background for Chat Mockup */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Block pattern - various sized rectangles - visible for chat mockup */}
          <rect x="0" y="0" width="80" height="60" fill="#9ca3af" opacity="0.25" />
          <rect x="100" y="20" width="120" height="80" fill="#9ca3af" opacity="0.2" />
          <rect x="250" y="0" width="60" height="100" fill="#9ca3af" opacity="0.3" />
          <rect x="350" y="30" width="100" height="60" fill="#9ca3af" opacity="0.25" />
          <rect x="480" y="10" width="80" height="90" fill="#9ca3af" opacity="0.22" />
          <rect x="600" y="0" width="120" height="70" fill="#9ca3af" opacity="0.28" />
          <rect x="750" y="25" width="90" height="85" fill="#9ca3af" opacity="0.2" />
          <rect x="870" y="5" width="70" height="95" fill="#9ca3af" opacity="0.25" />
          <rect x="970" y="30" width="110" height="65" fill="#9ca3af" opacity="0.22" />
          <rect x="1100" y="0" width="100" height="80" fill="#9ca3af" opacity="0.3" />

          {/* Second row */}
          <rect x="20" y="120" width="100" height="70" fill="#9ca3af" opacity="0.2" />
          <rect x="150" y="140" width="80" height="90" fill="#9ca3af" opacity="0.25" />
          <rect x="260" y="120" width="110" height="60" fill="#9ca3af" opacity="0.22" />
          <rect x="400" y="130" width="70" height="80" fill="#9ca3af" opacity="0.28" />
          <rect x="500" y="120" width="90" height="100" fill="#9ca3af" opacity="0.2" />
          <rect x="620" y="140" width="100" height="70" fill="#9ca3af" opacity="0.25" />
          <rect x="750" y="120" width="80" height="90" fill="#9ca3af" opacity="0.22" />
          <rect x="860" y="130" width="110" height="80" fill="#9ca3af" opacity="0.3" />
          <rect x="1000" y="120" width="90" height="70" fill="#9ca3af" opacity="0.2" />

          {/* Third row */}
          <rect x="0" y="250" width="90" height="80" fill="#9ca3af" opacity="0.25" />
          <rect x="110" y="270" width="120" height="60" fill="#9ca3af" opacity="0.22" />
          <rect x="260" y="250" width="70" height="100" fill="#9ca3af" opacity="0.2" />
          <rect x="360" y="260" width="100" height="80" fill="#9ca3af" opacity="0.28" />
          <rect x="490" y="250" width="80" height="90" fill="#9ca3af" opacity="0.25" />
          <rect x="600" y="270" width="110" height="70" fill="#9ca3af" opacity="0.22" />
          <rect x="740" y="250" width="90" height="80" fill="#9ca3af" opacity="0.3" />
          <rect x="860" y="260" width="70" height="90" fill="#9ca3af" opacity="0.2" />
          <rect x="960" y="250" width="100" height="100" fill="#9ca3af" opacity="0.25" />
          <rect x="1090" y="270" width="110" height="60" fill="#9ca3af" opacity="0.22" />

          {/* Fourth row */}
          <rect x="30" y="380" width="100" height="70" fill="#9ca3af" opacity="0.2" />
          <rect x="150" y="400" width="80" height="90" fill="#9ca3af" opacity="0.25" />
          <rect x="260" y="380" width="110" height="60" fill="#9ca3af" opacity="0.22" />
          <rect x="400" y="390" width="70" height="80" fill="#9ca3af" opacity="0.28" />
          <rect x="500" y="380" width="90" height="100" fill="#9ca3af" opacity="0.2" />
          <rect x="620" y="400" width="100" height="70" fill="#9ca3af" opacity="0.25" />
          <rect x="750" y="380" width="80" height="90" fill="#9ca3af" opacity="0.22" />
          <rect x="860" y="390" width="110" height="80" fill="#9ca3af" opacity="0.3" />
          <rect x="1000" y="380" width="90" height="70" fill="#9ca3af" opacity="0.2" />

          {/* Fifth row */}
          <rect x="0" y="510" width="90" height="80" fill="#9ca3af" opacity="0.25" />
          <rect x="110" y="530" width="120" height="60" fill="#9ca3af" opacity="0.22" />
          <rect x="260" y="510" width="70" height="100" fill="#9ca3af" opacity="0.2" />
          <rect x="360" y="520" width="100" height="80" fill="#9ca3af" opacity="0.28" />
          <rect x="490" y="510" width="80" height="90" fill="#9ca3af" opacity="0.25" />
          <rect x="600" y="530" width="110" height="70" fill="#9ca3af" opacity="0.22" />
          <rect x="740" y="510" width="90" height="80" fill="#9ca3af" opacity="0.3" />
          <rect x="860" y="520" width="70" height="90" fill="#9ca3af" opacity="0.2" />
          <rect x="960" y="510" width="100" height="100" fill="#9ca3af" opacity="0.25" />
          <rect x="1090" y="530" width="110" height="60" fill="#9ca3af" opacity="0.22" />

          {/* Sixth row */}
          <rect x="20" y="640" width="100" height="70" fill="#9ca3af" opacity="0.2" />
          <rect x="150" y="660" width="80" height="90" fill="#9ca3af" opacity="0.25" />
          <rect x="260" y="640" width="110" height="60" fill="#9ca3af" opacity="0.22" />
          <rect x="400" y="650" width="70" height="80" fill="#9ca3af" opacity="0.28" />
          <rect x="500" y="640" width="90" height="100" fill="#9ca3af" opacity="0.2" />
          <rect x="620" y="660" width="100" height="70" fill="#9ca3af" opacity="0.25" />
          <rect x="750" y="640" width="80" height="90" fill="#9ca3af" opacity="0.22" />
          <rect x="860" y="650" width="110" height="80" fill="#9ca3af" opacity="0.3" />
          <rect x="1000" y="640" width="90" height="70" fill="#9ca3af" opacity="0.2" />
        </svg>
      </div>

      <motion.div
        className="w-full max-w-2xl mx-auto relative"
        style={{ scale, rotateY }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Professional chat interface - Gradient Labs inspired */}
        <motion.div
          className="relative w-[75%] h-[480px] mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Professional Header - Financial Services Style */}
          <motion.div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-3"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20m-9-9h18" />
              </svg>
              <span>Trackaro</span>
            </motion.button>

            {/* <motion.button
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold rounded-full border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Budget</span>
          </motion.button> */}
          </motion.div>

          {/* Empty chat content - this is just the white box */}
          <div className="absolute inset-0 mt-[70px]">
            {/* Intentionally empty */}
          </div>
        </motion.div>

        {/* Chat messages container - positioned absolutely over the white box */}
        <div className="absolute inset-0 mt-[70px] px-3 flex flex-col space-y-4 pointer-events-none">
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
                      stiffness: 200,
                      damping: 25,
                      mass: 0.8,
                      delay: index === 0 ? 0.4 : 0.2, // Smoother staggered appearance
                    }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                      } z-30 pointer-events-auto`}
                    style={{
                      width: "95%", // Wider than the white box
                      marginLeft: message.type === "user" ? "0" : "-1%",
                      marginRight: message.type === "user" ? "0" : "0",
                    }}
                  >
                    <div
                      className={`max-w-[400px] md:max-w-[400px] ${message.type === "user"
                        ? "mr-[5px] md:mr-[-5px]" // Reduced negative margin
                        : "ml-[-15px] md:ml-[-30px]" // Reduced negative margin
                        }`}
                    >
                      {/* Message content with fade-in animation */}
                      <motion.div
                        className={`${message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl rounded-tr-sm shadow-lg"
                          : "bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 rounded-xl rounded-tl-sm border border-gray-200 dark:border-gray-600 shadow-lg"
                          } p-3`}
                        initial={{
                          scale: message.type === "user" ? 0.95 : 0.9,
                          opacity: 0,
                          y: message.type === "user" ? 10 : 0
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: 0
                        }}
                        transition={{
                          type: "spring",
                          stiffness: message.type === "user" ? 400 : 300,
                          damping: message.type === "user" ? 30 : 25,
                          delay: message.type === "user" ? 0.2 : 0.1
                        }}
                      >
                        <p className="text-xs md:text-sm">
                          {message.content}
                        </p>
                        {message.type === "ai" && (
                          <motion.div
                            className="flex gap-1.5 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-2 w-2 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                              Trackaro AI
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
