"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { register, isLoading: authLoading, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    if (passwordStrength < 2) {
      setError("Please use a stronger password");
      return;
    }

    setIsLoading(true);

    try {
      // Use the register method from AuthContext (backend doesn't require name)
      await register("", email, password);

      // Redirect to dashboard or homepage after signup
      router.push("/chat");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Redirect to Google OAuth endpoint on backend
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/google`;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Google signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    let message = "";

    if (password.length === 0) {
      setPasswordStrength(0);
      setPasswordMessage("");
      return;
    }

    // Check length
    if (password.length >= 8) strength += 1;

    // Check for lowercase and uppercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1;

    // Check for numbers
    if (password.match(/([0-9])/)) strength += 1;

    // Check for special characters
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1;

    // Set message based on strength
    if (strength < 2) {
      message = "Weak";
    } else if (strength === 2) {
      message = "Fair";
    } else if (strength === 3) {
      message = "Good";
    } else {
      message = "Strong";
    }

    setPasswordStrength(strength);
    setPasswordMessage(message);
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
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "bg-red-500";
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
    <>
      <Navbar />
      <div className="min-h-screen bg-trackaro-bg dark:bg-trackaro-bg flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-10">
        {/* Animated background patterns */}
        <div className="absolute inset-0 auth-bg-pattern opacity-10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-trackaro-accent/20 dark:bg-trackaro-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl w-full relative z-10 flex flex-col md:flex-row items-stretch shadow-2xl rounded-2xl overflow-hidden">
          {/* Decorative left panel - hidden on mobile */}
          <div className="hidden md:block w-2/5 bg-trackaro-accent h-full p-8 text-black dark:text-white auth-card">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-6">Join Trackaro</h2>
                <p className="text-black/80 dark:white/80 mb-4">
                  Create an account and start managing your finances smartly
                  with AI-powered insights.
                </p>
                <ul className="mt-8 space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Track expenses with AI
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Split bills seamlessly
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Interactive dashboards
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Secure data protection
                  </li>
                </ul>
              </div>
              <div className="relative h-48">
                {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <div className="w-44 h-44 bg-white/10 rounded-full flex items-center justify-center">
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Signup form */}
          <div className="w-full md:w-3/5 bg-trackaro-card dark:bg-trackaro-card p-8 md:p-10 rounded-2xl auth-card overflow-y-auto">
            <div className="text-center mb-6 auth-elements">
              <h1 className="text-3xl font-bold text-trackaro-text dark:text-on-dark">
                TRAC<span className="text-trackaro-accent">KARO</span>
              </h1>
              <h2 className="mt-6 text-2xl font-semibold text-trackaro-text dark:text-on-dark">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-trackaro-accent dark:text-on-dark">
                Or{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-trackaro-accent hover:underline"
                >
                  sign in to existing account
                </Link>
              </p>
            </div>

            {error && (
              <div
                className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative auth-elements"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSignUp}>
              <div className="space-y-4 auth-elements">
                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-trackaro-text dark:text-on-dark mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-trackaro-border placeholder-trackaro-accent/60 text-trackaro-text dark:text-on-dark focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent focus:z-10 sm:text-sm bg-trackaro-bg dark:bg-trackaro-bg transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-trackaro-text dark:text-on-dark mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-trackaro-border placeholder-trackaro-accent/60 text-trackaro-text dark:text-on-dark focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent focus:z-10 sm:text-sm bg-trackaro-bg dark:bg-trackaro-bg transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-trackaro-text dark:text-on-dark mb-1"
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-trackaro-border placeholder-trackaro-accent/60 text-trackaro-text dark:text-on-dark focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent focus:z-10 sm:text-sm bg-trackaro-bg dark:bg-trackaro-bg transition-all duration-200"
                    placeholder="Create a password"
                  />
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${passwordStrength * 25}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-trackaro-text dark:text-on-dark">
                          {passwordMessage}
                        </span>
                      </div>
                      <ul className="text-xs text-trackaro-accent dark:text-on-dark">
                        <li
                          className={
                            password.length >= 8
                              ? "text-green-500 dark:text-green-400"
                              : ""
                          }
                        >
                          • At least 8 characters
                        </li>
                        <li
                          className={
                            password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)
                              ? "text-green-500 dark:text-green-400"
                              : ""
                          }
                        >
                          • Mix of uppercase & lowercase letters
                        </li>
                        <li
                          className={
                            password.match(/([0-9])/)
                              ? "text-green-500 dark:text-green-400"
                              : ""
                          }
                        >
                          • At least one number
                        </li>
                        <li
                          className={
                            password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)
                              ? "text-green-500 dark:text-green-400"
                              : ""
                          }
                        >
                          • At least one special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-trackaro-text dark:text-on-dark mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-trackaro-border placeholder-trackaro-accent/60 text-trackaro-text dark:text-on-dark focus:outline-none focus:ring-2 focus:ring-trackaro-accent focus:border-transparent focus:z-10 sm:text-sm bg-trackaro-bg dark:bg-trackaro-bg transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center auth-elements">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-trackaro-accent focus:ring-trackaro-accent border-trackaro-border rounded"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 block text-sm text-trackaro-accent dark:text-on-dark"
                >
                  I agree to the{" "}
                  <a href="#" className="text-trackaro-accent hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-trackaro-accent hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div className="auth-elements">
                <button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-trackaro-accent hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trackaro-accent transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {isLoading || authLoading ? (
                    <span className="flex items-center">
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
                      Processing...
                    </span>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 auth-elements">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-trackaro-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-trackaro-card dark:bg-trackaro-card text-trackaro-accent dark:text-on-dark">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading || authLoading}
                  className="w-full flex items-center justify-center px-4 py-3 border border-trackaro-border rounded-lg shadow-sm text-sm font-medium text-trackaro-text dark:text-on-dark bg-trackaro-bg dark:bg-trackaro-bg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-trackaro-accent transition-all duration-300"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
