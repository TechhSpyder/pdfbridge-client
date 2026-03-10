"use client";

import { Button } from "./button";
import { useNavStore } from "../stores";
import { ChevronDown, LogOut, Menu, MessageCircle, X, Sparkles, Code2, Shield, Search, BookOpen, LayoutTemplate, FileText, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useActiveSection } from "../hooks/use-active-section";
import { cn } from "@/utils";
import Link from "next/link";
import { ScrollProgressBar } from "./scroll-progress";
import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { SmartContactLink } from "./smart-contact-link";
import { NavDropdown } from "./nav-dropdown";

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

type DropdownNavItem = {
  label: string;
  type: "dropdown";
  items: {
    title: string;
    href: string;
    description: string;
    icon: React.ReactNode;
  }[];
};

type NavItem = ScrollNavItem | LinkNavItem | DropdownNavItem;

const NAV_ITEMS: NavItem[] = [
  {
    label: "Features",
    type: "dropdown",
    items: [
      {
        title: "AI Layout Extraction",
        href: "/features/ai-overview",
        description: "Parse PDFs back into structured JSON payloads.",
        icon: <Sparkles size={18} />,
      },
      {
        title: "Next.js App Router to PDF",
        href: "/for/nextjs",
        description: "Native support for Vercel edge functions and server components.",
        icon: <LayoutTemplate size={18} />,
      },
      {
        title: "React Components to PDF",
        href: "/frameworks/react-to-pdf",
        description: "Pixel-perfect conversion for modern frontend frameworks.",
        icon: <Code2 size={18} />,
      },
      {
        title: "Ghost Mode",
        href: "/security/zero-data-retention",
        description: "Zero data retention for enterprise compliance.",
        icon: <Shield size={18} />,
      },
    ],
  },
  { label: "Pricing", id: "pricing", type: "scroll" },
  { label: "FAQ", id: "faq", type: "scroll" },
  {
    label: "Solutions",
    type: "dropdown",
    items: [
      {
        title: "Invoice PDF API",
        href: "/use-cases/invoice-pdf-api",
        description: "Generate branded, scalable invoices from HTML templates.",
        icon: <FileText size={18} />,
      },
      {
        title: "Receipt PDF API",
        href: "/use-cases/receipt-pdf-api",
        description: "Instant PDF receipts for POS and e-commerce platforms.",
        icon: <ReceiptText size={18} />,
      },
    ],
  },
  {
    label: "Resources",
    type: "dropdown",
    items: [
      {
        title: "API Documentation",
        href: "/docs",
        description: "Integration guides, quickstarts, and endpoint references.",
        icon: <Code2 size={18} />,
      },
      {
        title: "Insights & Journal",
        href: "/insights",
        description: "Technical deep dives and migration guides from the team.",
        icon: <BookOpen size={18} />,
      },
    ],
  },
];

export function Navbar() {
  const { open, setOpen } = useNavStore();
  const lenis = useLenis();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const isHidden =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  const activeSection = useActiveSection(
    NAV_ITEMS.filter((i) => i.type === "scroll").map((i) => (i as ScrollNavItem).id),
  );
  const scrollTo = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      setOpen(false);
      return;
    }
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
            src="/webp/pdfbridge_logo.webp"
            alt="PDFBridge"
            width={48}
            height={48}
            priority
          />

          <span className="hidden sm:inline font-semibold text-lg">
            PDFBridge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) =>
            item.type === "dropdown" ? (
              <NavDropdown key={item.label} label={item.label} items={item.items} />
            ) : item.type === "scroll" ? (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "relative text-sm transition-colors cursor-pointer",
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

            {/* <UserButton afterSignOutUrl="/" /> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger className="w-full rounded-lg">
                <div className="flex items-center cursor-pointer gap-3 px-3 py-2 text-slate-400 hover:text-secondary-foreground transition-all duration-200 hover:bg-white/5 border border-transparent rounded-lg">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                    <Image
                      src={user?.imageUrl || ""}
                      alt={user?.fullName || "User"}
                      width={32}
                      height={32}
                    />
                  </div>

                  {/* <p className="text-sm font-medium truncate">
                    {user?.fullName || "Developer"}
                  </p>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 ml-auto transition-transform duration-200",
                      { "rotate-180": open },
                    )}
                  /> */}
                </div>
              </PopoverTrigger>

              <PopoverContent className="border-muted bg-popover w-[--radix-popover-trigger-width]!">
                <div className="flex items-center gap-3 px-1 mb-4 border-b border-b-border pb-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                    <Image
                      src={user?.imageUrl || ""}
                      alt={user?.fullName || "User"}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.fullName || "Developer"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <SmartContactLink
                  email="hello@techhspyder.com"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-slate-400 w-full hover:text-white hover:bg-white/5 border border-transparent rounded-lg text-sm font-medium transition-all duration-200 group",
                  )}
                >
                  <MessageCircle
                    className={cn(
                      "h-4 w-4 transition-colors text-slate-500 group-hover:text-slate-300 hover:text-blue-400 duration-200",
                    )}
                  />
                  Contact us
                </SmartContactLink>

                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center cursor-pointer gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
                >
                  <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                  Sign Out
                </button>
              </PopoverContent>
            </Popover>
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
              {NAV_ITEMS.map((item) => {
                if (item.type === "scroll") {
                  return (
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
                  );
                }
                if (item.type === "link") {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-base font-medium text-muted-foreground"
                    >
                      {item.label}
                    </Link>
                  );
                }
                // dropdown — flatten sub-items in mobile
                return item.items.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="text-base font-medium text-muted-foreground"
                  >
                    {sub.title}
                  </Link>
                ));
              })}
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
