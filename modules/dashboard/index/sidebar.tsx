"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useSidebarStore } from "@/modules/stores";
import { NAV_LINKS } from "@/modules/constants";
import {
  Button,
  SmartContactLink,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/app";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, MessageCircle, Check, ChevronDown, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useClipboard } from "@/modules/hooks/use-copy-to-clipboard";
import { useWindowSize } from "@uidotdev/usehooks";

const sidebarVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const linkVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const footerVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function SidebarContent({ isSmallScreen, setSidebarOpen }: any) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const { copied, copy } = useClipboard();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="p-6 border-b border-muted h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/webp/pdfbridge_logo.webp"
            alt="PDFBridge"
            width={32}
            height={32}
          />
          <span className="font-bold text-xl text-white tracking-tight">
            PDFBridge
          </span>
        </Link>
        {isSmallScreen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white text-xl font-bold p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV_LINKS.filter((link) => {
          if (link.label === "Blog Journal") {
            const userRole =
              (user?.publicMetadata?.role as string) ||
              (user?.publicMetadata?.userRole as string) ||
              "";
            const primaryEmail = user?.primaryEmailAddress?.emailAddress || "";
            const allowedEmails = ["admin@pdfbridge.xyz"]; // Fallback or sync with actions
            return (
              userRole === "platform-owner" ||
              allowedEmails.includes(primaryEmail.toLowerCase())
            );
          }
          return true;
        }).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <motion.div key={link.href} variants={linkVariants}>
              <Link
                href={link.href}
                onClick={() => isSmallScreen && setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300",
                  )}
                />
                {link.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        className="p-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.05, delayChildren: 0.1 },
          },
        }}
      >
        <motion.div variants={footerVariants}>
          <Button
            onClick={() => {
              router.push("/dashboard/billing");
              if (isSmallScreen) setSidebarOpen(false);
            }}
            variant="outline"
            className="w-full rounded-lg mb-4"
          >
            <Zap className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </motion.div>

        <motion.div
          variants={footerVariants}
          className="border-t border-t-muted bg-sidebar"
        >
          {isLoaded && user && (
            <>
              <div className="flex items-center gap-3 px-1 mt-4 md:hidden border-t border-t-border pb-3">
                <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={user.imageUrl || ""}
                    alt={user.fullName || "User"}
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.fullName || "Developer"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  signOut();
                  if (isSmallScreen) setSidebarOpen(false);
                }}
                role="button"
                className="flex w-full items-center border-t border-t-muted pt-4 md:hidden cursor-pointer gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
              >
                <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
                Sign Out
              </button>

              <div className="md:flex hidden">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger className="w-full rounded-lg">
                    <div
                      role="button"
                      tabIndex={0}
                      className="flex items-center cursor-pointer gap-3 px-3 py-2 text-slate-400 hover:text-secondary-foreground transition-all duration-200 hover:bg-white/5 border border-transparent rounded-lg"
                    >
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-border">
                        <Image
                          src={user.imageUrl || ""}
                          alt={user.fullName || "User"}
                          width={32}
                          height={32}
                        />
                      </div>

                      <p className="text-sm font-medium truncate">
                        {user.fullName || "Developer"}
                      </p>

                      <ChevronDown
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform duration-200",
                          { "rotate-180": open },
                        )}
                      />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent className="border-muted bg-popover w-[--radix-popover-trigger-width]!">
                    <div className="flex items-center gap-3 px-1 mb-4 border-b border-b-border pb-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                        <Image
                          src={user.imageUrl || ""}
                          alt={user.fullName || "User"}
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user.fullName || "Developer"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>

                    <SmartContactLink
                      email="info@pdfbridge.xyz"
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
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();
  const ref = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSmallScreen = width && width < 1024;

  // Close sidebar on outside click (mobile only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        isSmallScreen
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSidebarOpen, isSmallScreen]);

  return (
    <>
      <AnimatePresence>
        {/* Mobile Sidebar & Overlay */}
        {mounted && isSmallScreen && sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/60 z-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              ref={ref}
              key="sidebar"
              className="z-150 w-64 bg-sidebar border-r border-muted flex flex-col fixed inset-y-0 left-0"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
            >
              <SidebarContent
                isSmallScreen={true}
                setSidebarOpen={setSidebarOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Always CSS visible, never flashes) */}
      <div className="hidden lg:flex z-40 w-64 bg-sidebar border-r border-muted flex-col sticky top-0 h-screen shrink-0">
        <SidebarContent isSmallScreen={false} setSidebarOpen={setSidebarOpen} />
      </div>
    </>
  );
}
