"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// GSAP removed; animations handled declaratively elsewhere
import { useAuth } from "@/context/AuthContext";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.73 31.657 29.286 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.957 3.043l5.657-5.657C33.64 5.053 28.999 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.814C14.252 16.548 18.74 13 24 13c3.059 0 5.842 1.153 7.957 3.043l5.657-5.657C33.64 5.053 28.999 3 24 3 16.318 3 9.698 7.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 43c5.222 0 9.93-1.999 13.486-5.246l-6.223-5.26C29.211 34.482 26.78 35 24 35c-5.262 0-9.718-3.33-11.296-7.957l-6.55 5.046C9.514 39.775 16.08 43 24 43z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.318 3.731-4.906 6.5-9.303 6.5-5.262 0-9.718-3.33-11.296-7.957l-6.55 5.046C9.514 39.775 16.08 43 24 43c8.955 0 20-6.5 20-20 0-1.341-.138-2.651-.389-3.917z"
    />
  </svg>
);

const LoginPage: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [connectivityStatus, setConnectivityStatus] = useState<string>("");

  // Test connectivity function
  const testConnectivity = async () => {
    setConnectivityStatus("Testing...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        setConnectivityStatus("✅ Backend server is reachable");
      } else {
        setConnectivityStatus(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      setConnectivityStatus(`❌ Cannot reach backend: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Detect mobile device and network info
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        // Get network information for debugging
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        setNetworkInfo(`API: ${apiUrl}`);
      }
    }
  }, []);

  // Prevent scrollbars when page loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Apply custom scrollbar styling to hide scrollbars but allow scrolling
      document.body.classList.add("scrollbar-hide");
      document.body.style.overflow = "auto";

      // Use requestAnimationFrame to ensure we're fully on the client
      requestAnimationFrame(() => {
        setIsMounted(true);
      });

      return () => {
        document.body.classList.remove("scrollbar-hide");
        document.body.style.overflow = "";
      };
    }
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (user) router.replace("/chat");
  }, [user, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password)
      return setError("Please enter email and password.");
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/chat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      // Redirect to backend Google OAuth endpoint
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      window.location.href = `${API_URL}/api/auth/google`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Google login failed. Please try again.");
    }
  };

  return (
    <main className="fixed inset-0 w-full h-full bg-trackaro-bg dark:bg-[#0f0f0f] text-trackaro-text dark:text-white overflow-hidden">
      <div className="mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left: CTA + Auth */}
        <section
          ref={leftRef}
          className="px-6 sm:px-10 py-5 sm:py-16 lg:py-10 flex flex-col items-center overflow-hidden relative"
        >
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">
              Get started with Trackaro
            </h1>

            <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4 flex flex-col items-center">
              <button
                onClick={handleGoogle}
                disabled={isLoading || submitting}
                className="w-full max-w-md h-10 rounded-full bg-white text-[#111] text-sm flex items-center justify-center gap-2.5 shadow-sm border border-black/10 hover:shadow transition"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="w-full flex items-center justify-center gap-3 mt-2">
                <div className="bg-black/20 dark:bg-white/20 h-px flex-grow"></div>
                <span className="text-sm text-black/50 dark:text-white/50">
                  or continue with email
                </span>
                <div className="bg-black/20 dark:bg-white/20 h-px flex-grow"></div>
              </div>
            </div>

            {/* Email form (collapsible) */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showEmailForm
                  ? "max-h-[450px] opacity-100 mt-6 visible"
                  : "max-h-0 opacity-0 invisible absolute pointer-events-none"
              }`}
              style={{
                transform: showEmailForm
                  ? "translateY(0)"
                  : "translateY(-20px)",
                position: showEmailForm ? "relative" : "absolute",
                width: "100%",
              }}
            >
              <form
                onSubmit={handleEmailSubmit}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-5 py-5 space-y-4"
              >
                {error && (
                  <div className="text-sm text-red-500 bg-red-50/80 dark:bg-red-500/10 border border-red-200/60 dark:border-red-500/20 px-3 py-2 rounded-md">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm mb-1 opacity-80">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-md px-3 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 text-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 opacity-80">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 rounded-md px-3 bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href="/auth/forgot"
                    className="opacity-70 hover:opacity-100"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={submitting || isLoading}
                  className="w-full h-10 rounded-md bg-primary text-white dark:bg-white dark:text-black hover:opacity-90 transition disabled:opacity-60 text-sm"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
                <div className="text-center text-sm opacity-80 pt-2">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-trackaro-accent dark:text-blue-400 hover:underline hover:text-blue-600"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>

            <p className="mt-8 max-w-md text-sm opacity-70 text-center">
              By signing in you agree to the{" "}
              <Link
                href="/privacy"
                className="underline hover:opacity-100 opacity-90"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="underline hover:opacity-100 opacity-90"
              >
                Terms of Use
              </Link>
              .
            </p>

            {/* Mobile debugging info */}
            {isMobile && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  Mobile Device Detected
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300">
                  {networkInfo}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-300 mt-1">
                  If login fails, check that your backend server is running and accessible from this device.
                </p>
                
                {/* Connectivity Test */}
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                  <button
                    onClick={testConnectivity}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Test Backend Connection
                  </button>
                  {connectivityStatus && (
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                      {connectivityStatus}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right: dark product mock */}
        <aside
          ref={rightRef}
          className="relative hidden lg:flex items-center justify-center px-6 sm:px-10 py-16 lg:py-24 bg-[#0b0b0b] text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="relative max-w-xl mx-auto">
            {/* Mock frame */}
            <div className="rounded-2xl border border-white/10 bg-[#121212]/80 backdrop-blur p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 text-sm opacity-80">
                <span>Sales pipeline</span>
                <span className="inline-flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3">
                {[1, 2, 3].map((col) => (
                  <div key={col} className="space-y-3">
                    <div className="rounded-lg border border-white/10 bg-white/5 h-28" />
                    <div className="rounded-lg border border-white/10 bg-white/5 h-28" />
                    <div className="rounded-lg border border-white/10 bg-white/5 h-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust row */}
            <div className="mt-10 grid grid-cols-3 gap-6 text-center opacity-80">
              <div>
                <div className="text-3xl font-semibold">4.9</div>
                <div className="text-xs mt-1">Product Hunt</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">4.8</div>
                <div className="text-xs mt-1">Chrome Store</div>
              </div>
              <div>
                <div className="text-3xl font-semibold">4.5</div>
                <div className="text-xs mt-1">G2 Review</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default LoginPage;