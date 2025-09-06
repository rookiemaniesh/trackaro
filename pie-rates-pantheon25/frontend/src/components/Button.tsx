"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  initiallyExpanded?: boolean;
  delay?: number;
  icon?: React.ReactNode;
  expandedIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
}

function Button({
  text,
  onClick,
  className = "",
  initiallyExpanded = false,
  delay = 1000,
  icon,
  expandedIcon,
  variant = "primary",
  size = "medium",
}: ButtonProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  // Define sizes based on the size prop
  const sizeStyles = {
    small: {
      circle: "w-10 h-10",
      expanded: "px-5 py-2 text-sm",
      iconSize: 18,
    },
    medium: {
      circle: "w-14 h-14",
      expanded: "px-8 py-3 text-base",
      iconSize: 22,
    },
    large: {
      circle: "w-16 h-16",
      expanded: "px-10 py-4 text-lg",
      iconSize: 24,
    },
  };

  // Define variant styles
  const variantStyles = {
    primary:
      "bg-trackaro-accent text-black dark:bg-white dark:text-black hover:brightness-105",
    secondary: "bg-purple-600 text-white hover:bg-purple-700",
    outline:
      "bg-transparent border-2 border-trackaro-accent text-trackaro-accent dark:border-white dark:text-white hover:bg-trackaro-accent/10",
  };

  // Default icon if none provided
  const defaultIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeStyles[size].iconSize}
      height={sizeStyles[size].iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );

  // Arrow icon for expanded state
  const defaultExpandedIcon = (
    <motion.span
      animate={{ x: [0, 5, 0] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        times: [0, 0.5, 1],
      }}
      className="inline-block"
    >
      →
    </motion.span>
  );

  // Start the expand animation after the specified delay
  useEffect(() => {
    if (!initiallyExpanded) {
      const timer = setTimeout(() => {
        setExpanded(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [initiallyExpanded, delay]);

  return (
    <motion.button
      onClick={onClick}
      className={`group relative overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 
        flex items-center justify-center focus:outline-none ${
          expanded
            ? `rounded-full ${sizeStyles[size].expanded} ${variantStyles[variant]}`
            : `rounded-full ${sizeStyles[size].circle} ${variantStyles[variant]}`
        } ${className}`}
      initial={false}
      animate={{
        width: expanded ? "auto" : sizeStyles[size].circle.split(" ")[0],
        height: expanded
          ? sizeStyles[size].expanded.split(" ")[1]
          : sizeStyles[size].circle.split(" ")[1],
        borderRadius: 9999, // Always keep it rounded (tailwind's rounded-full equivalent)
      }}
      transition={{
        type: "spring",
        stiffness: 400, // Reduced stiffness for smoother motion
        damping: 35, // Increased damping for less oscillation
        mass: 1.2, // Added mass for more natural physics
        velocity: 0.5, // Control initial velocity
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      }}
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth motion
              staggerChildren: 0.1,
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: "easeInOut",
              }}
            >
              {text}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {expandedIcon || defaultExpandedIcon}
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="circle"
            className="flex items-center justify-center"
            initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{
              duration: 0.4,
              ease: [0.175, 0.885, 0.32, 1.275], // Custom ease curve (ease-out-back)
            }}
          >
            {icon || defaultIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Named export
export { Button };
// Default export
export default Button;
// Export the ButtonProps type as well
export type { ButtonProps };
