"use client";

import { useState, useEffect, useRef } from "react";
import { useMe, useCheckout, useVerifyPayment } from "@/modules/hooks/queries";
import { GlowCard } from "@/modules/app/glow-card";
import { Button } from "@/modules/app/button";
import {
  Check,
  Zap,
  ShieldCheck,
  Globe,
  CreditCard,
  ChevronRight,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const PLANS = [
  {
    id: "09a2da27-46fb-4fed-ab7b-14a072e286aa",
    name: "Free",
    priceUsd: 0,
    priceNgn: 0,
    limit: 5,
    features: [
      "5 Conversions / month",
      "Standard Latency",
      "Public CDN Storage",
      "Community Support",
    ],
    color: "slate",
  },
  {
    id: "c014c152-804f-4b16-a043-b7952fe3e453",
    name: "Starter",
    priceUsd: 10,
    priceNgn: 10000, // Matching DB values: 1000 cents/kobo? The DB show priceUsd 1000 (cents) and priceNgn 1000000 (kobo)
    limit: 2000,
    features: [
      "2,000 Conversions / month",
      "Priority Queueing",
      "Secure Private Storage",
      "99.9% Uptime SLA",
      "Email Support",
    ],
    color: "blue",
    recommended: true,
  },
  {
    id: "65d08f45-6313-4f45-808d-0533c5402112",
    name: "Pro",
    priceUsd: 30,
    priceNgn: 45000,
    limit: 20000,
    features: [
      "20,000 Conversions / month",
      "Ultra-Low Latency",
      "Custom Webhooks",
      "Enhanced Security (MFA)",
      "24/7 Priority Support",
    ],
    color: "emerald",
  },
];

export function BillingPage() {
  const { data: userData, isLoading, refetch } = useMe();
  const checkoutMutation = useCheckout();
  const verifyMutation = useVerifyPayment();
  const searchParams = useSearchParams();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const verifyingRef = useRef(false);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const success = searchParams.get("success");

    if (reference && !verifyingRef.current) {
      verifyingRef.current = true;
      const tId = toast.loading("Verifying your payment...", {
        description: "Checking status with Paystack...",
      });

      verifyMutation.mutate(reference, {
        onSuccess: () => {
          toast.success("Account successfully upgraded!", {
            id: tId,
            description:
              "Your new limits are now active across the edge network.",
          });
          refetch(); // Update UI to show new plan
        },
        onError: (err: any) => {
          toast.error("Verification failed", {
            id: tId,
            description:
              err.message || "Please contact support if funds were deducted.",
          });
          verifyingRef.current = false;
        },
      });
    } else if (success === "true" && !reference) {
      // Legacy LS support or general success
      toast.success("Account successfully upgraded!", {
        description: "Your new limits are now active across the edge network.",
      });
    }
  }, [searchParams, verifyMutation, refetch]);

  // Automatically determine provider based on user region or default to LS
  const provider = userData?.region === "NG" ? "paystack" : "lemonsqueezy";

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-slate-400 font-medium animate-pulse">
          Loading billing environment...
        </p>
      </div>
    );
  }

  const handleCheckout = async (planId: string) => {
    setSelectedPlanId(planId);
    try {
      const response: any = await checkoutMutation.mutateAsync({
        planId,
        provider,
        redirectUrl: `${window.location.origin}/dashboard/billing?success=true`,
        callbackUrl: `${window.location.origin}/dashboard/billing?success=true`,
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setSelectedPlanId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Upgrade your <span className="text-blue-500">Infrastructure</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Scale your PDF generation from side projects to enterprise clusters
            with our globally distributed edge network.
          </p>
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Current Billing Region
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-xs font-medium text-slate-300">
            {provider === "paystack" ? (
              <>
                <CreditCard className="h-3 w-3 text-emerald-500" />
                Nigeria (NGN)
              </>
            ) : (
              <>
                <Globe className="h-3 w-3 text-blue-500" />
                International (USD)
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = userData?.plan?.id === plan.id;
          const isFree = plan.priceUsd === 0;
          const price =
            provider === "paystack"
              ? `₦${plan.priceNgn.toLocaleString()}`
              : `$${plan.priceUsd}`;
          console.log(isCurrent);

          return (
            <GlowCard
              key={plan.id}
              title={plan.name}
              sub={isFree ? "Default Plan" : "High Performance"}
              className={`${plan.recommended ? "border-blue-500/30" : ""}`}
              icon={
                <div
                  className={`p-2 rounded-lg ${
                    plan.color === "blue"
                      ? "bg-blue-500/10"
                      : plan.color === "emerald"
                        ? "bg-emerald-500/10"
                        : "bg-slate-500/10"
                  }`}
                >
                  <Zap
                    className={`h-5 w-5 ${
                      plan.color === "blue"
                        ? "text-blue-500"
                        : plan.color === "emerald"
                          ? "text-emerald-500"
                          : "text-slate-500"
                    }`}
                  />
                </div>
              }
              content={
                <div className="mt-4 space-y-8">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">
                        {price}
                      </span>
                      <span className="text-slate-500 text-sm font-medium">
                        /month
                      </span>
                    </div>
                    {plan.recommended && (
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 border border-blue-500/20 uppercase tracking-tighter">
                        Best Value
                      </span>
                    )}
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        <span className="text-sm text-slate-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    {isCurrent ? (
                      <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-400 text-center text-sm font-bold border border-white/5">
                        Current Plan
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleCheckout(plan.id)}
                        disabled={
                          isFree ||
                          (checkoutMutation.isPending &&
                            selectedPlanId !== null)
                        }
                        className={`w-full h-12 shadow-2xl active:scale-95 transition-all text-sm font-black ${
                          plan.color === "blue"
                            ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                            : plan.color === "emerald"
                              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                              : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        {checkoutMutation.isPending &&
                        selectedPlanId === plan.id ? (
                          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        ) : (
                          `Choose ${plan.name}`
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              }
            />
          );
        })}
      </div>

      {/* FAQ / Trust Bar */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="p-8 rounded-3xl border border-muted bg-slate-900/40 space-y-6">
          <div className="flex bg-blue-500/10 w-fit p-3 rounded-2xl">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              Secure Global Payments
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We partner with industry-leading payment processors to ensure your
              data is always safe. Lemon Squeezy handles international tax
              compliance, while Paystack provides seamless local transactions in
              Nigeria.
            </p>
          </div>
          <div className="flex gap-4 pt-4 grayscale opacity-50 flex-wrap">
            {/* Simple placeholders for payment methods */}
            <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-500">
              VISA
            </div>
            <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-500">
              MASTERCARD
            </div>
            <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-500">
              APPLE PAY
            </div>
            <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-500">
              BANK TRANSFER
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-muted bg-slate-900/40 space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group cursor-help transition-all hover:border-blue-500/30">
            <HelpCircle className="h-6 w-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">
                Need a Custom Enterprise Plan?
              </h4>
              <p className="text-xs text-slate-400">
                For high-volume needs (&gt;100k/mo), contact our sales team.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group cursor-help transition-all hover:border-emerald-500/30">
            <ShieldCheck className="h-6 w-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm">
                14-Day Money Back Guarantee
              </h4>
              <p className="text-xs text-slate-400">
                Not satisfied? We offer full refunds within 14 days of upgrade.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
