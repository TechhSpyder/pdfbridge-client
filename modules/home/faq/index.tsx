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
        "Yes. Documents are processed in isolated environments with strict data handling controls. All data is encrypted in transit and at rest, and content is never retained longer than necessary.",
    },
    {
      question: "Do you support complex document layouts?",
      answer:
        "Absolutely. Our engine processes modern web-based layouts and complex financial tables with high fidelity before normalizing them into your desired format.",
    },
    {
      question: "How many documents can I process per month?",
      answer:
        "Usage is based on your selected plan. Each tier includes a monthly processing allowance, with automated overage support as you scale.",
    },
    {
      question: "What happens if I hit my plan limit?",
      answer:
        "Our infrastructure is designed to scale with your workload. We never drop jobs, you’ll simply be billed for additional volume at your plan's rate.",
    },
    {
      question: "Can I control data residency?",
      answer:
        "Yes. Advanced plans support custom storage destinations and regional processing options to ensure compliance with strict data residency requirements.",
    },
    {
      question: "Are there infrastructure rate limits?",
      answer:
        "All plans include enterprise-grade throughput. Higher tiers offer dedicated infrastructure and custom rate tuning for high-volume pipelines.",
    },
    {
      question: "How do I sync to my accounting systems?",
      answer:
        "You can deliver validated data directly via webhooks or pull it through our API. We provide SDKs for all major languages to facilitate rapid integration.",
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
                "border border-white/15 rounded-lg overflow-hidden transition-all",
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
