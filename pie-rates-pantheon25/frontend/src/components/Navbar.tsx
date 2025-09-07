"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Icons from lucide-react, commonly used with shadcn/ui
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MountainIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
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
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const Navbar = () => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Check if we're on an auth page
  const isAuthPage = pathname?.includes("/auth/");
  // Check if we're on the chat page
  const isChatPage = pathname === "/chat";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation links data
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#features", label: "Features" },
    { href: "/#about", label: "About" },
    // { href: "/#dashboard", label: "Dashboard" },
    { href: "/#teams", label: "Teams" },
  ];

  // Function to handle navigation with smooth scrolling for anchor links
  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // If it's an anchor link on the homepage
    if (href.startsWith("/#") && pathname === "/") {
      const targetId = href.substring(2); // Remove the '/#'
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Smooth scroll to the element
        targetElement.scrollIntoView({ behavior: "smooth" });
        // Close mobile menu if open
        setIsMenuOpen(false);
      }
    } else if (href.startsWith("/#") && pathname !== "/") {
      // If it's an anchor link but we're not on the homepage
      router.push(href);
    } else {
      // Regular navigation
      router.push(href);
      // Close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-trackaro-bg/80 dark:bg-trackaro-bg/80 backdrop-blur-sm sticky top-0 z-50 w-full" style={{ backgroundColor: 'rgb(250, 247, 240)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <a
              href="/"
              onClick={(e) => handleNavigation(e, "/")}
              className="flex items-center gap-2 transition-all duration-300 hover:opacity-80 group"
            >
              <MountainIcon className="h-6 w-6 text-trackaro-text dark:text-trackaro-text transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg font-semibold text-trackaro-text dark:text-on-dark group-hover:text-trackaro-accent transition-colors duration-300">
                TRACKARO
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className="nav-link text-sm font-medium text-trackaro-accent dark:text-on-dark hover:text-trackaro-text dark:hover:text-on-dark transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-trackaro-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button, Theme Toggle and Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {!isAuthPage && !isChatPage && !isAuthenticated && (
              <>
                <a
                  href="/auth/login"
                  onClick={(e) => handleNavigation(e, "/auth/login")}
                  className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-trackaro-accent bg-primary  text-white dark:bg-white dark:text-black hover:bg-trackaro-accent hover:text-white dark:hover:bg-trackaro-accent dark:hover:text-black transition-all duration-300 transform hover:scale-105"
                >
                  <span>Log In</span>
                </a>
                <a
                  href="/auth/signup"
                  onClick={(e) => handleNavigation(e, "/auth/signup")}
                  className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-trackaro-accent 
                  shadow-md dark:shadow-gray-800/20 dark:hover:shadow-white-800/40 dark:bg-trackaro-accent text-black  dark:text-white hover:bg-primary-hover dark:hover:bg-secondary transition-all duration-300 transform hover:scale-105"
                >
                  <span>Sign Up</span>
                  {/* <span className="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                  →
                  </span> */}
                </a>
              </>
            )}

            {isChatPage && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex items-center justify-center rounded-full h-10 w-10 bg-trackaro-accent/10 hover:bg-trackaro-accent/20 text-trackaro-accent dark:text-white transition-all duration-300"
                  aria-label="User profile"
                >
                  <UserIcon className="h-6 w-6" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary dark:bg-trackaro-bg border border-trackaro-border dark:border-trackaro-border overflow-hidden z-50 py-1">
                    <div className="px-4 py-3 border-b border-trackaro-border dark:border-trackaro-border">
                      <p className="text-sm font-medium text-trackaro-text dark:text-on-dark">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-trackaro-text/70 dark:text-on-dark/70 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    <a
                      href="/profile"
                      onClick={(e) => handleNavigation(e, "/profile")}
                      className="flex items-center px-4 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      View Profile
                    </a>

                    <a
                      href="/settings"
                      onClick={(e) => handleNavigation(e, "/settings")}
                      className="flex items-center px-4 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                    >
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </a>

                    <div className="border-t border-trackaro-border dark:border-trackaro-border my-1"></div>

                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        await logout();
                        router.push("/");
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 w-full text-left"
                    >
                      <LogoutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Show profile icon for authenticated users on other pages */}
            {!isAuthPage && !isChatPage && isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="hidden sm:flex items-center justify-center rounded-full h-10 w-10 bg-trackaro-accent/10 hover:bg-trackaro-accent/20 text-trackaro-accent dark:text-white transition-all duration-300"
                  aria-label="User profile"
                >
                  <UserIcon className="h-6 w-6" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary dark:bg-trackaro-bg border border-trackaro-border dark:border-trackaro-border overflow-hidden z-50 py-1">
                    <div className="px-4 py-3 border-b border-trackaro-border dark:border-trackaro-border">
                      <p className="text-sm font-medium text-trackaro-text dark:text-on-dark">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-trackaro-text/70 dark:text-on-dark/70 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>

                    <a
                      href="/profile"
                      onClick={(e) => handleNavigation(e, "/profile")}
                      className="flex items-center px-4 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      View Profile
                    </a>

                    <a
                      href="/chat"
                      onClick={(e) => handleNavigation(e, "/chat")}
                      className="flex items-center px-4 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Go to Chat
                    </a>

                    <div className="border-t border-trackaro-border dark:border-trackaro-border my-1"></div>

                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        await logout();
                        router.push("/");
                      }}
                      className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 w-full text-left"
                    >
                      <LogoutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-trackaro-accent dark:text-trackaro-accent hover:text-trackaro-text dark:hover:text-trackaro-text hover:bg-trackaro-border dark:hover:bg-trackaro-border focus:outline-none focus:ring-2 focus:ring-inset focus:ring-trackaro-accent dark:focus:ring-trackaro-accent transition-all duration-300 transform hover:rotate-180"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Sheet) */}
      {isMenuOpen && (
        <div
          className="md:hidden border-t border-trackaro-border dark:border-trackaro-border"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className="text-trackaro-accent dark:text-on-dark hover:bg-trackaro-border dark:hover:bg-trackaro-border hover:text-trackaro-text dark:hover:text-on-dark block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 border-l-0 hover:border-l-4 hover:border-trackaro-accent hover:pl-4"
              >
                {link.label}
              </a>
            ))}

            {!isAuthPage && !isChatPage && !isAuthenticated && (
              <>
                <a
                  href="/auth/login"
                  onClick={(e) => handleNavigation(e, "/auth/login")}
                  className="w-full mt-2 text-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-trackaro-accent text-trackaro-accent hover:bg-trackaro-accent hover:text-white flex transition-all duration-300"
                >
                  <span className="mx-auto">Login</span>
                </a>
              </>
            )}

            {!isAuthPage && !isChatPage && isAuthenticated && (
              <>
                <div className="px-3 py-3 border-t border-trackaro-border dark:border-trackaro-border">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-trackaro-accent/20 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-trackaro-accent" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-trackaro-text dark:text-on-dark">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-trackaro-text/70 dark:text-on-dark/70 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/profile"
                  onClick={(e) => handleNavigation(e, "/profile")}
                  className="text-trackaro-accent dark:text-on-dark hover:bg-trackaro-border dark:hover:bg-trackaro-border hover:text-trackaro-text dark:hover:text-on-dark block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 border-l-0 hover:border-l-4 hover:border-trackaro-accent hover:pl-4"
                >
                  View Profile
                </a>

                <a
                  href="/chat"
                  onClick={(e) => handleNavigation(e, "/chat")}
                  className="text-trackaro-accent dark:text-on-dark hover:bg-trackaro-border dark:hover:bg-trackaro-border hover:text-trackaro-text dark:hover:text-on-dark block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 border-l-0 hover:border-l-4 hover:border-trackaro-accent hover:pl-4"
                >
                  Go to Chat
                </a>

                <button
                  onClick={async () => {
                    await logout();
                    router.push("/");
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 text-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600 flex transition-all duration-300"
                >
                  <span className="mx-auto">Logout</span>
                </button>
              </>
            )}

            {isChatPage && (
              <div className="mt-4 pt-4 border-t border-trackaro-border dark:border-trackaro-border">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-trackaro-accent/20 flex items-center justify-center text-trackaro-accent">
                      <UserIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-trackaro-text dark:text-on-dark">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-trackaro-text/70 dark:text-on-dark/70 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  <a
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 rounded-md"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    View Profile
                  </a>

                  <a
                    href="#"
                    className="flex items-center px-3 py-2 text-sm text-trackaro-text dark:text-on-dark hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 rounded-md"
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Settings
                  </a>

                  <a
                    href="/"
                    className="flex items-center px-3 py-2 text-sm text-red-500 hover:bg-trackaro-accent/10 dark:hover:bg-trackaro-accent/10 rounded-md mt-2"
                  >
                    <LogoutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </a>
                </div>
              </div>
            )}

            {!isAuthPage && !isChatPage && (
              <a
                href="/auth/signup"
                onClick={(e) => handleNavigation(e, "/auth/signup")}
                className="w-full mt-2 text-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-trackaro-accent dark:bg-trackaro-accent text-white dark:text-white hover:bg-primary-hover dark:hover:bg-primary-hover flex transition-all duration-300 transform hover:scale-105 hover:shadow-md group"
              >
                <span className="mx-auto flex items-center">
                  Sign Up
                  <span className="ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
