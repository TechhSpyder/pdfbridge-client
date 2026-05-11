"use client";
import { useState, useEffect, useRef } from "react";
import {
  useMe,
  useCheckout,
  useVerifyPayment,
  useBillingInfo,
  useCancelSubscription,
  usePlans,
  useVerifyPaddle,
  useTopupCheckout,
  useVerifyTopup,
} from "@/modules/hooks/queries";
import { Button, SmartContactLink, WorkflowQuota } from "@/modules/app";
import {
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  ExternalLink as ExternalLinkIcon,
  Receipt,
  XCircle,
  Activity,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PlanCard, PlanCardSkeleton } from "../index/plan-card";
import Link from "next/link";
import { cn } from "@/utils";

declare global {
  interface Window {
    Paddle?: any;
  }
}

export function BillingPage() {
  const { data: userData, isLoading: userLoading, refetch } = useMe();
  const {
    data: plansData,
    isLoading: plansLoading,
    error: plansError,
  } = usePlans();
  const checkoutMutation = useCheckout();
  const verifyMutation = useVerifyPayment();
  const verifyPaddle = useVerifyPaddle();
  const topupCheckout = useTopupCheckout();
  const verifyTopup = useVerifyTopup();
  const searchParams = useSearchParams();
  const { data: billingInfo } = useBillingInfo();
  const cancelMutation = useCancelSubscription();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (userData?.billingInterval) {
      setInterval(userData.billingInterval as any);
    }
  }, [userData?.billingInterval]);

  useEffect(() => {
    const initPaddle = () => {
      if (window.Paddle) {
        const env =
          process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
            ? "production"
            : "sandbox";
        window.Paddle.Environment.set(env);
        window.Paddle.Initialize({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
          eventCallback: async (data: any) => {
            if (data.name === "checkout.completed") {
              const tid = data.data.transaction_id || data.data.id;
              if (tid && !verifyingRef.current) {
                // Don't set verifyingRef here yet, as we want to allow URL fallback if this fails
                const toastId = toast.loading("Confirming your upgrade...");
                try {
                  await verifyPaddle.mutateAsync(tid);
                  toast.success("Welcome to the new tier!", { id: toastId });
                  refetch();
                } catch (e: any) {
                  console.error("[PADDLE] Verif Error:", e);
                  toast.error(
                    "Manual verification failed. Webhook will retry.",
                    { id: toastId },
                  );
                }
              }
            }
          },
        });
        return true;
      }
      return false;
    };

    if (!initPaddle()) {
      const poll = window.setInterval(() => {
        if (initPaddle()) window.clearInterval(poll);
      }, 500);
      return () => window.clearInterval(poll);
    }
  }, []);

  const Loaders = userLoading || plansLoading;
  const intervals = userData?.billingInterval === "year" ? "Annual" : "Monthly";
  useEffect(() => {
    const reference = searchParams.get("reference");
    const success = searchParams.get("success");
    const transactionId =
      searchParams.get("transactionId") ||
      searchParams.get("paddle_transaction_id");

    if (reference && !verifyingRef.current) {
      verifyingRef.current = true;
      const tId = toast.loading("Verifying your payment...", {
        description: "Checking status...",
      });

      verifyMutation.mutate(reference, {
        onSuccess: () => {
          toast.success("Account successfully upgraded!", {
            id: tId,
            description:
              "Your new limits are now active across the edge network.",
          });
          refetch();
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
    } else if (transactionId && !verifyingRef.current) {
      verifyingRef.current = true;
      const tId = toast.loading("Verifying Paddle transaction...", {
        description: "Your upgrade is being processed.",
      });

      verifyPaddle.mutate(transactionId, {
        onSuccess: () => {
          toast.success("Account upgraded successfully!", { id: tId });
          refetch();
        },
        onError: (err: any) => {
          toast.error("Verification failed", {
            id: tId,
            description:
              err.message ||
              "Manual check failed. Webhook should trigger soon.",
          });
          verifyingRef.current = false;
        },
      });
    } else if (success === "true" && !reference && !transactionId) {
      toast.success("Account successfully upgraded!", {
        description: "Your billing status is being updated.",
      });
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const provider = "paddle";

  if (plansError) {
    const isRateLimited =
      plansError.message?.toLowerCase().includes("rate limit") ||
      plansError.message?.toLowerCase().includes("ip");

    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-md max-w-md shadow-2xl">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
              isRateLimited ? "bg-orange-500/10" : "bg-red-500/10",
            )}
          >
            {isRateLimited ? (
              <Activity className="h-8 w-8 text-orange-500" />
            ) : (
              <HelpCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {isRateLimited ? "Rate Limited" : "Pricing Unavailable"}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {plansError.message ||
              "We're having trouble retrieving current plan details. Please refresh or contact support."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className={cn(
              "w-full shadow-lg",
              isRateLimited
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                : "bg-red-500 hover:bg-red-600 shadow-red-500/20",
            )}
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const handleCheckout = async (
    planId: string,
    intervalArg: "month" | "year",
  ) => {
    setSelectedPlanId(planId);
    const tId = toast.loading("Redirecting to payment gateway...", {
      description: "Preparing your secure checkout session.",
    });

    try {
      const response: any = await checkoutMutation.mutateAsync({
        planId,
        provider,
        interval: intervalArg,
        redirectUrl: `${window.location.origin}/dashboard/billing?success=true`,
        callbackUrl: `${window.location.origin}/dashboard/billing?success=true`,
      });

      if (response.provider === "paddle") {
        if (!window.Paddle) {
          throw new Error(
            "Paddle.js failed to load. Please refresh and try again.",
          );
        }
        window.Paddle.Checkout.open({
          settings: {
            displayMode: "overlay",
            theme: "dark",
            locale: "en",
            successUrl: response.redirectUrl,
          },
          items: [
            {
              priceId: response.priceId,
              quantity: 1,
            },
          ],
          customer: response.email?.endsWith("@solana.pdfbridge.xyz") ? undefined : {
            email: response.email,
          },

          customData: {
            userId: response.userId,
            organizationId: response.organizationId,
            planId: planId,
            product_name: `PDFBridge ${plansData.find((p: any) => p.id === planId)?.name}`,
            description: "Unlimited PDFs, no stress",
          },
          eventCallback: async (data: any) => {
            if (data.name === "checkout.completed") {
              const transactionId = data.data.transaction_id;
              const tId2 = toast.loading("Verifying your upgrade...");
              try {
                await verifyPaddle.mutateAsync(transactionId);
                toast.success("Account upgraded successfully!", { id: tId2 });
                refetch();
              } catch (err: any) {
                console.error("Paddle verification failed:", err);
                toast.error(
                  "Upgrade verification failed. Please contact support.",
                  { id: tId2 },
                );
              }
            }
          },
        });
        toast.dismiss(tId);
      } else {
        const checkoutUrl = response.url || response.authorization_url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else if (response.success) {
          toast.success(response.message || "Account upgraded successfully!", {
            id: tId,
          });
          refetch();
        }
      }
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(error.message || "Failed to initiate checkout", { id: tId });
    } finally {
      setSelectedPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing cycle.",
      )
    )
      return;
    try {
      await cancelMutation.mutateAsync();
      toast.success("Subscription cancelled successfully.");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel subscription");
    }
  };

  const planOrder = ["Builder", "Startup", "Growth", "Scale", "Enterprise"];
  const plans = (plansData || [])
    .filter((p: any) => p.name !== "Test" && p.name !== "Test Mode")
    .sort(
      (a: any, b: any) => planOrder.indexOf(a.name) - planOrder.indexOf(b.name),
    );

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8">
          <div className="flex max-md:flex-col justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Infrastructure-Grade{" "}
                <span className="text-blue-500">Scaling</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Provision globally distributed PDF infrastructure. Seamlessly
                scale from sandboxes to enterprise-grade clusters.
              </p>
            </div>

            <div className="flex items-center justify-end max-md:w-full">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Billing Cycle
                </span>
                <div className="flex p-1 rounded-xl bg-slate-900 border border-white/5 gap-1 w-fit">
                  {(["month", "year"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setInterval(item)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                        {
                          "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20":
                            interval === item,
                          "text-slate-400 hover:text-white hover:bg-white/5":
                            interval !== item,
                        },
                      )}
                    >
                      {item === "month" ? "Monthly" : "Annual"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Active Subscription Management */}

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 backdrop-blur-md">
            {Loaders ? (
              <ActiveSubSkeleton />
            ) : (
              (userData?.plan?.priceUsd > 0 ||
                userData?.plan?.priceNgn > 0) && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-2xl bg-blue-500/10">
                      <ShieldCheck className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Active {userData.plan.name} Subscription
                      </h2>
                      <p className="text-sm text-slate-400">
                        You are currently on the {userData.plan.name}{" "}
                        {intervals} plan. Managed via{" "}
                        {billingInfo?.provider || "our secure gateway"}.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {billingInfo?.portalUrl ? (
                      <Link href={billingInfo.portalUrl} target="_blank">
                        <Button
                          variant="outline"
                          className="gap-2 border-white/5 hover:bg-white/5"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                          Manage Billing Portal
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={cancelMutation.isPending}
                        className="gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/40"
                      >
                        <XCircle className="h-4 w-4" />
                        {cancelMutation.isPending
                          ? "Cancelling..."
                          : "Cancel Subscription"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Monthly Capacity — top-up pack entry point */}
          {!Loaders &&
            userData?.plan?.priceUsd > 0 &&
            provider === "paddle" &&
            (() => {
              const used = userData?.usage?.intelligenceCount || 0;
              const bonus = userData?.usage?.bonusWorkflows || 0;
              const planLimit =
                userData?.plan?.intelligenceLimit || userData?.plan?.limit || 0;
              const effective = planLimit + bonus;
              const pct =
                effective > 0 ? Math.min((used / effective) * 100, 100) : 0;
              const isAtLimit = used >= effective;
              const isWarning = pct >= 80 && !isAtLimit;

              const handleTopup = async () => {
                const tId = toast.loading("Preparing capacity purchase...");
                try {
                  const response: any = await topupCheckout.mutateAsync(1);
                  if (!window.Paddle)
                    throw new Error(
                      "Paddle.js not loaded. Refresh and try again.",
                    );
                  toast.dismiss(tId);
                  window.Paddle.Checkout.open({
                    settings: {
                      displayMode: "overlay",
                      theme: "dark",
                      locale: "en",
                    },
                    items: [{ priceId: response.priceId, quantity: 1 }],
                    customer: response.email?.endsWith("@solana.pdfbridge.xyz") ? undefined : { email: response.email },
                    customData: {
                      type: "topup",
                      userId: response.userId,
                      organizationId: response.organizationId,
                      quantity: 1,
                    },
                    eventCallback: async (data: any) => {
                      if (data.name === "checkout.completed") {
                        const tid = data.data.transaction_id;
                        const t2 = toast.loading(
                          "Adding workflows to your account...",
                        );
                        try {
                          await verifyTopup.mutateAsync(tid);
                          toast.success("50 workflows added!", {
                            id: t2,
                            description:
                              "Your capacity has been updated. Happy invoicing.",
                          });
                        } catch {
                          toast.error("Verification failed", {
                            id: t2,
                            description:
                              "Webhook will retry. Contact support if workflows don't appear.",
                          });
                        }
                      }
                    },
                  });
                } catch (err: any) {
                  toast.error(err.message || "Failed to open checkout", {
                    id: tId,
                  });
                }
              };

              return (
                <div
                  className={cn(
                    "rounded-3xl border p-8 backdrop-blur-md space-y-5",
                    isAtLimit
                      ? "border-red-500/30 bg-red-500/5"
                      : isWarning
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-blue-500/20 bg-blue-500/5",
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Monthly Capacity
                      </h2>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {used.toLocaleString()} / {effective.toLocaleString()}{" "}
                        workflows used
                        {bonus > 0 && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            +{bonus} BONUS
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      id="topup-buy-more-btn"
                      onClick={handleTopup}
                      disabled={topupCheckout.isPending}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 disabled:opacity-50",
                        isAtLimit
                          ? "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20"
                          : isWarning
                            ? "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
                      )}
                    >
                      {topupCheckout.isPending
                        ? "Preparing..."
                        : "Buy 50 More Workflows — $9"}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        isAtLimit
                          ? "bg-red-500"
                          : isWarning
                            ? "bg-amber-500"
                            : "bg-emerald-500",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {isAtLimit && (
                    <p className="text-xs text-red-400">
                      You&apos;ve reached your monthly limit. Buy a top-up pack
                      to continue, or upgrade your plan.
                    </p>
                  )}
                </div>
              );
            })()}

          {/* Pricing Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Loaders
              ? Array.from({ length: 3 }).map((_, index) => (
                  <PlanCardSkeleton key={index} />
                ))
              : plans.map((plan: any) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    userData={userData}
                    onCheckout={handleCheckout}
                    isCheckoutPending={checkoutMutation.isPending}
                    selectedPlanId={selectedPlanId}
                    forcedInterval={interval}
                  />
                ))}
          </div>

          {/* Billing History */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <Receipt className="h-5 w-5 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Billing History</h2>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-1 overflow-x-auto scrollbar-hide">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {userData?.plan?.priceUsd > 0 ||
                  userData?.plan?.priceNgn > 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(
                          userData?.planStartedAt || userData?.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        ${(
                          userData.plan.priceUsd / 100
                        ).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                          Paid
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 italic text-xs">
                        Sent via Email
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500 italic"
                      >
                        No payment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                  We partner with industry-leading payment processors to ensure
                  your data is always safe. Paddle handles international tax
                  compliance to provide seamless global transactions.
                </p>
              </div>
              <div className="flex gap-4 pt-4 grayscale opacity-50 flex-wrap">
                <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-400">
                  VISA
                </div>
                <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-400">
                  MASTERCARD
                </div>
                <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-400">
                  APPLE PAY
                </div>
                <div className="px-3 py-1 rounded border border-white/10 text-[10px] font-bold text-slate-400">
                  BANK TRANSFER
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-muted bg-slate-900/40 space-y-6 flex flex-col justify-center">
              <SmartContactLink
                email="sales@techhspyder.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group cursor-pointer transition-all hover:border-blue-500/30 text-left"
              >
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
              </SmartContactLink>

              <SmartContactLink
                email="support@techhspyder.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 group cursor-pointer transition-all hover:border-emerald-500/30 text-left"
              >
                <ShieldCheck className="h-6 w-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm">
                    14-Day Money Back Guarantee
                  </h4>
                  <p className="text-xs text-slate-400">
                    Not satisfied? We offer full refunds within 14 days of
                    upgrade.
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </SmartContactLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ActiveSubSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full animate-pulse">
      <div className="flex gap-4 items-center w-full">
        <div className="p-3 rounded-2xl h-10 w-10! skeleton-el" />
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl font-bold text-white h-6 w-[40%]! skeleton-el" />
          <div className="text-sm text-slate-400 h-4 w-[50%]! skeleton-el" />
        </div>
      </div>
      <div className="flex gap-3  w-[30%]!">
        <div className="h-10 skeleton-el w-full!" />
      </div>
    </div>
  );
}
