import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import dynamic from "next/dynamic";

// Loading fallback component
const LoadingSkeleton = () => (
  <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
);

const TechnologyPage = dynamic(() => import("./TechnologyPage"), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

interface HeroSectionProps {
  onStartChatting: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartChatting }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Store all animations for cleanup
    const animations: gsap.core.Tween[] = [];

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

    // Cleanup function to kill all animations when component unmounts
    return () => {
      // Kill all animations
      animations.forEach((animation) => {
        if (animation && typeof animation.kill === "function") {
          animation.kill();
        }
      });

      // Kill all tweens
      const elements = [heroRef.current, buttonRef.current, textRef.current].filter(
        Boolean
      );

      gsap.killTweensOf(elements);

      // Cleanup individual elements
      if (textRef.current) {
        gsap.killTweensOf(textRef.current.querySelectorAll("h1, p"));
      }
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-start pt-15 pb-10 dark:from-gray-900 dark:to-gray-800 overflow-hidden rounded-b-3xl border-t-2 border-gray-300 dark:border-gray-600"
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
            <span className="inline-block w-2 h-2 bg-orange-600 rounded-sm mr-2 animate-pulse"></span>
            Finance, Made Easy
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="text-3xl md:text-3xl lg:text-5xl font-bold text-black dark:text-white leading-tight tracking-tight mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          The only AI expense tracker <br />
          built for modern life.
          <br />
          <span
            className="text-black dark:text-gray-200"
            style={{ fontFamily: "Inter, sans-serif" }}
          ></span>
        </h1>

        {/* Description paragraph */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto mb-10">
          An AI-powered expense tracker that simplifies money management. <br />
          Effortless tracking, smart insights, and financial clarity, all in one
          place.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            ref={buttonRef}
            onClick={onStartChatting}
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-100 transform hover:scale-101 shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-3"
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
      <section id="technology">
        <TechnologyPage />
      </section>
    </section>
  );
};

export default HeroSection;
