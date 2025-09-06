"use client";
import React, { useEffect, useRef } from "react";
import { AnimatedTooltip } from "./animated-tooltip";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const people = [
  {
    id: 1,
    name: "Manish Kumar",
    designation: "Full-Stack Developer",
    image: "/team/manish.jpg",
  },
  {
    id: 2,
    name: "Kshitij Shekher",
    designation: "AI/NLP Specialist",
    image: "/team/kshitij.jpg",
  },
  {
    id: 3,
    name: "Rajveer Singh",
    designation: "Backend Developer",
    image: "/team/rajveer.jpg",
  },
  {
    id: 4,
    name: "Arman Hansda",
    designation: "UI/UX Developer",
    image:"/team/armaan.jpg",
  },
  {
    id: 5,
    name: "Himanshu Kumar",
    designation: "Data Specialist",
    image: "/team/himashu.jpg",
  },
];

export function Teams() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const teamWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Initial section fade-in
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.inOut" }
    );

    // Split text animation for title
    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = "";

      // Create spans for each character
      text.split("").forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char; // Use non-breaking space for spaces
        span.style.display = "inline-block";
        span.style.opacity = "0";
        titleRef.current?.appendChild(span);
      });

      // Animate each character
      gsap.to(titleRef.current.children, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        delay: 0.5,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
        },
      });
    }

    // Animate the accent line
    if (accentLineRef.current) {
      gsap.fromTo(
        accentLineRef.current,
        {
          width: 0,
          opacity: 0,
        },
        {
          width: "5rem",
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          delay: 1.5,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        }
      );
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Add animations to timeline
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4" // Start slightly before previous animation ends
    );

    // Animate team members - handle possible undefined correctly
    if (teamWrapperRef.current && teamWrapperRef.current.children.length > 0) {
      // Convert HTMLCollection to array for GSAP
      const teamMembers = Array.from(teamWrapperRef.current.children);

      // Create the main animation timeline
      gsap.fromTo(
        teamMembers,
        {
          opacity: 0,
          scale: 0.8,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15, // Stagger each team member animation
          ease: "back.out(1.4)",
          delay: 0.2, // Small delay after previous animations
        }
      );

      // Add a floating animation for team members
      const floatTimelines: gsap.core.Timeline[] = [];
      const mouseEnterHandlers: ((e: Event) => void)[] = [];
      const mouseLeaveHandlers: ((e: Event) => void)[] = [];

      teamMembers.forEach((member, index) => {
        // Random slight float
        const floatTimeline = gsap.timeline({
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2, // Random delay so they don't all float together
        });

        floatTimeline.to(member, {
          y: "-=8", // Float slightly up
          duration: 2 + Math.random(), // Random duration between 2-3 seconds
          ease: "sine.inOut",
        });

        floatTimelines.push(floatTimeline);

        // Store event handlers for cleanup
        const enterHandler = () => {
          gsap.to(member, {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const leaveHandler = () => {
          gsap.to(member, {
            scale: 1,
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        mouseEnterHandlers.push(enterHandler);
        mouseLeaveHandlers.push(leaveHandler);

        // Add hover effects using event listeners
        member.addEventListener("mouseenter", enterHandler);
        member.addEventListener("mouseleave", leaveHandler);
      });

      // Enhance cleanup function
      return () => {
        // Kill all GSAP animations
        gsap.killTweensOf(teamMembers);
        floatTimelines.forEach((timeline) => timeline.kill());

        // Remove event listeners
        teamMembers.forEach((member, index) => {
          if (mouseEnterHandlers[index]) {
            member.removeEventListener("mouseenter", mouseEnterHandlers[index]);
          }
          if (mouseLeaveHandlers[index]) {
            member.removeEventListener("mouseleave", mouseLeaveHandlers[index]);
          }
        });

        // Kill ScrollTrigger instances
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }

        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        tl.kill();
      };
    }

    // Cleanup
    return () => {
      // Kill all GSAP animations and ScrollTrigger instances
      gsap.killTweensOf([
        sectionRef.current,
        headingRef.current,
        textRef.current,
        titleRef.current,
        accentLineRef.current,
      ]);

      if (titleRef.current && titleRef.current.children) {
        gsap.killTweensOf(titleRef.current.children);
      }

      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center justify-center w-full py-5"
    >
      <h2
        ref={titleRef}
        className="text-3xl font-bold mb-1 text-trackaro-text text-center relative overflow-hidden"
      >
        MEET OUR TEAM
      </h2>
      <div
        ref={accentLineRef}
        className="w-20 h-1 bg-trackaro-accent mt-1"
      ></div>
      <p
        ref={textRef}
        className="text-trackaro-accent mb-18 max-w-3xl text-center"
      >
        Our dedicated team combines expertise in full-stack development, AI/NLP,
        UI/UX design, and data analytics to create a seamless expense tracking
        experience.
      </p>
      <div className="flex items-center justify-center mb-10 w-full">
        <div
          ref={teamWrapperRef}
          className="flex flex-row flex-wrap justify-center items-center gap-5 team-photo-wrapper shadow-none bg-none"
        >
          <AnimatedTooltip items={people} />
        </div>
      </div>
    </div>
  );
}
