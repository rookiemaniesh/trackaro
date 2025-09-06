"use client";
import react from 'react'
import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";

// Use dynamic import with no SSR to avoid hydration issues
const LandingPage = dynamic(() => import("../components/LandingPage"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <LandingPage />
        {/* New Team Section with Infinite Sliding Animation */}
      </main>
    </div>
  );
}
