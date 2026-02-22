"use client";

import { cn } from "@/utils";
import { useRef } from "react";

type GlowCardProps = {
  title?: string;

  description?: string;
  icon?: React.ReactNode;
  sub?: string;
  content?: React.ReactNode;
  titleClass?: string;
  className?: string;
};

export function GlowCard({
  title,
  description,
  icon,
  sub,
  content,
  titleClass,
  className,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current?.style.setProperty("--x", `${x}px`);
    cardRef.current?.style.setProperty("--y", `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden h-full rounded-2xl border border-muted bg-background p-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:scale-[1.01] hover:border-white/20 active:scale-[0.99]",
        className,
      )}
      style={{
        background: "rgba(15,23,42,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Glow layer */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--x) var(--y), rgba(255,255,255,0.08), transparent 40%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {icon && <div className="mb-4">{icon}</div>}
        <div>
          <h3 className={cn("text-lg font-medium", titleClass)}>{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {content}
      </div>
    </div>
  );
}
