"use client";

import ChatMockup from "@/components/ChatMockup";
import React from "react";
import { motion } from "framer-motion";

export default function MockupPage() {
  return (
      <div className="mt-20">
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
