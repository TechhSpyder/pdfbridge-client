"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { cn } from "@/utils";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation();

  const faqs = [
    {
      question: "Is my data safe?",
      answer:
        "Yes. We use transient browser instances and never store your rendered content beyond the retention period you specify. All data is encrypted in transit and at rest.",
    },
    {
      question: "Do you support JavaScript-heavy pages?",
      answer:
        "Absolutely. We wait for networkidle0 to ensure all React/Vue/Svelte components are fully hydrated before printing. This ensures your dynamic content renders perfectly.",
    },
    {
      question: "Can I use my own S3 bucket?",
      answer:
        "Pro and Business plans support custom storage destinations. You maintain full control over where your PDFs are stored.",
    },
    {
      question: "What about rate limiting?",
      answer:
        "Free tier has standard rate limits. Pro and Business tiers have much higher limits and can be customized. Contact our team for enterprise-level requirements.",
    },
  ];

  return (
    <section id="faq" ref={ref} className="py-20 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-16 space-y-4 transition-all duration-700",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={cn(
                "border border-border rounded-lg overflow-hidden transition-all",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
                `transition-delay: ${idx * 120}ms`,
              )}
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-background/50 transition-colors text-left"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform cursor-pointer ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div
                  className={cn(
                    "px-6 py-4 border-t border-border bg-background/50 text-muted-foreground transition-all duration-700",
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0",
                    `transition-delay: ${idx * 120}ms`,
                  )}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
