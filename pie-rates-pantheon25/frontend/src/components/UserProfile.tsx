"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const { user, updateProfile, isLoading: authLoading } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | undefined>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage(user.profilePicture);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        name,
        email,
        profilePicture: profileImage
      });
      setEditMode(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-trackaro-bg via-trackaro-card to-trackaro-bg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-trackaro-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-trackaro-bg via-trackaro-card to-trackaro-bg">
        <div className="text-center p-8 bg-trackaro-card/80 backdrop-blur-lg rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-trackaro-text">Please log in to view your profile</h2>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-trackaro-accent text-white rounded-xl hover:bg-opacity-90 transition-all font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-trackaro-bg via-trackaro-card to-trackaro-bg p-4">
      <div className="w-full max-w-lg">
        {/* Profile Card */}
        <div className="bg-trackaro-card/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-trackaro-border/30">

          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-trackaro-accent via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8 -mt-16 relative">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-trackaro-card border-4 border-trackaro-card shadow-xl flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-trackaro-accent to-purple-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {editMode ? (
              /* Edit Form */
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-trackaro-accent">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-trackaro-border bg-trackaro-bg/50 text-trackaro-text focus:outline-none focus:ring-2 focus:ring-trackaro-accent/50 transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-trackaro-accent">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-trackaro-border bg-trackaro-bg/30 text-trackaro-text/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-trackaro-accent/60 mt-2">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-trackaro-accent">Profile Image URL</label>
                  <input
                    type="text"
                    value={profileImage || ""}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/your-image.jpg"
                    className="w-full px-4 py-3 rounded-xl border border-trackaro-border bg-trackaro-bg/50 text-trackaro-text focus:outline-none focus:ring-2 focus:ring-trackaro-accent/50 transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-trackaro-accent to-purple-500 text-white rounded-xl hover:opacity-90 transition-all font-medium disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setName(user.name || "");
                      setProfileImage(user.profilePicture);
                      setError("");
                    }}
                    className="flex-1 px-6 py-3 bg-trackaro-bg border border-trackaro-border text-trackaro-text rounded-xl hover:bg-trackaro-border/30 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Profile Display */
              <div className="text-center">
                <h1 className="text-2xl font-bold text-trackaro-text mb-1">{user.name || "User"}</h1>
                <p className="text-trackaro-accent mb-6">{user.email}</p>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-trackaro-bg/50 p-4 rounded-xl border border-trackaro-border/30">
                    <p className="text-xs text-trackaro-accent mb-1">Account ID</p>
                    <p className="text-sm font-medium text-trackaro-text truncate">{user.id}</p>
                  </div>
                  <div className="bg-trackaro-bg/50 p-4 rounded-xl border border-trackaro-border/30">
                    <p className="text-xs text-trackaro-accent mb-1">Member Since</p>
                    <p className="text-sm font-medium text-trackaro-text">Jan 2025</p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-trackaro-accent to-purple-500 text-white rounded-xl hover:opacity-90 transition-all font-medium"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-trackaro-accent hover:underline transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
