"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "../app/button";
import { GlowCard } from "../app/glow-card";

import {
  Loader2,
  AlertCircle,
  Zap,
  Key,
  Activity,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Code2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useMe } from "../hooks/queries";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "@/utils";

const RecentConversionsList = dynamic(
  () =>
    import("./index/recent-converion").then((mod) => mod.RecentConversionsList),
  { ssr: false },
);
const ApiPlayground = dynamic(
  () => import("./index/api-playgorund").then((mod) => mod.ApiPlayground),
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

export function DashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: userData, isLoading: beLoading, error } = useMe();
  const liveClipboard = useClipboard();
  const testClipboard = useClipboard();

  // Check if new user (created within last minute of sign in)
  const isNewUser =
    clerkUser?.createdAt && clerkUser?.lastSignInAt
      ? Math.abs(
          clerkUser.createdAt.getTime() - clerkUser.lastSignInAt.getTime(),
        ) < 60000
      : false;

  const isLoading = !clerkLoaded || beLoading;

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

  const usageCount = userData?.usage?.count || 0;
  const usageLimit = userData?.plan?.limit || 5;
  const usagePercentage = Math.min((usageCount / usageLimit) * 100, 100);

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

  // Create more realistic full keys for UI feedback
  const userIdHash = userData?.id
    ? btoa(userData.id).slice(0, 16)
    : "secure_identifier";
  const liveKeyFull = `pk_live_${userIdHash}${userData?.createdAt ? new Date(userData.createdAt).getTime().toString(16) : "0000"}`;
  const testKeyFull = `pk_test_${userIdHash}${userData?.createdAt ? new Date(userData.createdAt).getTime().toString(16) : "0000"}`;

  // Masked hints for UI display
  const liveKeyHint = "pk_live_••••••••";
  const testKeyHint = "pk_test_••••••••";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="">
          {isLoading ? (
            <div className="w-full h-10 skeleton-el animate-pulse!" />
          ) : (
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {isNewUser ? "Welcome, " : "Welcome back, "}
              <span className="text-blue-500">
                {clerkUser?.firstName || "Developer"}
              </span>
            </h1>
          )}

          <p className="mt-2 text-slate-400 max-w-2xl text-sm md:text-base">
            Your document infrastructure is active. Monitor performance, manage
            API keys, and track conversions in real-time.
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
                Conversion Trends
              </h2>
              <p className="text-sm text-slate-500">
                Daily conversion volume for this billing cycle
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
          <UsageGraph />
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
                  Recent Conversions
                </h2>
              </div>

              <span className="hidden md:inline text-[10px] text-slate-500 font-medium">
                Updates automatically as jobs complete
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/usage"
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <RecentConversionsList />
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-muted bg-background h-[200px] md:h-[320px] p-4 md:p-8 backdrop-blur-sm animate-pulse"
              style={{
                background: "rgba(15,23,42,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ))
        ) : (
          <>
            <GlowCard
              title="Monthly Requests"
              sub={`${usageCount} / ${usageLimit}`}
              icon={<Activity className="h-5 w-5 text-blue-500" />}
              content={
                <div className="mt-4 space-y-3">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">
                      Reset in {daysUntilReset}{" "}
                      {daysUntilReset === 1 ? "day" : "days"}
                    </span>
                    <span className="text-blue-400 font-bold">
                      {Math.round(usagePercentage)}% utilized
                    </span>
                  </div>
                </div>
              }
            />

            <GlowCard
              title="Secret Keys"
              sub="Dual Mode (Live & Test)"
              icon={<Key className="h-5 w-5 text-emerald-500" />}
              content={
                <div className="mt-4 space-y-3">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between group/key">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-slate-500">
                        Live
                      </span>
                      <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                        {liveKeyHint}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        liveClipboard.copy(
                          liveKeyFull,
                          "Live key copied to clipboard.",
                        );
                      }}
                      className="p-1 hover:bg-white/10 rounded transition text-slate-500 hover:text-white"
                    >
                      {liveClipboard.copied ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border flex items-center justify-between group/key border-orange-500/10">
                    <div className="flex flex-col">
                      <span className="text-[8px] uppercase font-bold text-orange-500/70">
                        Test
                      </span>
                      <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                        {testKeyHint}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        testClipboard.copy(
                          testKeyFull,
                          "Test key copied to clipboard.",
                        );
                      }}
                      className="p-1 hover:bg-white/10 rounded transition text-slate-500 hover:text-white"
                    >
                      {testClipboard.copied ? (
                        <Check className="h-3 w-3 text-orange-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>

                  <Link href="/dashboard/api-keys" className="block pt-1">
                    <Button
                      variant="outline"
                      className="w-full text-[10px] h-8 gap-2 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400"
                    >
                      Manage & Rotate <ExternalLink className="h-2.5 w-2.5" />
                    </Button>
                  </Link>
                </div>
              }
            />

            <GlowCard
              title="Current Plan"
              sub={userData?.plan?.name || "Standard Free"}
              icon={<Zap className="h-5 w-5 text-amber-500" />}
              content={
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {userData?.plan?.limit.toLocaleString()} conversions / mo
                  </div>
                  <Link href="/dashboard/billing" className="block">
                    <Button
                      variant="outline"
                      className="w-full text-xs h-9 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                    >
                      View Details & Billing
                    </Button>
                  </Link>
                </div>
              }
            />
          </>
        )}
      </div>

      {/* Upgrade Prompts */}
      <UsageAlert usagePercentage={usagePercentage} />

      <div className="flex items-stretch gap-6 w-full">
        {/* API Playground Section */}
        <div className="w-full flex gap-6 max-lg:flex-col">
          <div className="lg:w-1/2 space-y-2.5 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <Terminal className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">API Playground</h2>
            </div>

            <ApiPlayground />
          </div>
          <div className="lg:w-1/2 space-y-2.5 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-800/20">
                <Code2 className="h-5 w-5 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Integration Snippets
              </h2>
            </div>
            <IntegrationSnippets />
          </div>
        </div>
      </div>
    </div>
  );
}
