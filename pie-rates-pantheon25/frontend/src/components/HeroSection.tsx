import React from "react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden h-screen flex items-center">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 max-w-2xl">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          The only customer ops AI agent built for financial services
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Our AI agent resolves complex customer service queries end-to-end.
          Delivering quality, efficiency and compliance at every step.
        </motion.p>

        <motion.button
          className="mt-8 inline-block bg-white text-indigo-700 font-semibold rounded-lg px-8 py-4 hover:bg-gray-100 transition"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          Request a demo
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
