"use client";

import { GlowCard } from "@/modules/app/glow-card";
import { PLAN_METADATA } from "@/modules/constants";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { cn } from "@/utils";
import { Check } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    id: "free",
    title: "Free",
    price: "$0",
    sub: "Ideal for rapid testing",
    features: [
      "50 Conversions / mo",
      "5 AI Extractions / mo",
      "1 Team Seat",
      "Basic API Access",
      "10MB File Limit",
      "7 Days Retention",
    ],
  },
  {
    id: "developer",
    title: "Developer",
    price: "$19",
    sub: "For solo builders & startups",
    features: [
      "2,000 Conversions / mo",
      "100 AI Extractions / mo",
      "5 Team Seats",
      "Native Tailwind Support",
      "Custom Headers/Footers",
      "25MB File Limit",
      "30 Days Retention",
      "Webhooks & ERP Ready",
    ],
  },
  {
    id: "automation",
    title: "Automation",
    price: "$99",
    sub: "Built for Vertical SaaS",
    features: [
      "20,000 Conversions / mo",
      "500 AI Extractions / mo",
      "20 Team Seats",
      "Ghost Mode (Private)",
      "50MB File Limit",
      "Unlimited Retention",
      "Everything in Developer",
    ],
  },
  {
    id: "resilience",
    title: "Resilience",
    price: "$499",
    sub: "FinTech & Gov-Grade",
    features: [
      "100,000 Conversions / mo",
      "Unlimited AI Extractions",
      "Unlimited Team Seats",
      "IP Whitelisting Support",
      "100MB+ File Limit",
      "Everything in Automation",
      "Audit-Ready Infrastructure",
    ],
  },
];

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(1);
  const metadata = PLAN_METADATA[tiers[activeIndex].title] || {};

  return (
    <section
      id="pricing"
      ref={ref}
      className="py-24 bg-background border-t border-border"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-semibold tracking-tight">
            Pricing Tiers
          </h2>
          <p className="mt-4 text-muted-foreground">
            Clear value-to-price ratio for teams of any size.
          </p>
        </div>

        {/* Tier Cards */}

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4! w-full">
          {tiers.map((tier, index) => (
            <div
              key={tier.title}
              onClick={() => setActiveIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIndex(index)}
              className={cn(
                "transition-all duration-500 ease-out cursor-pointer",
                index === activeIndex && "md:scale-110",
              )}
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(8px)",
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${index * 120}ms`,
              }}
            >
              <GlowCard
                title={tier.title}
                titleClass="text-2xl font-bold"
                sub={tier.sub}
                content={
                  <div className="space-y-6">
                    <div>
                      <span className="text-4xl font-bold text-white">
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        /month
                      </span>
                    </div>
                    <ul className="mt-2 mb-4 space-y-3 text-sm text-muted-foreground">
                      {tier.features.map((f, i) => (
                        // <li key={f}><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> {f}</li>
                        <li
                          key={`${tier.id}-${i}`}
                          className="flex items-center gap-3 text-sm"
                        >
                          <Check className="w-4 h-4 text-blue-400 shrink-0" />
                          <span
                            className={cn(
                              f.startsWith("Everything in") &&
                                "font-bold text-white",
                            )}
                          >
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                icon={null}
              ></GlowCard>

              {/* Active Card Border */}
              <div
                className={`absolute inset-0 h-full rounded-2xl pointer-events-none transition-all duration-500`}
                style={{
                  border:
                    index === activeIndex
                      ? "2px solid rgba(96, 165, 250, 0.8)" // blue highlight
                      : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
