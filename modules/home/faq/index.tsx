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
        "Yes. PDFs are generated in isolated, transient browser instances, and your content is never retained longer than necessary. All data is encrypted in transit and at rest.",
    },
    {
      question: "Do you support JavaScript-heavy pages?",
      answer:
        "Absolutely. We fully render modern JavaScript frameworks like React, Vue, and Svelte before generating your PDF, so dynamic content appears exactly as expected.",
    },
    {
      question: "How many PDFs can I generate per month?",
      answer:
        "Usage depends on your plan. Each plan includes a monthly conversion allowance, with higher limits available as you scale.",
    },
    {
      question: "What happens if I hit my monthly limit?",
      answer:
        "You can upgrade at any time to increase your limit. We’ll never block requests without clearly notifying you first.",
    },
    {
      question: "Can I control where my PDFs are stored?",
      answer:
        "Yes. Paid plans support custom storage destinations, so you stay in full control of where your generated PDFs live.",
    },
    {
      question: "Are there rate limits?",
      answer:
        "All plans include sensible rate limits to ensure platform stability. Pro and Business plans offer significantly higher limits and custom tuning.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "If something doesn’t work as expected, reach out and we’ll make it right. We’re focused on long-term developer trust.",
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" ref={ref} className="py-20 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
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
