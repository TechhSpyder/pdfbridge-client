"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "../app/button";
import { GlowCard } from "../app/glow-card";

import {
  AlertCircle,
  Zap,
  Key,
  Plus,
  Check,
  Terminal,
  BookOpen,
  ShieldCheck,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useMe, useApiKeys, useTopupCheckout, useVerifyTopup } from "../hooks/queries";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { cn } from "@/utils";
import type { ApiKey } from "../types";

const RecentActivityList = dynamic(
  () =>
    import("./index/recent-activity").then(
      (mod) => mod.RecentActivityList,
    ),
  { ssr: false },
);
const ApiPlayground = dynamic(
  () => import("./index/api-playground").then((mod) => mod.ApiPlayground),
  { ssr: false },
);
const IntegrationSnippets = dynamic(
  () => import("./index/integration").then((mod) => mod.IntegrationSnippets),
  { ssr: false },
);
const UsageAlert = dynamic(
  () => import("./index/usage-alert").then((mod) => mod.UsageAlert),
  { ssr: false },
);
const UsageGraph = dynamic(
  () => import("./index/usage-graph").then((mod) => mod.UsageGraph),
  { ssr: false },
);
const QuickStartPipeline = dynamic(
  () =>
    import("./index/quickstart-pipeline").then((mod) => mod.QuickStartPipeline),
  { ssr: false },
);

export function DashboardPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const { data: userData, isLoading: beLoading, error } = useMe();
  const { data: apiKeysData, isLoading: keysLoading } = useApiKeys();

  const isNewUser = session?.user?.createdAt
    ? Math.abs(
        new Date(session.user.createdAt).getTime() - new Date().getTime(),
      ) < 60000
    : false;

  const topupCheckout = useTopupCheckout();
  const verifyTopup = useVerifyTopup();

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

  const handleTopup = async () => {
    const tId = toast.loading("Preparing capacity purchase...");
    try {
      const response: any = await topupCheckout.mutateAsync(1);
      if (!window.Paddle) throw new Error("Paddle.js not loaded. Refresh and try again.");
      toast.dismiss(tId);
      
      const isDummyEmail = response.email?.endsWith("@solana.pdfbridge.xyz");

      window.Paddle.Checkout.open({
        settings: { displayMode: "overlay", theme: "dark", locale: "en" },
        items: [{ priceId: response.priceId, quantity: 1 }],
        customer: isDummyEmail ? undefined : { email: response.email },
        customData: {
          type: "topup",
          userId: response.userId,
          organizationId: response.organizationId,
          quantity: 1,
        },
        eventCallback: async (data: any) => {
          if (data.name === "checkout.completed") {
            const tid = data.data.transaction_id;
            const t2 = toast.loading("Adding workflows to your account...");
            try {
              await verifyTopup.mutateAsync(tid);
              toast.success("50 workflows added!", {
                id: t2,
                description: "Your capacity has been updated. Happy invoicing.",
              });
            } catch {
              toast.error("Verification failed", {
                id: t2,
                description: "Webhook will retry. Contact support.",
              });
            }
          }
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to open checkout", { id: tId });
    }
  };

  const isLoading = sessionLoading || beLoading;

  if (error) {
    const isRateLimited =
      error.message?.toLowerCase().includes("rate limit") ||
      error.message?.toLowerCase().includes("ip");
    const isAuthError =
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("session");

    return (
      <div className="flex h-[60vh] items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-md max-w-md shadow-2xl relative overflow-hidden group">
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500",
              isRateLimited ? "bg-orange-500/10" : "bg-red-500/10",
            )}
          >
            {isRateLimited ? (
              <Activity className="h-10 w-10 text-orange-500" />
            ) : (
              <AlertCircle className="h-10 w-10 text-red-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {isRateLimited
              ? "Rate Limit Exceeded"
              : isAuthError
                ? "Authentication Required"
                : "Connection Error"}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {error.message ||
              "We couldn't connect to your backend environment. This usually happens during synchronization."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className={cn(
              "w-full shadow-lg h-12 text-sm font-bold",
              isRateLimited
                ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                : "bg-red-500 hover:bg-red-600 shadow-red-500/20",
            )}
          >
            {isRateLimited ? "Try Again Later" : "Retry Connection"}
          </Button>
        </div>
      </div>
    );
  }

  // Unified invoice workflow metric.
  // intelligenceCount tracks the settlement/compiler flow — the primary product.
  // Both intelligenceLimit and plan.limit are now equal (set by update-plan-limits.sql).
  const workflowsUsed = userData?.usage?.intelligenceCount || 0;
  const workflowsBonus = userData?.usage?.bonusWorkflows || 0;
  const workflowsBaseLimit = userData?.plan?.intelligenceLimit || userData?.plan?.limit || 5;
  const workflowsEffectiveLimit = workflowsBaseLimit + workflowsBonus;
  const usagePercentage = workflowsEffectiveLimit > 0
    ? Math.min((workflowsUsed / workflowsEffectiveLimit) * 100, 100)
    : 0;

  const getDaysUntilReset = () => {
    const anchorDate = userData?.planStartedAt || userData?.createdAt;
    if (!anchorDate) return 0;

    const now = new Date();
    const joined = new Date(anchorDate);
    const day = joined.getDate();

    // Target date in current month
    let target = new Date(now.getFullYear(), now.getMonth(), day);

    // If target has passed, move to next month
    if (now.getDate() >= day) {
      target = new Date(now.getFullYear(), now.getMonth() + 1, day);
    }

    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilReset = getDaysUntilReset();

  // Metadata from decoupled keys endpoint
  const liveKeyData = apiKeysData?.keys?.find((k: ApiKey) => k.type === "live");
  const testKeyData = apiKeysData?.keys?.find((k: ApiKey) => k.type === "test");
  const hasKeys = apiKeysData?.keys && apiKeysData.keys.length > 0;

  const liveKeyHint = liveKeyData?.hint || "pk_live_••••••••";
  const testKeyHint = testKeyData?.hint || "pk_test_••••••••";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="">
          {isLoading ? (
            <div className="w-full h-10 skeleton-el animate-pulse!" />
          ) : (
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {isNewUser ? "Welcome, " : "Welcome back, "}
                <span className="text-blue-500">
                  {session?.user?.name?.split(" ")[0] || "Engineer"}
                </span>
              </h1>
              {userData?.organizationName && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    Workspace
                  </span>
                  <span className="text-slate-300 text-sm font-medium">
                    {userData.organizationName}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="mt-2 text-slate-400 max-w-2xl text-sm md:text-base">
            Institutional Invoice Infrastructure active. Monitor deterministic
            execution performance, manage settlement keys, and track high-fidelity activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/docs">
            <Button
              variant="outline"
              className="gap-2 flex items-center justify-center border-white/5 hover:bg-white/5 font-bold"
            >
              <BookOpen className="h-4 w-4" />
              API Docs
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-stretch gap-6 justify-between max-md:flex-col">
        {/* Usage Analytics Graph */}
        <div className="rounded-2xl border border-white/15 bg-slate-900/30 p-4 md:p-8 backdrop-blur-sm md:w-[60%] w-full">
          <div className="flex md:items-center justify-between mb-8 max-sm:flex-col gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">
                Processing Trends
              </h2>
              <p className="text-sm text-slate-500">
                Daily invoice throughput — active billing cycle
              </p>
            </div>
            <div className="flex bg-black/40 rounded-lg p-1 border border-white/5 justify-end">
              <button className="px-3 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-md shadow-lg cursor-pointer transition-all active:scale-95">
                7 Days
              </button>
              <button
                onClick={() => toast.info("30-day analytics unlocking in V1.1")}
                className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-300 cursor-pointer transition-all active:scale-95"
              >
                30 Days
              </button>
            </div>
          </div>
          {userData?.usage?.hasExecutions ? (
            <UsageGraph />
          ) : (
            <QuickStartPipeline testKeyFull={testKeyHint} hasKeys={hasKeys} />
          )}
        </div>
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-slate-900/50 border-white/15 backdrop-blur-sm space-y-6 border p-4 rounded-2xl flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-800/20">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Recent Activity
                </h2>
              </div>

              <span className="hidden md:inline text-[10px] text-slate-500 font-medium">
                Live pipeline feed · Syncs every 30s
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/usage"
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                Full Ledger
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <RecentActivityList />
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/5 bg-slate-900/20 h-[200px] md:h-[280px] p-4 md:p-8 backdrop-blur-sm animate-pulse"
                />
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/5 bg-slate-900/20 h-[200px] md:h-[280px] p-4 md:p-8 backdrop-blur-sm animate-pulse"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <GlowCard
                title="Audit Integrity"
                sub={
                  workflowsBaseLimit > 10
                    ? "Reconciliation Active"
                    : "Startup+ Feature"
                }
                icon={<ShieldCheck className="h-5 w-5 text-indigo-500" />}
                content={
                  <div className="mt-4 space-y-3">
                    {workflowsBaseLimit > 10 ? (
                      <>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full bg-linear-to-r from-indigo-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            style={{ width: `100%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-medium">
                            Totals, tax &amp; multi-currency — reconciled to 6 decimal places
                          </span>
                          <span className="text-emerald-400 font-bold">
                            SECURE
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Zero-error arithmetic across totals, tax, and multi-currency invoices. Every figure is deterministically verified before settlement.
                        </p>
                        <Link
                          href="/dashboard/billing"
                          className="flex items-center justify-between text-xs bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20 text-indigo-400 font-bold hover:bg-indigo-500/15 transition-colors"
                        >
                          <span>Unlock on Startup</span>
                          <span className="text-indigo-500">$19 / mo →</span>
                        </Link>
                      </div>
                    )}
                  </div>
                }
              />

              <GlowCard
                title="Active Plan"
                sub={userData?.plan?.name || "Builder"}
                icon={<Zap className="h-5 w-5 text-amber-500" />}
                content={
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      {workflowsBaseLimit.toLocaleString()} invoice workflows / mo
                    </div>
                    <Link href="/dashboard/billing" className="block">
                      <Button
                        variant="outline"
                        className="w-full text-xs h-9 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                      >
                        Manage Plan & Add-ons
                      </Button>
                    </Link>
                  </div>
                }
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-slate-900/30 p-6 md:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Key className="h-5 w-5 text-emerald-500" />
                      API Keys
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Live &amp; Test environments
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-3 relative z-10 flex-col flex-1 flex justify-center">
                  {!hasKeys ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                      <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Key className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                          No credentials provisioned. Generate your key pair to authenticate requests against the live environment.
                        </p>
                      </div>
                      <Link href="/dashboard/api-keys" className="w-full">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 h-10 text-xs font-bold gap-2">
                          <Plus className="h-4 w-4" />
                          Provision API Keys
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex sm:items-center gap-3.5 max-sm:flex-col">
                        <div className="p-2.5 rounded-lg sm:w-1/2 bg-black/40 border border-white/10 flex items-center justify-between group/key transition-colors hover:border-emerald-500/30">
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-bold text-slate-500">
                              Live
                            </span>
                            <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                              {liveKeyHint}
                            </code>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg sm:w-1/2 bg-black/40 border flex items-center justify-between group/key border-white/10 transition-colors hover:border-orange-500/30">
                          <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-bold text-orange-500/70">
                              Test
                            </span>
                            <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                              {testKeyHint}
                            </code>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] mt-2 bg-white/5 p-2 rounded-lg">
                        <p className="text-slate-400">
                          Never commit keys to version control or expose them client-side.
                        </p>
                        <Link
                          href="/dashboard/api-keys"
                          className="text-emerald-400 font-bold hover:underline"
                        >
                          Manage Keys
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <GlowCard
                title="Workflow Capacity"
                sub={
                  workflowsBonus > 0
                    ? `+${workflowsBonus} bonus active · ${Math.max(0, workflowsEffectiveLimit - workflowsUsed)} remaining`
                    : `${Math.max(0, workflowsEffectiveLimit - workflowsUsed).toLocaleString()} of ${workflowsEffectiveLimit} remaining`
                }
                icon={<Zap className="h-5 w-5 text-fuchsia-500" />}
                content={
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-3 flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Used</span>
                        <span className="text-2xl font-black text-white">{workflowsUsed.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-600">invoice workflows</span>
                      </div>
                      <div className="rounded-xl bg-white/5 border border-white/5 p-3 flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Limit</span>
                        <span className="text-2xl font-black text-white">{workflowsEffectiveLimit.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-600">
                          {workflowsBonus > 0 ? `${workflowsBaseLimit} plan + ${workflowsBonus} pack` : `resets in ${daysUntilReset}d`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleTopup}
                      disabled={topupCheckout.isPending}
                      className="block w-full text-center py-2 rounded-xl text-xs font-bold transition-all active:scale-95 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 disabled:opacity-50 cursor-pointer"
                    >
                      {topupCheckout.isPending ? "Preparing..." : workflowsUsed >= workflowsEffectiveLimit
                        ? "Buy 50 More Workflows — $9"
                        : "Buy More Capacity — $9"}
                    </button>
                  </div>
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Upgrade Prompts */}
      <UsageAlert usagePercentage={usagePercentage} />

      <div className="flex items-stretch gap-6 w-full">
        {/* API Playground Section */}
        <div className="w-full">
          <div className="space-y-2.5 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <Terminal className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">API Playground</h2>
            </div>
            <ApiPlayground />
          </div>
        </div>
      </div>
    </div>
  );
}
