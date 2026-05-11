"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { Send, Download, RefreshCw } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Submit invoice",
    description: "Upload a PDF, image, or URL. Our ingestion layer handles multi-format inputs instantly.",
    icon: Send,
  },
  {
    step: "02",
    title: "Process",
    description: "We extract structured data, validate financial accuracy, and normalize into clean formats.",
    icon: RefreshCw,
  },
  {
    step: "03",
    title: "Receive",
    description: "Get structured JSON + a normalized output + system-ready data via a single API call.",
    icon: Download,
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="border-t border-border py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Process financial invoices in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`relative rounded-2xl border border-white/15 bg-background p-6 transition-all duration-700 ease-out ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Step number */}
              <span className="absolute right-6 top-6 text-sm font-medium text-muted-foreground">
                {step.step}
              </span>

              {/* Icon */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted">
                <step.icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
