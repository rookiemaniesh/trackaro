"use client";

import React from "react";
import UserProfile from "../../components/UserProfile";
import Navbar from "../../components/Navbar";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-trackaro-bg">
        <UserProfile />
      </div>
    </div>
  );
}
