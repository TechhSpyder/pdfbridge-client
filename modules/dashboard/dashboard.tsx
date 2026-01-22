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
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useMe } from "../hooks/queries";

export function DashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: userData, isLoading: beLoading, error } = useMe();

  // Check if new user (created within last minute of sign in)
  const isNewUser =
    clerkUser?.createdAt && clerkUser?.lastSignInAt
      ? Math.abs(
          clerkUser.createdAt.getTime() - clerkUser.lastSignInAt.getTime(),
        ) < 60000
      : false;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!clerkLoaded || beLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 relative z-10" />
        </div>
        <p className="text-slate-400 font-medium animate-pulse">
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

  const keyHint = userData?.id
    ? `${btoa(userData.id)}.••••••••`
    : "sk_loading_••••••••";

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
          <Link href="/docs" target="_blank">
            <Button
              variant="outline"
              className="gap-2 flex items-center justify-center"
            >
              <FileText className="h-4 w-4" />
              API Docs
            </Button>
          </Link>
        </div>
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
                  Reset in 12 days
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
          sub="1 Active Identifier"
          icon={<Key className="h-5 w-5 text-emerald-500" />}
          content={
            <div className="mt-4 space-y-4">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between group/key">
                <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                  {keyHint}
                </code>
                <button
                  onClick={() => copyToClipboard(keyHint)}
                  title="Copy hint"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-500 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <Link href="/dashboard/api-keys" className="block">
                <Button
                  variant="outline"
                  className="w-full text-xs h-9 gap-2 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400"
                >
                  Manage & Rotate <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          }
        />

        <GlowCard
          title="Infrastructure Plan"
          sub={userData?.plan?.name || "Standard Free"}
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          content={
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                  Active Subscription
                </span>
              </div>
              <Link href="/dashboard/settings" className="block">
                <Button className="w-full text-xs h-9 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Quick Start Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800/50">
              <Terminal className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Quick Start Guide</h2>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
            <div className="flex border-b border-white/5 bg-black/20">
              <button className="px-6 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-500">
                cURL
              </button>
              <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-300">
                Node.js
              </button>
              <button className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-300">
                Python
              </button>
            </div>
            <div className="p-6 bg-black/40 relative group">
              <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {`curl -X POST http://localhost:3001/api/v1/convert \\
  -H "X-API-Key: ${keyHint.replace("••••••••", "secret_key")}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://google.com",
    "options": { "format": "A4" }
  }'`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    "curl -X POST https://api.pdfbridge.io/v1/convert ...",
                  )
                }
                className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl"
              >
                <Copy className="h-4 w-4 text-slate-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Console / Log Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-800/20">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <Link
              href="/dashboard/usage"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600">
              <Activity className="h-8 w-8" />
            </div>
            <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
              No conversion attempts recorded in this billing cycle.
            </p>
            <Button
              variant="outline"
              className="mt-6 text-xs h-9 border-white/10 hover:bg-white/5"
            >
              Run Test Conversion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons that were missing
function FileText({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
