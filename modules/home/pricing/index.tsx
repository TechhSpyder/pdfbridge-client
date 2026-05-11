"use client";

import { GlowCard } from "@/modules/app/glow-card";
import { PLAN_METADATA } from "@/modules/constants";
import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { cn } from "@/utils";
import { Check, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Single source of truth — features, price, and sub all come from PLAN_METADATA.
// To change pricing copy: edit modules/constants/index.ts only.
const TIER_ORDER = ["Builder", "Startup", "Growth", "Scale", "Enterprise"] as const;

const tiers = TIER_ORDER.map((name) => ({
  title: name,
  price: PLAN_METADATA[name]?.price ?? "$0",
  sub: PLAN_METADATA[name]?.sub ?? "",
  features: PLAN_METADATA[name]?.features ?? [],
  color: PLAN_METADATA[name]?.color ?? "slate",
  recommended: PLAN_METADATA[name]?.recommended ?? false,
}));

const ANNUAL_DISCOUNT = 0.2;

function formatAnnualPrice(price: string) {
  if (price === "$0" || price === "Custom") return price;
  const monthly = parseFloat(price.replace("$", ""));
  return `$${Math.round(monthly * (1 - ANNUAL_DISCOUNT))}`;
}

export function Pricing() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeIndex, setActiveIndex] = useState(2); // Growth is recommended
  const [isAnnual, setIsAnnual] = useState(false);

  const topTiers = tiers.slice(0, 3);
  const bottomTiers = tiers.slice(3);

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
          <p className="text-lg text-slate-400 mb-8">
            One invoice workflow = AI extraction + compilation + settlement.
            No hidden per-extraction charges.
          </p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={cn("text-sm font-medium", !isAnnual ? "text-white" : "text-slate-500")}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual((v) => !v)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors duration-300",
                isAnnual ? "bg-emerald-500" : "bg-slate-700",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                  isAnnual ? "translate-x-7" : "translate-x-1",
                )}
              />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-1.5", isAnnual ? "text-emerald-400" : "text-slate-500")}>
              Annual
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Top 3 — Builder, Startup, Growth */}
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
          {topTiers.map((tier, index) => {
            const displayPrice = isAnnual ? formatAnnualPrice(tier.price) : tier.price;
            const isActive = index === activeIndex;
            return (
              <div
                key={tier.title}
                onClick={() => setActiveIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveIndex(index)}
                className={cn(
                  "relative transition-all duration-500 ease-out cursor-pointer",
                  isActive && "md:scale-105",
                )}
                style={{
                  transform: isVisible ? "translateY(0)" : "translateY(8px)",
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 120}ms`,
                }}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="flex items-center gap-1 bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                      <Zap className="w-3 h-3" /> MOST POPULAR
                    </span>
                  </div>
                )}
                <GlowCard
                  title={tier.title}
                  titleClass="text-2xl font-bold"
                  sub={tier.sub}
                  content={
                    <div className="space-y-6">
                      <div>
                        <span className="text-4xl font-bold text-white">
                          {displayPrice}
                        </span>
                        {tier.price !== "Custom" && (
                          <span className="text-muted-foreground text-sm">
                            /month{isAnnual && tier.price !== "$0" && (
                              <span className="ml-1 text-slate-500 line-through text-xs">
                                {tier.price}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      <ul className="mt-2 mb-4 space-y-3 text-sm text-muted-foreground">
                        {tier.features.map((f: string, i: number) => (
                          <li
                            key={`${tier.title}-${i}`}
                            className="flex items-center gap-3 text-sm"
                          >
                            <Check className="w-4 h-4 text-blue-400 shrink-0" />
                            <span
                              className={cn(
                                f.startsWith("Everything in") && "font-bold text-white",
                              )}
                            >
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/signup"
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          "block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all",
                          tier.recommended
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                            : "bg-white/5 hover:bg-white/10 text-white border border-white/10",
                        )}
                      >
                        {tier.price === "$0" ? "Start for free" : "Get started"}
                      </Link>
                    </div>
                  }
                  icon={null}
                >
                </GlowCard>

                {/* Active Card Border */}
                <div
                  className="absolute inset-0 h-full rounded-2xl pointer-events-none transition-all duration-500"
                  style={{
                    border: isActive
                      ? "2px solid rgba(96, 165, 250, 0.8)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom 2 — Scale, Enterprise */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {bottomTiers.map((tier, index) => {
              const globalIndex = index + 3;
              const isActive = globalIndex === activeIndex;
              const displayPrice = isAnnual ? formatAnnualPrice(tier.price) : tier.price;
              return (
                <div
                  key={tier.title}
                  onClick={() => setActiveIndex(globalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveIndex(globalIndex)}
                  className={cn(
                    "relative transition-all duration-500 ease-out cursor-pointer",
                    isActive && "md:scale-105",
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
                            {displayPrice}
                          </span>
                          {tier.price !== "Custom" && (
                            <span className="text-muted-foreground text-sm">
                              /month{isAnnual && (
                                <span className="ml-1 text-slate-500 line-through text-xs">
                                  {tier.price}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        <ul className="mt-2 mb-4 space-y-4 text-sm text-muted-foreground">
                          {tier.features.map((f: string, i: number) => (
                            <li
                              key={`${tier.title}-${i}`}
                              className="flex items-center gap-3 text-sm"
                            >
                              <Check className="w-4 h-4 text-blue-500 shrink-0" />
                              <span
                                className={cn(
                                  f.startsWith("Everything in") && "font-bold text-white text-base",
                                )}
                              >
                                {f}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={tier.price === "Custom" ? "mailto:sales@techhspyder.com" : "/signup"}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          {tier.price === "Custom" ? "Contact sales" : "Get started"}
                        </Link>
                      </div>
                    }
                    icon={null}
                  >
                  </GlowCard>

                  {/* Active Card Border */}
                  <div
                    className="absolute inset-0 h-full rounded-2xl pointer-events-none transition-all duration-500"
                    style={{
                      border: isActive
                        ? "2px solid rgba(96, 165, 250, 0.8)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Top-up note */}
        <p className="text-center text-slate-500 text-sm mt-12">
          Hit your limit mid-month?{" "}
          <Link href="/dashboard/billing" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            Buy a 50-workflow top-up pack for $9
          </Link>{" "}
          — no plan change needed.
        </p>
      </div>
    </section>
  );
}
