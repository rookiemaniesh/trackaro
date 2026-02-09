"use client";

import { useState } from "react";
import GlassChatBox from "./GlassChatBox";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ChatSidebar from "@/components/ChatSidebar";

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    </motion.div>
  );
}