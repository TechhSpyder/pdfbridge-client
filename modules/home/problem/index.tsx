"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { XCircle } from "lucide-react";

const painPoints = [
  "Headless Chrome crashes",
  "Queue orchestration",
  "Autoscaling browser pools",
  "Cold start delays",
  "Layout inconsistencies",
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
            Financial document workflows break at scale.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Most systems were never designed for document-based workflows.
          </p>
        </div>

        <div
          className={`mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {[
            "Inconsistent invoice formats",
            "Manual data entry",
            "Fragile OCR pipelines",
            "Unreliable extraction",
            "No validation layer",
          ].map((point) => (
            <div
              key={point}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-muted/40 px-4 py-3"
            >
              <XCircle className="h-4 w-4 shrink-0 text-red-500/80" />
              <span className="text-sm text-muted-foreground">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
