"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Loading fallback component
const LoadingSkeleton = () => (
  <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
);

// Import components with dynamic loading for better performance
const Teams = dynamic(
  () => import("./Teams").then((mod) => ({ default: mod.Teams })),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
);

const TechnologyPage = dynamic(() => import("./TechnologyPage"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

const ChatMockup = dynamic(() => import("./ChatMockup"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

const Button = dynamic(() => import("./Button"), {
  ssr: false,
});

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [isloggedIn, setLoggedIn] = useState(false);
  const [buttonExpanded, setButtonExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const chatShowcaseRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const dashboardHeaderRef = useRef<HTMLHeadingElement>(null);
  const dashboardContentRef = useRef<HTMLDivElement>(null);
  const dashboardCardRef = useRef<HTMLDivElement>(null);
  const budgetCircleRef = useRef<SVGCircleElement>(null);

  // Navigation handler
  const handleStartChatting = useCallback(() => {
    if (!isloggedIn) {
      router.push("/auth/login");
    } else {
      router.push("/chat");
    }
  }, [isloggedIn, router]);

  // Initialize all animations
  useEffect(() => {
    // Store all animations and scroll triggers for cleanup
    const animations: gsap.core.Tween[] = [];
    const scrollTriggers: ScrollTrigger[] = [];

    // Set loading state to false when animations start
    setIsLoading(false);

    // Hero section animation
    if (heroRef.current) {
      const heroAnim = gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      animations.push(heroAnim);
    }

    // Text animation with stagger
    if (textRef.current) {
      const elements = textRef.current.querySelectorAll("h1, p");
      const textAnim = gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );
      animations.push(textAnim);
    }

    // Button animation (initial appearance only)
    if (buttonRef.current) {
      const buttonAnim = gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 1,
          onComplete: function () {
            // Trigger the expand animation after a delay
            const timer = setTimeout(() => {
              setButtonExpanded(true);
            }, 1000);
            // This doesn't need to return anything
          },
        }
      );
      animations.push(buttonAnim);
    }

    // Features animation
    if (featuresRef.current) {
      const featureCards =
        featuresRef.current.querySelectorAll(".feature-card");

      // Create a scroll trigger for each feature card
      featureCards.forEach((card, index) => {
        const featureTrigger = ScrollTrigger.create({
          trigger: card,
          start: "top bottom-=100",
          once: true, // Only trigger once for better performance
          onEnter: () => {
            const featureAnim = gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 30,
                scale: 0.95,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
                delay: index * 0.1,
              }
            );
            animations.push(featureAnim);
          },
        });
        scrollTriggers.push(featureTrigger);
      });
    }

    // Animate chart bars and progress bars when they come into view
    if (dashboardRef.current) {
      // Animate dashboard section entrance
      gsap.fromTo(
        dashboardRef.current,
        {
          backgroundColor: "rgba(30, 30, 30, 0.5)",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        },
        {
          backgroundColor: "rgba(30, 30, 30, 1)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
          duration: 1.5,
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top bottom-=50",
            end: "top center",
            scrub: true,
          },
        }
      );

      // Animated dashboard header
      if (dashboardHeaderRef.current) {
        const dashboardHeaderText =
          dashboardHeaderRef.current.textContent || "";
        dashboardHeaderRef.current.innerHTML = "";

        // Create letter-by-letter animation for header
        dashboardHeaderText.split("").forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.style.opacity = "0";
          dashboardHeaderRef.current?.appendChild(span);
        });

        gsap.to(dashboardHeaderRef.current.children, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          scrollTrigger: {
            trigger: dashboardHeaderRef.current,
            start: "top bottom-=150",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Dashboard card reveal animation
      if (dashboardCardRef.current) {
        gsap.fromTo(
          dashboardCardRef.current,
          {
            y: 100,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: dashboardCardRef.current,
              start: "top bottom-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate chart bars
      const bars = dashboardRef.current.querySelectorAll(".bar-chart > div");
      gsap.fromTo(
        bars,
        { height: 0 },
        {
          height: (index, target) => target.getAttribute("data-height") || "0%",
          duration: 1.2,
          stagger: 0.1,
          ease: "elastic.out(1, 0.3)",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reset",
          },
        }
      );

      // Animate progress bars
      const progressBars = dashboardRef.current.querySelectorAll(
        ".progress-bar > div"
      );

      // First flash all progress bar containers
      gsap.fromTo(
        dashboardRef.current.querySelectorAll(".progress-bar"),
        { opacity: 0.3, backgroundColor: "rgba(255, 255, 255, 0.1)" },
        {
          opacity: 1,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reset",
          },
        }
      );

      // Then animate the progress bars with a slight delay
      gsap.fromTo(
        progressBars,
        { width: 0 },
        {
          width: (index, target) => target.getAttribute("data-width") || "0%",
          duration: 1.5,
          stagger: 0.15,
          delay: 0.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none reset",
          },
        }
      );

      // Animate budget circle
      if (budgetCircleRef.current) {
        // Create circular progress animation
        gsap.fromTo(
          budgetCircleRef.current,
          { strokeDashoffset: 283 }, // Full circle circumference (2πr where r ≈ 45)
          {
            strokeDashoffset: 71, // 75% progress (283 * (1 - 0.75))
            duration: 2,
            delay: 0.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: budgetCircleRef.current,
              start: "top bottom-=50",
              toggleActions: "play none none reset",
            },
          }
        );

        // Add a pulse animation to the budget circle
        gsap.to(budgetCircleRef.current, {
          strokeWidth: 6,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2.5,
          scrollTrigger: {
            trigger: budgetCircleRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none reset",
          },
        });
      }
    }

    // Chat showcase animation
    if (chatShowcaseRef.current) {
      const messages = chatShowcaseRef.current.querySelectorAll(".message");
      gsap.fromTo(
        messages,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: chatShowcaseRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Cleanup function to kill all animations when component unmounts
    return () => {
      // Kill all scroll triggers
      scrollTriggers.forEach((trigger) => {
        if (trigger && typeof trigger.kill === "function") {
          trigger.kill();
        }
      });

      // Kill all animations
      animations.forEach((animation) => {
        if (animation && typeof animation.kill === "function") {
          animation.kill();
        }
      });

      // For complete cleanup
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }

      // Kill all tweens
      const elements = [
        heroRef.current,
        buttonRef.current,
        textRef.current,
        featuresRef.current,
        dashboardRef.current,
        dashboardHeaderRef.current,
        dashboardCardRef.current,
        dashboardContentRef.current,
        budgetCircleRef.current,
        chatShowcaseRef.current,
      ].filter(Boolean);

      gsap.killTweensOf(elements);

      // Cleanup individual elements
      if (textRef.current) {
        gsap.killTweensOf(textRef.current.querySelectorAll("h1, p"));
      }

      if (featuresRef.current) {
        gsap.killTweensOf(
          featuresRef.current.querySelectorAll(".feature-card")
        );
      }

      if (chatShowcaseRef.current) {
        gsap.killTweensOf(chatShowcaseRef.current.querySelectorAll(".message"));
      }

      if (dashboardRef.current) {
        gsap.killTweensOf(
          dashboardRef.current.querySelectorAll(".bar-chart > div")
        );
        gsap.killTweensOf(
          dashboardRef.current.querySelectorAll(".progress-bar")
        );
        gsap.killTweensOf(
          dashboardRef.current.querySelectorAll(".progress-bar > div")
        );
      }

      if (dashboardHeaderRef.current && dashboardHeaderRef.current.children) {
        gsap.killTweensOf(dashboardHeaderRef.current.children);
      }
    };
  }, []);

  // Navigation handler defined only once as a useCallback
  // We already have this defined above, so removing the duplicate

  return (
    <div className="min-h-screen bg-trackaro-bg dark:bg-trackaro-bg">
      {isLoading ? (
        // Loading skeleton
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="h-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-3/4 mx-auto mb-6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-full mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg w-5/6 mb-8"></div>
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full mx-auto"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section
            id="hero"
            ref={heroRef}
            className="relative container mx-auto px-6 py-24 flex flex-col items-center justify-center "
          >
            {/* Animated Background Glow */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-trackaro-accent opacity-20 blur-3xl rounded-full animate-pulse-slow -translate-x-1/2"></div>
            </div>

            {/* Centered Text */}
            <div ref={textRef} className="max-w-3xl text-center">
              <h1 className="text-6xl font-extrabold text-trackaro-text dark:text-on-dark leading-tight tracking-tight">
                TRAC
                <span className="relative inline-block">
                  <span className="text-black">KARO</span>
                </span>
              </h1>
              <span className="block mt-2 text-3xl font-semibold text-trackaro-text dark:text-on-dark">
                Finance Assistant, Reimagined
              </span>

              <p className="text-xl text-trackaro-accent dark:text-on-dark mt-6 mb-4 font-light">
                Experience expense tracking through natural conversation — as
                easy as chatting with a friend.
              </p>
              <p className="text-base text-trackaro-accent dark:text-on-dark mb-10 opacity-80">
                Log expenses, split bills, scan receipts, and get intelligent
                insights — all through a simple chat interface.
              </p>
            </div>

            {/* Animated Button */}
            <div className="flex justify-center z-10 relative mb-8">
              <Button
                text="Start Chat"
                onClick={handleStartChatting}
                className="font-semibold bg-black shadow-xl"
                size="large"
                initiallyExpanded={false}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="90"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                }
              />
            </div>

            {/* Floating Chat Mockup Below */}
            <motion.div
              className="m-15 w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.2,
              }}
            >
              <ChatMockup />
            </motion.div>
          </section>

          <section id="technology" className="m-0">
            <TechnologyPage />
          </section>
          {/* Features Section */}
          <section
            id="features"
            ref={featuresRef}
            className="container mx-auto px-6 py-5 my-3"
          >
            <h2 className="text-3xl font-bold text-center text-trackaro-text dark:text-on-dark mb-10 relative">
              KEY FEATURES
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-trackaro-accent rounded-full"></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-on-dark text-4xl mb-4 flex justify-center">
                  💰
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-on-dark mb-3 text-center">
                  Standalone Platform
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-on-dark text-center text-sm">
                  A dedicated, secure platform for your financial data,
                  providing a single source of truth for all your expenses.
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  💬
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Intuitive Integration
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Experience the full power of the platform via a Telegram bot.
                  This allows for effortless, conversational data entry without
                  the need for a separate app.
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  🧠
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Natural Language Processing
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Our core technology understands human-like conversation,
                  allowing you to add expenses and access complex analytics by
                  simply asking questions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  📊
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Actionable Insights
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Get real-time, personalized financial summaries and reports
                  directly in your chat, turning raw data into clear, actionable
                  information.
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  🎤
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Voice Command Integration
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Log expenses by simply speaking to TracKARO, adding another
                  layer of intuitive, hands-free convenience.
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  👥
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Smart Expense Splitting
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  With a single message like &quot;Dinner with Rahul and
                  Meera,&quot; TracKARO automatically logs the expense and
                  intelligently divides it among the specified group.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  🏷️
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Category Auto-Detection
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  The system intelligently identifies vendors and automatically
                  tags the expense. For example, any transaction from Swiggy is
                  logged under &quot;Food,&quot; while Uber is tagged as
                  &quot;Travel.&quot;
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  📈
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Visual Interactive Dashboards
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Get a holistic view of your financial health with clean,
                  interactive dashboards that provide a deep dive into your
                  spending habits over time.
                </p>
              </div>

              <div className="feature-card bg-trackaro-card dark:bg-trackaro-card p-6 border border-trackaro-border dark:border-trackaro-border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-trackaro-accent dark:text-trackaro-accent text-4xl mb-4 flex justify-center">
                  📷
                </div>
                <h3 className="text-xl font-semibold text-trackaro-text dark:text-trackaro-text mb-3 text-center">
                  Receipt Scanning
                </h3>
                <div className="w-12 h-1 bg-trackaro-accent bg-opacity-30 mx-auto mb-4 rounded-full"></div>
                <p className="text-trackaro-accent dark:text-trackaro-accent text-center text-sm">
                  Simply upload a photo of your receipt. Our AI uses Optical
                  Character Recognition (OCR) to automatically extract and
                  populate key details like the vendor, date, and total.
                </p>
              </div>
            </div>
          </section>

          {/* Dashboard Preview Section */}
          <section
            id="dashboard"
            ref={dashboardRef}
            className="bg-black dark:bg-trackaro-card py-20"
          >
            <div className="container mx-auto px-6">
              <h2
                ref={dashboardHeaderRef}
                className="text-3xl font-bold text-center text-trackaro-text dark:text-trackaro-text mb-16 relative"
              >
                INTERACTIVE DASHBOARDS
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-trackaro-accent rounded-full"></span>
              </h2>

              <div
                ref={dashboardCardRef}
                className="w-full max-w-4xl mx-auto bg-trackaro-bg rounded-lg shadow-xl overflow-hidden border border-trackaro-border"
              >
                <div className="bg-secondary dark:bg-secondary  text-black dark:text-white p-4 flex justify-between items-center">
                  <div className="font-semibold">Your Financial Dashboard</div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                    <div className="w-3 h-3 rounded-full bg-black dark:bg-white bg-opacity-70"></div>
                    <div className="w-3 h-3 rounded-full bg-black dark:bg-white bg-opacity-40"></div>
                  </div>
                </div>

                <div ref={dashboardContentRef} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/3 bg-trackaro-card p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-trackaro-text mb-4">
                        Monthly Spending Trend
                      </h3>
                      <div className="h-60 w-full bg-white bg-opacity-5 rounded-md p-3">
                        {/* Mock Chart */}
                        <div className="relative h-full w-full flex items-end">
                          <div className="absolute inset-0 flex flex-col justify-between">
                            <div className="border-b border-trackaro-border border-opacity-20"></div>
                            <div className="border-b border-trackaro-border border-opacity-20"></div>
                            <div className="border-b border-trackaro-border border-opacity-20"></div>
                            <div className="border-b border-trackaro-border border-opacity-20"></div>
                            <div className="border-b border-trackaro-border border-opacity-20"></div>
                          </div>
                          <div className="bar-chart w-full h-full flex items-end justify-between relative z-10">
                            <div
                              data-height="30%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="45%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="60%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="40%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="75%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="55%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                            <div
                              data-height="85%"
                              className="w-8 bg-trackaro-accent rounded-t-sm mx-1"
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-3 text-xs text-trackaro-accent">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                          <span>Jul</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col gap-4">
                      <div className="bg-trackaro-card p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-trackaro-text mb-3">
                          Expense Breakdown
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-trackaro-accent">Food</span>
                              <span className="text-trackaro-accent">35%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-1 progress-bar">
                              <div
                                data-width="35%"
                                className="h-full bg-trackaro-accent rounded-full"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-trackaro-accent">
                                Transportation
                              </span>
                              <span className="text-trackaro-accent">25%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-1 progress-bar">
                              <div
                                data-width="25%"
                                className="h-full bg-trackaro-accent rounded-full"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-trackaro-accent">
                                Shopping
                              </span>
                              <span className="text-trackaro-accent">20%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-1 progress-bar">
                              <div
                                data-width="20%"
                                className="h-full bg-trackaro-accent rounded-full"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-trackaro-accent">
                                Entertainment
                              </span>
                              <span className="text-trackaro-accent">15%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-1 progress-bar">
                              <div
                                data-width="15%"
                                className="h-full bg-trackaro-accent rounded-full"
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-trackaro-accent">
                                Other
                              </span>
                              <span className="text-trackaro-accent">5%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full mt-1 progress-bar">
                              <div
                                data-width="5%"
                                className="h-full bg-trackaro-accent rounded-full"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-trackaro-card p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-trackaro-text mb-2">
                          Monthly Budget
                        </h3>
                        <div className="flex items-center justify-center">
                          <div className="relative w-28 h-28">
                            {/* SVG Circle for better animation */}
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              {/* Background circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke="#374151"
                                strokeWidth="4"
                              />
                              {/* Animated progress circle */}
                              <circle
                                ref={budgetCircleRef}
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke="#6366f1"
                                strokeWidth="4"
                                strokeDasharray="283"
                                strokeDashoffset="283"
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                              />
                              {/* Center text */}
                              <text
                                x="50"
                                y="50"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#6366f1"
                                fontSize="18"
                                fontWeight="bold"
                                className="text-trackaro-accent"
                              >
                                75%
                              </text>
                            </svg>
                          </div>
                        </div>
                        <p className="text-center text-xs text-trackaro-accent mt-2">
                          ₹15,000 / ₹20,000
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-trackaro-card p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-trackaro-text mb-3">
                      Recent Transactions
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 border-b border-trackaro-border border-opacity-20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-trackaro-accent bg-opacity-20 flex items-center justify-center text-trackaro-accent">
                            🍽️
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-trackaro-text">
                              Taj Hotel
                            </div>
                            <div className="text-xs text-trackaro-accent">
                              Yesterday
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-trackaro-text">
                          -₹1,200
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-trackaro-border border-opacity-20">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-trackaro-accent bg-opacity-20 flex items-center justify-center text-trackaro-accent">
                            🚗
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-trackaro-text">
                              Uber
                            </div>
                            <div className="text-xs text-trackaro-accent">
                              Today
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-trackaro-text">
                          -₹500
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-trackaro-accent bg-opacity-20 flex items-center justify-center text-trackaro-accent">
                            🍕
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-trackaro-text">
                              Italian Bistro
                            </div>
                            <div className="text-xs text-trackaro-accent">
                              June 2
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-trackaro-text">
                          -₹850
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final Call to Action */}
          <section
            id="about"
            className="bg-trackaro-accent text-black dark:text-white py-10"
          >
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Simplify Your Finances?
              </h2>
              <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
                Join thousands of users who have transformed how they track,
                split, and manage expenses with TracKARO.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                  onClick={handleStartChatting}
                  className="group bg-white text-black text-trackaro-accent px-8 py-3 text-lg font-medium 
                border-2 border-white hover:bg-trackaro-border hover:bg-opacity-10 transform transition-all 
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white
                flex items-center space-x-2 rounded-md shadow-lg hover:shadow-xl min-w-[200px]"
                >
                  <span>Get Started</span>
                  <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300 ease-in-out">
                    →
                  </span>
                </button>

                <button
                  className="group bg-transparent text-black dark:text-white dark:hover:text-black px-8 py-3 text-lg font-medium 
                border-2 border-white hover:bg-white hover:bg-opacity-10 transform transition-all 
                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white
                flex items-center space-x-2 rounded-md min-w-[200px]"
                >
                  <span>Watch Demo</span>
                  <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300 ease-in-out">
                    ▶
                  </span>
                </button>
              </div>
            </div>
          </section>
          <div id="teams" className="bg-trackaro-card py-10">
            <Teams />
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
