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
import { RecentConversionsList } from "./index/recent-converion";
import { ApiPlayground } from "./index/api-playgorund";
import { IntegrationSnippets } from "./index/integration";
import { UsageAlert } from "./index/usage-alert";
import { UsageGraph } from "./index/usage-graph";
import { useClipboard } from "../hooks/use-copy-to-clipboard";

export function DashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: userData, isLoading: beLoading, error } = useMe();
  const { copied, copy } = useClipboard();

  // Check if new user (created within last minute of sign in)
  const isNewUser =
    clerkUser?.createdAt && clerkUser?.lastSignInAt
      ? Math.abs(
          clerkUser.createdAt.getTime() - clerkUser.lastSignInAt.getTime(),
        ) < 60000
      : false;

  if (!clerkLoaded || beLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 relative z-10" />
        </div>
        <p className="text-slate-400 font-medium animate-pulse text-center">
          Synchronizing your developer workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-md max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Connection Error
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We couldn't connect to your backend environment. This usually
            happens during synchronization.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
          >
            Retry Connection
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
  const liveKeyHint = userData?.id ? `pk_live_••••••••` : "sk_loading_••••••••";
  const testKeyHint = userData?.id ? `pk_test_••••••••` : "sk_loading_••••••••";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isNewUser ? "Welcome, " : "Welcome back, "}
            <span className="text-blue-500">
              {clerkUser?.firstName || "Developer"}
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl">
            Manage your PDF infrastructure and monitor API performance across
            your applications.
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

      {/* Usage Analytics Graph */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Conversion Trends</h2>
            <p className="text-sm text-slate-500">
              Daily conversion volume for this billing cycle
            </p>
          </div>
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
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

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    copy(liveKeyHint, "Live key identifier copied.");
                  }}
                  className="p-1 hover:bg-white/10 rounded transition text-slate-500 hover:text-white"
                >
                  {copied ? (
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
                    copy(testKeyHint, "Test key identifier copied.");
                  }}
                  className="p-1 hover:bg-white/10 rounded transition text-slate-500 hover:text-white"
                >
                  {copied ? (
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
      </div>

      {/* Upgrade Prompts */}
      <UsageAlert usagePercentage={usagePercentage} />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* API Playground Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800/50">
              <Terminal className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">API Playground</h2>
          </div>

          <ApiPlayground />

          <div className="flex items-center gap-3 pt-6">
            <div className="p-2 rounded-lg bg-orange-800/20">
              <Code2 className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Integration Snippets
            </h2>
          </div>
          <IntegrationSnippets />
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm space-y-6 border border-muted p-4 rounded-lg">
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
    </div>
  );
}
