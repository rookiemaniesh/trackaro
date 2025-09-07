"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center space-x-1">
      <motion.div
        className="w-1 h-1 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0,
        }}
      />
      <motion.div
        className="w-1 h-1 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-1 h-1 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
  );
};

export default LoadingDots;
