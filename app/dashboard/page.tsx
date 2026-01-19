"use client";

import { useUser } from "@clerk/nextjs";
import { useMe } from "@/app/api/hooks";
import { Loader2, AlertCircle, Zap, Key, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: userData, isLoading: beLoading, error } = useMe();

  // if (!clerkLoaded || beLoading) {
  //   return (
  //     <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
  //       <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  //       <p className="text-slate-400 animate-pulse">
  //         Synchronizing your dashboard...
  //       </p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex h-[60vh] items-center justify-center p-6">
  //       <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-sm max-w-md">
  //         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
  //         <h2 className="text-xl font-bold text-white mb-2">
  //           Connection Error
  //         </h2>
  //         <p className="text-slate-400 mb-6">
  //           We couldn't reach the backend. Please check your connection or wait
  //           for sync.
  //         </p>
  //         <button
  //           onClick={() => window.location.reload()}
  //           className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
  //         >
  //           Retry Connection
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const usageCount = userData?.usage?.count || 0;
  const usageLimit = userData?.plan?.limit || 5;
  const usagePercentage = Math.min((usageCount / usageLimit) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {clerkUser?.firstName || "Developer"}
        </h1>
        <p className="mt-2 text-slate-400">
          Monitor your PDF conversion jobs and manage your API keys.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Usage Stats */}
        <div className="group rounded-xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-900/80 hover:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">
              Monthly Usage
            </h3>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">
              {usageCount}{" "}
              <span className="text-lg font-normal text-slate-500">
                / {usageLimit}
              </span>
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500">
              {userData?.usage?.month}/{userData?.usage?.year} billing period
            </p>
          </div>
        </div>

        {/* API Stats */}
        <div className="group rounded-xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-900/80 hover:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">
              Active API Keys
            </h3>
            <Key className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-white">1</p>
            <p className="text-xs text-slate-500 font-mono truncate">
              {clerkUser?.id?.substring(0, 12)}... (Primary)
            </p>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-1">
              Manage Keys →
            </button>
          </div>
        </div>

        {/* Plan Info */}
        <div className="group rounded-xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:bg-slate-900/80 hover:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">Account Plan</h3>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-4">
            <p className="text-3xl font-bold text-amber-500">
              {userData?.plan?.name || "Free"}
            </p>
            <button className="w-full text-sm font-semibold text-white bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              Upgrade Plan
            </button>
          </div>
        </div>
      </div>

      {/* Activity Table Placeholder */}
      <div className="rounded-xl border border-white/5 bg-slate-900/50 overflow-hidden backdrop-blur-sm">
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-sm text-slate-400 hover:text-white transition">
            View all
          </button>
        </div>
        <div className="p-16 text-center">
          <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-6 w-6 text-slate-600" />
          </div>
          <p className="text-slate-500">No conversion jobs found yet.</p>
          <button className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-400 underline underline-offset-4">
            Try your first conversion
          </button>
        </div>
      </div>
    </div>
  );
}
