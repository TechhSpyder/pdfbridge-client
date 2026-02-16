import { Button, SmartContactLink } from "@/modules/app";
import { GlowCard } from "./glow-card";
import { PLAN_METADATA } from "@/modules/constants";
import { cn } from "@/utils";
import { Check, Loader2, Zap } from "lucide-react";

export function PlanCard({
  plan,
  userData,
  provider,
  onCheckout,
  isCheckoutPending,
  selectedPlanId,
  forcedInterval,
}: any) {
  const interval = forcedInterval || "month";
  const isCurrent =
    userData?.plan?.id === plan.id &&
    (userData?.billingInterval || "month") === interval;
  const isFree = plan.priceUsd === 0 && plan.priceNgn === 0;
  const metadata = PLAN_METADATA[plan.name] || {};

  const isAnnual = interval === "year";
  const baseMonthly =
    provider === "paystack" ? plan.priceNgn || 0 : plan.priceUsd || 0;
  const annualField =
    provider === "paystack" ? plan.priceNgnAnnual : plan.priceUsdAnnual;

  // Fallback logic: If annual field is missing or 0, calculate 20% off 12 months
  let priceValue = isAnnual
    ? annualField
      ? annualField
      : baseMonthly * 12 * 0.8
    : baseMonthly;

  let price =
    provider === "paystack"
      ? `₦${(priceValue / 100).toLocaleString()}`
      : `$${(priceValue / 100).toLocaleString()}`;

  if (isFree) price = provider === "paystack" ? "₦0" : "$0";

  const isEnterprise = plan.name === "Enterprise";
  if (isEnterprise) price = "Contact Sales";

  return (
    <GlowCard>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn("p-2 rounded-lg", {
              "bg-blue-500/10": metadata.color === "blue",
              "bg-emerald-500/10": metadata.color === "emerald",
              "bg-slate-500/10": metadata.color === "slate",
            })}
          >
            <Zap
              className={cn("h-5 w-5", {
                "text-blue-500": metadata.color === "blue",
                "text-emerald-500": metadata.color === "emerald",
                "text-slate-500": metadata.color === "slate",
              })}
            />
          </div>
        </div>

        <div>
          <h3 className={cn("text-lg font-medium")}>{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFree
              ? "Default Plan"
              : isAnnual
                ? "Annual Billing"
                : "Monthly Billing"}
          </p>
        </div>

        <div className="mt-4 space-y-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn("font-black text-white", {
                    "text-4xl": !isEnterprise,
                    "text-2xl": isEnterprise,
                  })}
                >
                  {price}
                </span>
                {!isEnterprise && (
                  <span className="text-slate-500 text-sm font-medium">
                    /{isAnnual ? "year" : "month"}
                  </span>
                )}
              </div>

              {isAnnual && !isFree && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 line-through">
                    {provider === "paystack"
                      ? `₦${((baseMonthly * 12) / 100).toLocaleString()}`
                      : `$${((baseMonthly * 12) / 100).toLocaleString()}`}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    SAVE 20%
                  </span>
                </div>
              )}
            </div>
          </div>

          <ul className="space-y-4">
            {(metadata.features || []).map((feature: string) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <span className="text-sm text-slate-400">{feature}</span>
              </li>
            ))}
            {!metadata.features && (
              <li className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                  <Check className="h-3 w-3 text-emerald-500" />
                </div>
                <span className="text-sm text-slate-400">
                  {plan.limit.toLocaleString()} Conversions / month
                </span>
              </li>
            )}
          </ul>

          <div className="pt-4">
            {isCurrent ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 text-center text-sm font-bold border border-white/5">
                Current Plan
              </div>
            ) : userData?.plan?.id === plan.id ? (
              <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/50 text-slate-500 text-center text-sm font-bold border border-white/5 italic">
                Current Plan (
                {userData?.billingInterval === "year" ? "Annual" : "Monthly"})
              </div>
            ) : isEnterprise ? (
              <SmartContactLink
                email="support@pdfbridge.xyz"
                isButton
                className="w-full h-12 shadow-2xl active:scale-95 transition-all text-sm font-black bg-slate-700 hover:bg-slate-600 rounded-md py-2 px-4 flex items-center justify-center text-white"
              >
                Contact Support
              </SmartContactLink>
            ) : (
              <Button
                onClick={() => {
                  onCheckout(plan.id, interval);
                }}
                disabled={isCheckoutPending && selectedPlanId !== null}
                className={`w-full h-12 shadow-2xl active:scale-95 transition-all text-sm font-black ${
                  metadata.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                    : metadata.color === "emerald"
                      ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                      : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {isCheckoutPending && selectedPlanId === plan.id ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : isFree ? (
                  "Downgrade to Free"
                ) : (
                  `Choose ${plan.name}`
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      {metadata.recommended && (
        <span className="inline-flex items-center absolute top-[20%] right-0 bg-primary px-2.5 py-1 text-xs font-bold text-secondary-foreground border border-primary/20 pointer-events-none uppercase tracking-tighter">
          Best Value
        </span>
      )}
    </GlowCard>
  );
}

export function PlanCardSkeleton() {
  return (
    <GlowCard>
      <div className="relative z-10 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <div className="h-8 w-8! skeleton-el" />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-white/5 w-fit">
            <div className="h-5 w-24! skeleton-el" />
          </div>
        </div>

        <div className="mt-4 space-y-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <div className="h-11 w-36! skeleton-el" />
                <div className="h-5 w-20! skeleton-el" />
              </div>
            </div>
          </div>

          <ul className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                  <div className="h-6 w-6! min-w-6! skeleton-el" />
                </div>

                <div className="h-6 w-full! skeleton-el" />
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <div className="h-12 w-full! skeleton-el" />
          </div>
        </div>
      </div>

      <div className="h-7 w-24! skeleton-el absolute top-[20%] right-0" />
    </GlowCard>
  );
}
