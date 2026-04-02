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
    title: "Builder",
    price: "$0",
    sub: "Ideal for rapid testing",
    features: [
      "Includes 50 documents / mo",
      "Built for testing and early integration",
      "Includes 5 financial extractions",
      "10MB File Limit",
      "7 Days Retention",
    ],
  },
  {
    id: "developer",
    title: "Startup",
    price: "$19",
    sub: "For builders and early-stage products",
    features: [
      "Includes 2,000 documents / mo",
      "Includes 100 extractions / mo",
      "Webhooks & ERP-ready",
      "Financial data layer access",
      "Tailwind normalization",
    ],
  },
  {
    id: "growth",
    title: "Growth",
    price: "$99",
    sub: "For scaling financial workflows",
    features: [
      "Includes 20,000 documents / mo",
      "Includes 500 extractions / mo",
      "Priority processing",
      "Ghost Mode (Private)",
      "Unlimited retention",
      "Everything in Startup",
    ],
  },
  {
    id: "scale",
    title: "Scale",
    price: "$499",
    sub: "For high-volume financial automation",
    features: [
      "Includes 100,000+ documents / mo",
      "Unlimited extractions",
      "Financial data layer access",
      "Audit-ready infrastructure",
      "Everything in Growth",
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    sub: "Handling millions of documents monthly? Talk to us.",
    features: [
      "Custom throughput",
      "SLA-backed guarantees",
      "Dedicated infrastructure",
      "Custom pricing based on workload",
      "Global compliance support",
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
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black tracking-tight text-white mb-4">
            Predictable pricing. Built for financial workflows.
          </h2>
          <p className="text-xl text-blue-400 font-bold uppercase tracking-widest mb-12">
            All plans scale automatically — no hard limits, no dropped jobs.
          </p>
        </div>

        {/* Tier Cards */}

        {/* Standard Tiers */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {tiers.slice(0, 3).map((tier, index) => (
            <div
              key={tier.title}
              onClick={() => setActiveIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveIndex(index)}
              className={cn(
                "transition-all duration-500 ease-out cursor-pointer",
                index === activeIndex && "md:scale-105",
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
                      {tier.price !== "Custom" && (
                        <span className="text-muted-foreground text-sm">
                          /month
                        </span>
                      )}
                    </div>
                    <ul className="mt-2 mb-4 space-y-3 text-sm text-muted-foreground">
                      {tier.features.map((f, i) => (
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

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {tiers.slice(3).map((tier, index) => {
              const globalIndex = index + 3;
              return (
                <div
                  key={tier.title}
                  onClick={() => setActiveIndex(globalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActiveIndex(globalIndex)
                  }
                  className={cn(
                    "transition-all duration-500 ease-out cursor-pointer",
                    globalIndex === activeIndex && "md:scale-105",
                  )}
                  style={{
                    transform: isVisible ? "translateY(0)" : "translateY(8px)",
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${globalIndex * 120}ms`,
                  }}
                >
                  <GlowCard
                    title={tier.title}
                    titleClass="text-3xl font-black text-blue-400"
                    sub={tier.sub}
                    className="border-blue-500/10"
                    content={
                      <div className="space-y-6">
                        <div>
                          <span className="text-4xl font-bold text-white">
                            {tier.price}
                          </span>
                          {tier.price !== "Custom" && (
                            <span className="text-muted-foreground text-sm">
                              /month
                            </span>
                          )}
                        </div>
                        <ul className="mt-2 mb-4 space-y-4 text-sm text-muted-foreground">
                          {tier.features.map((f, i) => (
                            <li
                              key={`${tier.id}-${i}`}
                              className="flex items-center gap-3 text-sm"
                            >
                              <Check className="w-4 h-4 text-blue-500 shrink-0" />
                              <span
                                className={cn(
                                  f.startsWith("Everything in") &&
                                    "font-bold text-white text-base",
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
                        globalIndex === activeIndex
                          ? "2px solid rgba(96, 165, 250, 0.8)" // blue highlight
                          : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
