"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "../auth.css"; // Import auth.css to access scrollbar-hide utility

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Form rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing on error, will re-render correctly on client
    }
    return this.props.children;
  }
}

// Google Icon component
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
const SignUpPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    // googleLogin,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(true); // Keep email form open by default
  const [isMounted, setIsMounted] = useState(false);


   // Set up scrolling without scrollbars
  useEffect(() => {
    if (typeof window !== "undefined" && leftRef.current) {
      // Apply scrollbar-hide class to the left section
      leftRef.current.classList.add("scrollbar-hide");

      // Use requestAnimationFrame to ensure we're fully on the client
      requestAnimationFrame(() => {
        setIsMounted(true);
      });

      return () => {
        if (leftRef.current) {
          leftRef.current.classList.remove("scrollbar-hide");
        }
      };
    }
  }, []);

   const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

   const checkPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);

    switch (strength) {
      case 0:
        setPasswordMessage("Very weak");
        break;
      case 1:
        setPasswordMessage("Weak");
        break;
      case 2:
        setPasswordMessage("Fair");
        break;
      case 3:
        setPasswordMessage("Good");
        break;
      case 4:
        setPasswordMessage("Strong");
        break;
      default:
        setPasswordMessage("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please use a stronger password");
      return;
    }

    setSubmitting(true);

    try {
      // Use the register method from AuthContext
      await register(fullName, email, password);

      // Redirect to dashboard or homepage after signup
      router.push("/chat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  

  const handleGoogleSignUp = async () => {
     setError(null);
    setSubmitting(true);

    try {
      // Redirect to Google OAuth endpoint on backend
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/google`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Google signup failed. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };


  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  useEffect(() => {
    // Animate form elements on page load
    gsap.fromTo(
      ".auth-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".auth-elements",
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      }
    );
  }, []);

  // Get color for password strength indicator
  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <main className="min-h-screen w-full bg-trackaro-bg dark:bg-[#0f0f0f] text-trackaro-text dark:text-white">
      <div className="mx-auto w-full">
        {/* Left: CTA + Auth */}
        <section
          ref={leftRef}
          className="px-6 sm:px-10 py-12 sm:py-16 lg:py-24 flex flex-col items-center relative overflow-auto scrollbar-hide h-screen lg:w-1/2"
        >
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-center">
              Join Trackaro Today
            </h1>

            <div className="mt-8 sm:mt-10 space-y-3 sm:space-y-4 flex flex-col items-center">
              <button
                onClick={handleGoogleSignUp}
                disabled={submitting || authLoading}
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

              {/* <button
                onClick={() => setShowEmailForm((s) => !s)}
                className={`w-full max-w-md h-10 rounded-full text-sm flex items-center justify-center transition border ${
                  showEmailForm
                    ? "bg-trackaro-accent/90 text-black border-transparent hover:bg-trackaro-accent"
                    : "bg-[#222] text-white border-white/10 hover:bg-[#1a1a1a]"
                }`}
              >
                Continue with email {showEmailForm ? "↑" : "↓"}
              </button> */}
            </div>

            {/* Email form (collapsible) */}
            <div
              className={`transition-all duration-300 overflow-auto scrollbar-hide ${
                showEmailForm
                  ? "opacity-100 mt-6 visible"
                  : "opacity-0 invisible absolute pointer-events-none"
              }`}
              style={{
                transform: showEmailForm
                  ? "translateY(0)"
                  : "translateY(-20px)",
                position: showEmailForm ? "relative" : "absolute",
                width: "100%",
                height: "auto",
                display: showEmailForm ? "block" : "none",
              }}
            >
              <ErrorBoundary>
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md rounded-2xl border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur px-5 py-5 space-y-4 overflow-auto scrollbar-hide"
                >
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium"
                    >
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent"
                      suppressHydrationWarning
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent"
                      suppressHydrationWarning
                    />
                    {password && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Strength: {passwordMessage}</span>
                        </div>
                        <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getPasswordStrengthClass()}`}
                            style={{
                              width: `${(passwordStrength / 4) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-white/10 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 text-trackaro-accent focus:ring-trackaro-accent border-gray-300 rounded"
                      suppressHydrationWarning
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-trackaro-accent hover:text-trackaro-accent/80"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-trackaro-accent hover:text-trackaro-accent/80"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting || authLoading}
                      className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-trackaro-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trackaro-accent"
                    >
                      {submitting || authLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </div>
                </form>
              </ErrorBoundary>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-trackaro-accent hover:text-trackaro-accent/80"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Right: Decorative illustration */}
        <aside
          ref={rightRef}
          className="fixed top-0 right-0 bottom-0 hidden lg:block items-center justify-center px-6 sm:px-10 py-16 lg:py-24 bg-[#0b0b0b] text-white"
          style={{ width: "calc(50% - 0px)", overflow: "hidden" }}
        >
          <div className="h-full w-full flex items-center justify-center">
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
          </div>
        </aside>
      </div>
    </main>
  );
};

export default SignUpPage;
