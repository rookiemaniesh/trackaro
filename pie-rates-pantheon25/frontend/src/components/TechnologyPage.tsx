import { useRef, useEffect} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue
} from "framer-motion";
import gsap from "gsap";

let TextPlugin: any;

if (typeof window !== "undefined") {
  TextPlugin = require("gsap/TextPlugin").TextPlugin;
  gsap.registerPlugin(TextPlugin);
}

const CARD_WIDTH = 80; // Width of each technology card (decreased more)
const CARD_GAP = 12; // Gap between cards (decreased more)


interface TechCardProps {
  icon: React.ReactNode;
  name: string;
  color: string;
  index: number;
}

const TechCard: React.FC<TechCardProps> = ({ icon, name }) => {
  return (
    <div className="flex gap-4 items-center py-1 px-2 rounded-lg border-gray-600/20 transition-all group">
      <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-lg font-medium whitespace-nowrap text-black/90 group-hover:font-normal transition-all"
        style={{ fontFamily: "Inter, sans-serif" }}>
        {name}
      </span>
    </div>
  );
};

interface TechItem {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const InfiniteMovingCards = ({ techItems }: { techItems: TechItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const baseVelocity = -0.3; // Speed for smooth loop

  // Calculate total width of all cards plus gaps for one set
  const singleSetWidth = techItems.length * (CARD_WIDTH + CARD_GAP);

  useAnimationFrame((time, delta) => {
    if (!containerRef.current) return;

    // Calculate new X position
    let newX = x.get() + baseVelocity * (delta / 10);

    // Reset position when we've moved one full set width (for seamless looping)
    if (newX < -singleSetWidth) {
      newX = 0; // Reset to beginning for perfect loop
    }

    x.set(newX);
  });

  return (
    <div className="relative overflow-hidden">
      <motion.div ref={containerRef} className="flex gap-4 py-4" style={{ x }}>
        {/* First set of cards */}
        {techItems.map((item, index) => (
          <TechCard
            key={`card-1-${index}`}
            icon={item.icon}
            name={item.name}
            color={item.color}
            index={index}
          />
        ))}

        {/* Duplicate set for seamless loop - positioned exactly after the first set */}
        {techItems.map((item, index) => (
          <TechCard
            key={`card-2-${index}`}
            icon={item.icon}
            name={item.name}
            color={item.color}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default function TechnologyPage() {
  const subHeadingRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a GSAP timeline for coordinated animations
    const tl = gsap.timeline();

    // Set initial states
    gsap.set(subHeadingRef.current, {
      opacity: 0,
      y: 20
    });

    // Animate sub-heading entrance
    tl.to(
      subHeadingRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      }
    );

    // Reveal the moving cards with a nice fade-in
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  // Define technology items with their icons
  const techItems = [
    {
      name: "Next.js",
      color: "gray-800 dark:white",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#000000" // Next.js black color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full dark:fill-white"
        >
          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
        </svg>
      ),
    },
    {
      name: "Node.js",
      color: "green-600",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#539E43" // Node.js green color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.7.47 1.38 0 2.17-.84 2.17-2.3V9.16c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.23v8.57c0 .63-.64 1.25-1.7.72L4.6 17.5c-.06-.04-.1-.1-.1-.17V7.98c0-.07.04-.14.1-.17l7.46-4.3c.06-.04.13-.04.2 0l7.45 4.3c.06.03.1.1.1.17v9.37c0 .08-.04.14-.1.18l-7.44 4.3c-.06.03-.13.03-.2 0l-1.9-1.13c-.06-.04-.14-.03-.18 0-.52.3-1.62.84-2.15.62-.58-.25-.14-1.06.63-1.5l2.5-1.5c.12-.08.2-.22.2-.38V12c0-.13-.08-.26-.2-.3-1.64-.78-1.36-1.1-2.18-1.26-.13-.03-.28.05-.35.16L12.27 12c-.12.17.02.4.23.4h3c.13 0 .22.1.22.22v9.38c0 .84-.45 1.65-1.2 2.08-1.63.94-4.03-.17-3.8-2.08.03-.27-.2-.5-.47-.5-1.7 0-2.2.08-2.64.17-.1.02-.17.12-.17.22 0 2.67 5.3 3.1 7.13 1.94 1.33-.83 2.12-2.24 2.12-3.8V12.2c0-.14.1-.24.22-.24 1.37.03 1.26.28 2.2-.95.1-.14.05-.33-.12-.4L12.9 8.1c-.23-.13-.1-.37.14-.37 1.5.25 1.8-.63 3.18.97.07.08.17.12.27.08l1.67-.7c.23-.1.3-.38.14-.57C17.26 5.9 14.86 2 12 2c-.26 0-.52.06-.77.2l-7.44 4.3" />
        </svg>
      ),
    },
    {
      name: "Express",
      color: "gray-600 dark:gray-300",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#7E7E7E" // Express gray color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full dark:fill-gray-300"
        >
          <path d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 1.605-5.25h2.02c.387 4.477-1.235 7.292-3.881 7.918C3.764 21.436.17 17.268.002 11.576zm1.074-1.075h9.895c-.108-3.276-2.926-5.147-4.892-5.147-3.044 0-4.895 2.547-5.003 5.147z" />
        </svg>
      ),
    },
    {
      name: "Prisma",
      color: "blue-600",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#2D3748" // Prisma dark blue color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7566-.5023-.0293-.9553.1907-1.2058.584L2.266 15.1291c-.2764.4332-.2815.9614-.0137 1.3995l2.9857 4.8751c.2822.4605.7699.6817 1.2859.6817.1699 0 .3364-.0236.4959-.0702l14.0397-4.0088c.4058-.1159.7202-.3917.8849-.7746.1644-.3831.1558-.8149-.0215-1.1903l-.0461-.0861ZM7.526 18.4432l-1.7095-2.7945c-.141-.2303-.1393-.511.0045-.7271L9.816 6.6177l3.5 7.4055c.0249.0528.0249.1124.0004.1651-.0247.0526-.0732.0981-.1344.1262l-5.6555 2.1283.0004.0004Z" />
        </svg>
      ),
    },
    {
      name: "TypeScript",
      color: "blue-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#3178C6" // TypeScript blue color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
        </svg>
      ),
    },
    {
      name: "Framer-Motion",
      color: "purple-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#9333EA" // Framer Motion purple color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M4 0h16v8h-8zm0 8h8l8 8H4zm0 8h8v8z" />
        </svg>
      ),
    },
    {
      name: "TailwindCSS",
      color: "sky-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#0EA5E9" // Tailwind sky blue color
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
        </svg>
      ),
    },
    {
      name: "Pydantic",
      color: "pink-600",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#D946EF" // Pink-600
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-2 16l-4-4 1.41-1.41L10 15.17l6.59-6.59L18 10l-8 8z" />
        </svg>
      ),
    },
    {
      name: "Python",
      color: "yellow-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#EAB308" // Yellow-500
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
    {
      name: "Gemini",
      color: "blue-400",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#60A5FA" // Blue-400
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 2L15.09 8.26L22 12L15.09 15.74L12 22L8.91 15.74L2 12L8.91 8.26L12 2Z" />
        </svg>
      ),
    },
    {
      name: "Docker",
      color: "blue-600",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#2563EB" // Blue-600
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM7.5 10.5l4.5 2.6 4.5-2.6L12 7.9 7.5 10.5zm4.5-8.1l6.9 4-2.2 1.3-4.7-2.7V2.4zm-7.9 5.3l6.9-4v2.6L7.2 9l-3.1-1.3zM4.1 16l-1.1-1.9 3.1-4.5 3.1 4.5-1.1 1.9H4.1zm11.8 0l-1.1-1.9 3.1-4.5 3.1 4.5-1.1 1.9h-4z" />
        </svg>
      ),
    },
    {
      name: "Redis",
      color: "red-600",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#DC2626" // Red-600
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 2.5c5.33 0 10 1.67 10 4.17v10.66c0 2.5-4.67 4.17-10 4.17S2 19.83 2 17.33V6.67c0-2.5 4.67-4.17 10-4.17zm0 2.08c-3.6 0-7.05.8-7.92 2.09.87 1.28 4.32 2.08 7.92 2.08 3.6 0 7.05-.8 7.92-2.08-.87-1.29-4.32-2.09-7.92-2.09zM2.08 6.67v5.33c0 2.5 4.67 4.17 10 4.17s10-1.67 10-4.17V6.67c-.87 1.29-4.32 2.09-7.92 2.09-3.6 0-7.05-.8-7.92-2.09z" />
        </svg>
      ),
    },
    {
      name: "AWS",
      color: "orange-500",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="#F97316" // Orange-500
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5S14.463 8 17.5 8s5.5 2.463 5.5 5.5-2.463 5.5-5.5 5.5z M6.5 19C3.463 19 1 16.537 1 13.5S3.463 8 6.5 8s5.5 2.463 5.5 5.5S9.537 19 6.5 19z M12 11c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Technology Stack Section */}
      <div
        style={{ backgroundColor: "rgb(250, 247, 240)" }}>
        <div className="flex flex-col text-black w-full max-w-6xl mx-auto px-6">
          <div className="text-center mt-14 mb-4">

            <p
              ref={subHeadingRef}
              className="text-gray-500 tracking-wide text-xl md:text-xl max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Built with
            </p>
          </div>

          <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <InfiniteMovingCards techItems={techItems} />
          </div>
        </div>
      </div>
    </>
  );
}
