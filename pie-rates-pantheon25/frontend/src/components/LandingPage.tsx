import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


// Loading fallback component
const LoadingSkeleton = () => (
  <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
);


const TechnologyPage = dynamic(() => import("./TechnologyPage"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [isloggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
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

    // Hero section animation with GSAP
    if (heroRef.current) {
      // Set initial states
      gsap.set(heroRef.current, { opacity: 0, y: 50 });

      // Animate hero container
      const heroAnim = gsap.to(heroRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
      animations.push(heroAnim);
    }

    // Enhanced text animation with GSAP
    if (textRef.current) {
      // Set initial states for all text elements
      const smallHeading = textRef.current.querySelector("div span");
      const mainHeading = textRef.current.querySelector("h1");
      const description = textRef.current.querySelector("p");
      const button = textRef.current.querySelector("button");

      // Set initial states
      gsap.set([smallHeading, mainHeading, description, button], {
        opacity: 0,
        y: 30,
      });

      // Create timeline for sequential animations
      const tl = gsap.timeline({ delay: 0.5 });

      // Small heading animation
      tl.to(smallHeading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
        // Main heading animation with word-by-word effect
        .to(
          mainHeading,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        // Description animation
        .to(
          description,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        // Button animation with bounce effect
        .to(
          button,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );

      // Store timeline for cleanup
      animations.push(tl as any);
    }

    // Button animation is now handled in the text timeline

    // Add floating animation to hero elements
    if (textRef.current) {
      const floatingElements =
        textRef.current.querySelectorAll("h1, p, button");

      floatingElements.forEach((element, index) => {
        gsap.to(element, {
          y: "+=5",
          duration: 2 + index * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2 + index * 0.2,
        });
      });
    }

    // Add hover animations for button
    if (buttonRef.current) {
      const button = buttonRef.current;

      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }

    // Animate background elements
    if (heroRef.current) {
      const bgElements = heroRef.current.querySelectorAll(
        "div[class*='bg-blue-100'], div[class*='bg-orange-100'], div[class*='bg-purple-100']"
      );

      bgElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            scale: 0,
            opacity: 0,
            rotation: 0,
          },
          {
            scale: 1,
            opacity: 0.2,
            rotation: 360,
            duration: 3,
            ease: "power2.out",
            delay: 1 + index * 0.5,
            repeat: -1,
            yoyo: true,
            repeatDelay: 2,
          }
        );
      });
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
    <div className="min-h-screen bg-trackaro-bg ">
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
            className="relative min-h-screen  flex flex-col items-center justify-start pt-15 pb-10 dark:from-gray-900 dark:to-gray-800 overflow-hidden rounded-b-3xl border-t-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: "rgb(250, 247, 240)" }}
          >
            {/* Block Pattern Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1200 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Block pattern - various sized rectangles - faded for hero */}
                <rect
                  x="0"
                  y="0"
                  width="80"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="100"
                  y="20"
                  width="120"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="250"
                  y="0"
                  width="60"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="350"
                  y="30"
                  width="100"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="480"
                  y="10"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="600"
                  y="0"
                  width="120"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="750"
                  y="25"
                  width="90"
                  height="85"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="870"
                  y="5"
                  width="70"
                  height="95"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="970"
                  y="30"
                  width="110"
                  height="65"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="1100"
                  y="0"
                  width="100"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />

                {/* Second row - faded for hero */}
                <rect
                  x="20"
                  y="120"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="150"
                  y="140"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="260"
                  y="120"
                  width="110"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="400"
                  y="130"
                  width="70"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="500"
                  y="120"
                  width="90"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="620"
                  y="140"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="750"
                  y="120"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="860"
                  y="130"
                  width="110"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="1000"
                  y="120"
                  width="90"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />

                {/* Third row - faded for hero */}
                <rect
                  x="0"
                  y="250"
                  width="90"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="110"
                  y="270"
                  width="120"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="260"
                  y="250"
                  width="70"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="360"
                  y="260"
                  width="100"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="490"
                  y="250"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="600"
                  y="270"
                  width="110"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="740"
                  y="250"
                  width="90"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="860"
                  y="260"
                  width="70"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="960"
                  y="250"
                  width="100"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="1090"
                  y="270"
                  width="110"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />

                {/* Fourth row - faded for hero */}
                <rect
                  x="30"
                  y="380"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="150"
                  y="400"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="260"
                  y="380"
                  width="110"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="400"
                  y="390"
                  width="70"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="500"
                  y="380"
                  width="90"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="620"
                  y="400"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="750"
                  y="380"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="860"
                  y="390"
                  width="110"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="1000"
                  y="380"
                  width="90"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />

                {/* Fifth row - faded for hero */}
                <rect
                  x="0"
                  y="510"
                  width="90"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="110"
                  y="530"
                  width="120"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="260"
                  y="510"
                  width="70"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="360"
                  y="520"
                  width="100"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="490"
                  y="510"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="600"
                  y="530"
                  width="110"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="740"
                  y="510"
                  width="90"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="860"
                  y="520"
                  width="70"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="960"
                  y="510"
                  width="100"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="1090"
                  y="530"
                  width="110"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />

                {/* Sixth row - faded for hero */}
                <rect
                  x="20"
                  y="640"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="150"
                  y="660"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="260"
                  y="640"
                  width="110"
                  height="60"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="400"
                  y="650"
                  width="70"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="500"
                  y="640"
                  width="90"
                  height="100"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="620"
                  y="660"
                  width="100"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.05"
                />
                <rect
                  x="750"
                  y="640"
                  width="80"
                  height="90"
                  fill="#9ca3af"
                  opacity="0.04"
                />
                <rect
                  x="860"
                  y="650"
                  width="110"
                  height="80"
                  fill="#9ca3af"
                  opacity="0.06"
                />
                <rect
                  x="1000"
                  y="640"
                  width="90"
                  height="70"
                  fill="#9ca3af"
                  opacity="0.04"
                />
              </svg>
            </div>
            {/* Centered Content */}
            <div ref={textRef} className="max-w-4xl mx-auto px-6 text-center">
              {/* Small italicized heading with bullet */}
              <div className="mb-6">
                <span className="text-l italic text-gray-600 dark:text-gray-400 font-medium">
                  <span className="inline-block w-2 h-2 bg-black dark:bg-white rounded-sm mr-2"></span>
                  Finance, Made Easy
                </span>
              </div>

              {/* Main headline */}
              <h1
                className="text-3xl md:text-3xl lg:text-5xl font-bold text-black dark:text-white leading-tight tracking-tight mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                The only AI expense tracker built for modern life.
                <br />
                <span
                  className="text-black dark:text-gray-200"
                  style={{ fontFamily: "Inter, sans-serif" }}
                ></span>
              </h1>

              {/* Description paragraph */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
                An AI-powered expense tracker that learns your habits and simplifies money management.
Effortless tracking, smart insights, and financial clarity — all in one place.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center">
                <button
                  ref={buttonRef}
                  onClick={handleStartChatting}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  Start Chatting
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

             
            </div>
             <section id="technology" >
            <TechnologyPage />
          </section>
          </section>

         
          {/* Features Section */}
          <section
            id="features"
            ref={featuresRef}
            className="container mx-auto px-6 py-20 border-t-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: "rgb(237, 233, 222)" }}
          >
            <h2 className="text-4xl font-bold text-center text-trackaro-text dark:text-trackaro-text mb-16 relative">
              KEY FEATURES
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-trackaro-accent rounded-full"></span>
            </h2>

            {/* Feature 1: Standalone Platform */}
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 ml-25 ">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Standalone Platform
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  A dedicated and secure platform designed to manage all your
                  financial data, offering a unified and reliable single source
                  of truth for tracking, analyzing, and understanding your
                  expenses.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/Secure Standalone Platform.png"
                  alt="Standalone Platform"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>

            {/* Feature 2: Intuitive Integration */}
            <motion.div
              className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20 ml-25"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 text-center mr-25">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Intuitive Integration
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  Experience the full power of the platform via a Telegram bot.
                  This allows for effortless, conversational data entry without
                  the need for a separate app.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/Intuitive Integration.png"
                  alt="Intuitive Integration"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>

            {/* Feature 3: Natural Language Processing */}
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 text-center ml-25">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Natural Language Processing
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  Our core technology understands human-like conversation,
                  allowing you to add expenses and access complex analytics by
                  simply asking questions.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/nlp.png"
                  alt="Natural Language Processing"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>

            {/* Feature 4: Actionable Insights */}
            <motion.div
              className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20 ml-25"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 text-center mr-25">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Visual Interactive Dashboards
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  Get a holistic view of your financial health with clean,
                  interactive dashboards that provide a deep dive into your
                  spending habits over time.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/visual interactive dashboard.png"
                  alt="Actionable Insights"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>

            {/* Feature 5: Voice Command Integration */}
            <motion.div
              className="flex flex-col lg:flex-row items-center gap-12 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 text-center ml-25">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Voice Command Integration
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  Log expenses by simply speaking to TracKaro, adding another
                  layer of intuitive, hands-free convenience.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/voice command integration.png"
                  alt="Voice Command Integration"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>

            {/* Feature 6: Receipt Scanning */}
            <motion.div
              className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20 ml-25"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="flex-1 text-center mr-25">
                <h3 className="text-4xl font-semibold text-trackaro-text dark:text-trackaro-text mb-6">
                  Receipt Scanning
                </h3>
                <p className="text-xl text-trackaro-accent dark:text-trackaro-accent leading-relaxed opacity-80">
                  Simply upload a photo of your receipt. Our AI uses Optical
                  Character Recognition (OCR) to automatically extract and
                  populate key details like the vendor, date, and total.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.img
                  src="/feature_pic/Receipt Scanning.png"
                  alt="Receipt Scanning"
                  className="max-w-sm h-xs rounded-2xl shadow-lg mr-25"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          </section>

         

          

          {/* Footer */}
          <footer
            className="py-4 border-t border-gray-800 dark:border-gray-700"
            style={{ backgroundColor: "rgb(237, 233, 222)" }}
          >
            <div className="container mx-auto px-6 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                © 2024 Copyright Reserved - Team Pie-Rates
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default LandingPage;
