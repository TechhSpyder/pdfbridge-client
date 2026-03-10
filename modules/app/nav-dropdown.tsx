"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

interface DropdownItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "flex items-center gap-1.5 text-sm transition-colors cursor-pointer py-2",
          isOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
          >
            <div className="w-[320px] rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-3 shadow-2xl shadow-black/50 overflow-hidden">
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex flex-col gap-1 rounded-xl p-3 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                       {item.icon && <span className="text-blue-500">{item.icon}</span>}
                       <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{item.title}</span>
                    </div>
                    {item.description && (
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed font-medium">
                        {item.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
