"use client";

import { useSidebarStore } from "@/modules/stores";
import Image from "next/image";
import Link from "next/link";

export function MobileTopBar() {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  return (
    <div className="flex items-center justify-between md:hidden p-4 border-b border-muted bg-background sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2">
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
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}
