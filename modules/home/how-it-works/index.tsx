"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { Key, Send, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Grab your API key",
    description:
      "Sign up and get your unique API key in seconds. No setup, no waiting.",
    icon: Key,
  },
  {
    step: "02",
    title: "Send your request",
    description:
      "POST your URL or raw HTML to our API endpoint. We handle the rendering.",
    icon: Send,
  },
  {
    step: "03",
    title: "Download PDF & Extract JSON",
    description:
      "Receive a persistent Cloudflare R2 link instantly, alongside AI-extracted JSON metadata ready for your database.",
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
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Generate production-ready PDFs in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`relative rounded-2xl border border-border bg-background p-6 transition-all duration-700 ease-out ${
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
