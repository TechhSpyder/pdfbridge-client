"use client";

import { Button } from "./button";
import { useNavStore } from "../stores";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useActiveSection } from "../hooks/use-active-section";
import { cn } from "@/utils";
import Link from "next/link";
import { ScrollProgressBar } from "./scroll-progress";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";

type ScrollNavItem = {
  label: string;
  id: string;
  type: "scroll";
};

type LinkNavItem = {
  label: string;
  href: string;
  type: "link";
};

type NavItem = ScrollNavItem | LinkNavItem;

const NAV_ITEMS: NavItem[] = [
  { label: "Features", id: "features", type: "scroll" },
  // { label: "Pricing", id: "pricing", type: "scroll" },
  { label: "FAQ", id: "faq", type: "scroll" },
  { label: "Docs", href: "/docs", type: "link" },
];

export function Navbar() {
  const { open, setOpen } = useNavStore();
  const lenis = useLenis();
  const pathname = usePathname();

  const isHidden =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const activeSection = useActiveSection(
    NAV_ITEMS.filter((i) => i.type === "scroll").map((i) => i.id),
  );
  const scrollTo = (id: string) => {
    lenis?.scrollTo(`#${id}`, {
      offset: -80,
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    setOpen(false);
  };

  if (isHidden) return null;

  // Animation variants for the mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
    },
  };

  return (
    <nav className="sticky top-0 z-100 border-b border-border bg-background/95 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/pdfbridge_logo.svg"
            alt="PDFBridge"
            width={48}
            height={48}
          />

          <span className="hidden sm:inline font-semibold text-lg">
            PDFBridge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) =>
            item.type === "scroll" ? (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "relative text-sm transition-colors",
                  activeSection === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-blue-500"
                  />
                )}
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ),
          )}
        </div>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started Free
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur py-6 shadow-md md:hidden"
          >
            <div className="flex flex-col items-center gap-6">
              {NAV_ITEMS.map((item) =>
                item.type === "scroll" ? (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "text-base font-medium cursor-pointer",
                      activeSection === item.id
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-base font-medium text-muted-foreground"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <SignedOut>
                <Link href="/sign-in" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  <Button size="sm" className="bg-blue-600 text-white">
                    Get Started Free
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollProgressBar />
    </nav>
  );
}
