"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Google Icon component
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

interface AuthFormProps {
    mode: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
    const router = useRouter();
    const { user, login, register, isLoading } = useAuth();
    const isLogin = mode === "login";

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [staySignedIn, setStaySignedIn] = useState(true);

    // Redirect if already authenticated
    useEffect(() => {
        if (user) router.replace("/chat");
    }, [user, router]);

    const handleGoogle = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            window.location.href = `${API_URL}/api/auth/google`;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Google authentication failed.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) return setError("Please fill in all fields");
        if (!isLogin && password !== confirmPassword) return setError("Passwords do not match");

        setSubmitting(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(fullName, email, password);
            }
            router.replace("/chat");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg || "Authentication failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4 font-sans text-[#333]">
           

            {/* Card */}
            <div className="bg-white w-full max-w-[500px] rounded-xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] sm:px-8 sm:py-6 border border-gray-100/50">
                {/* Header */}
                

                {/* Social Login */}
                <div className="space-y-3 mb-3">
                    <button
                        onClick={handleGoogle}
                        disabled={isLoading || submitting}
                        className="w-full h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.99]"
                    >
                        <GoogleIcon />
                        <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-3">
                    <div className="h-px bg-gray-200 w-full absolute"></div>
                    <span className="bg-white px-3 text-xs font-semibold text-gray-400 tracking-wider relative z-10">OR</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-0.5">
                            <label className="text-sm font-semibold text-gray-700">Full name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#FF8A65] focus:ring-4 focus:ring-[#FF8A65]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 bg-gray-50/30"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#FF8A65] focus:ring-4 focus:ring-[#FF8A65]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 bg-gray-50/30"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            {isLogin && (
                                <Link href="/auth/forgot" className="text-sm font-medium text-[#4A90E2] hover:text-[#357ABD] transition-colors">
                                    Forgot Password?
                                </Link>
                            )}
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#FF8A65] focus:ring-4 focus:ring-[#FF8A65]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 bg-gray-50/30"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:border-[#FF8A65] focus:ring-4 focus:ring-[#FF8A65]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 bg-gray-50/30"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || submitting}
                        className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold rounded-lg  transition-all duration-200 transform active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isLogin ? (submitting ? "Signing in..." : "Sign In") : (submitting ? "Creating account..." : "Sign Up")}
                    </button>

                    <div className="pt- text-center">
                        <p className="text-gray-500 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <Link href={isLogin ? "/auth/signup" : "/auth/login"} className="text-[#4A90E2] hover:text-[#357ABD] font-bold transition-colors ml-1">
                                {isLogin ? "Sign up" : "Sign in"}
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Footer Text */}
            <p className="mt-3 text-xs text-gray-400 text-center max-w-sm leading-relaxed">
                This site is protected by reCAPTCHA and the Google <Link href="/privacy" className="underline hover:text-gray-500">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-gray-500">Terms of Service</Link> apply.
            </p>
        </div>
    );
};

export default AuthForm;
