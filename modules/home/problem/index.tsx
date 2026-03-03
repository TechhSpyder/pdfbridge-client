"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { XCircle } from "lucide-react";

const painPoints = [
  "Headless Chrome crashes",
  "Memory leaks at scale",
  "Queue orchestration",
  "Autoscaling browser pools",
  "Cold start delays",
  "Layout inconsistencies",
  "CSS that works in browser but breaks in PDF",
];

export function Problem() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="border-t border-border py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            HTML-to-PDF Shouldn&apos;t Become an Infrastructure Project.
          </h2>
          <p className="mt-4 text-muted-foreground">
            If you&apos;re generating PDFs in production, you&apos;re probably
            dealing with:
          </p>
        </div>

        <div
          className={`mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {painPoints.map((point) => (
            <div
              key={point}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-muted/40 px-4 py-3"
            >
              <XCircle className="h-4 w-4 shrink-0 text-red-500/80" />
              <span className="text-sm text-muted-foreground">{point}</span>
            </div>
          ))}
        </div>

        <p
          className={`mt-10 text-center text-base font-medium text-foreground/70 transition-all duration-700 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Self-hosting Puppeteer works — until it doesn&apos;t.
        </p>
      </div>
    </section>
  );
}
