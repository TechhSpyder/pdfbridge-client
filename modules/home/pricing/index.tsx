"use client";

import { GlowCard } from "@/modules/app/glow-card";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { cn } from "@/utils";
import { Check } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    title: "Free",
    price: "$0",
    sub: "Perfect for getting started",
    features: [
      "5 conversions/month",
      "Community support",
      "R2 Storage (24h)",
      "Basic API access",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    sub: "For scaling teams",
    features: [
      "2,000 conversions/month",
      "Priority email support",
      "Custom domains",
      "Persistent storage",
      "Advanced analytics",
    ],
  },
  {
    title: "Business",
    price: "$30",
    sub: "Enterprise solutions",
    features: [
      "20,000+ conversions/month",
      "Dedicated infrastructure",
      "SLA guarantee",
      "24/7 phone support",
      "Custom integrations",
    ],
  },
];

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(1);

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
        <div className="mt-16 grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.title}
              onClick={() => setActiveIndex(index)}
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
                      {tier.features.map((f) => (
                        // <li key={f}><Check className="w-4 h-4 text-blue-400 flex-shrink-0" /> {f}</li>
                        <li key={f} className="flex items-center gap-3 text-sm">
                          <Check className="w-4 h-4 text-blue-400 shrink-0" />
                          <span>{f}</span>
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
