"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#020617]">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-r-2 border-l-2 border-indigo-500 animate-spin-slow"></div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center text-center">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Preparing your environment
        </h2>
        <p className="mt-2 text-slate-400 max-w-xs">
          Initialising secure bridges and optimising performance for your
          documents.
        </p>
        <div className="mt-6 flex items-center gap-2 text-blue-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Just a moment...</span>
        </div>
      </div>
    </div>
  );
}
