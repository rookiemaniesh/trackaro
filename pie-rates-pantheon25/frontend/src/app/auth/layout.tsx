"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-trackaro-bg relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120, 120, 120, 0.4) 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Back to home link */}
      {/* <div className="absolute top-4 left-4 z-10">
        <a
          href="/"
          className="flex items-center text-trackaro-text hover:text-trackaro-accent transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </a>
      </div> */}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
