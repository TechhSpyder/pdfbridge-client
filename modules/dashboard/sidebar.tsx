"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOut,
  LayoutDashboard,
  Key,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/usage", label: "Usage", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border bg-slate-950 flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/pdfbridge_logo.svg"
            alt="PDFBridge"
            width={32}
            height={32}
          />
          <span className="font-bold text-xl text-white tracking-tight">
            PDFBridge
          </span>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
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
          );
        })}
      </nav>

      {/* Footer / User Section */}
      <div className="p-4 border-t border-white/5 bg-slate-900/30">
        {isLoaded && user && (
          <div className="flex items-center gap-3 px-1 mb-4">
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
        )}

        <button
          onClick={() => signOut()}
          className="flex w-full items-center cursor-pointer gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
