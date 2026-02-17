import { useConversions } from "@/modules/hooks/queries";
import { Activity, Copy, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export function RecentConversionsList() {
  const [pollInterval, setPollInterval] = useState<number | undefined>(30000);
  const { data, isLoading } = useConversions(1, 5, pollInterval);
  const conversions = data?.conversions || [];

  const hasPending = conversions.some((c: any) => c.status === "PENDING");

  useEffect(() => {
    if (hasPending) {
      setPollInterval(3000); // Fast poll when things are happening
    } else {
      setPollInterval(30000); // Slow poll otherwise
    }
  }, [hasPending]);

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600">
          <Activity className="h-8 w-8" />
        </div>
        <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
          No conversion attempts recorded in this billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversions.map((conv: any) => (
        <div
          key={conv.id}
          className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate max-w-[150px]">
              {conv.url && conv.url.startsWith("http")
                ? new URL(conv.url).hostname
                : "HTML Payload"}
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date(conv.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {conv.status === "PENDING" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                Pending
              </span>
            ) : conv.status === "EXPIRED" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Expired
              </span>
            ) : conv.status === "FAILED" || !conv.success ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                Failed
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    conv.isTestMode
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}
                >
                  {conv.isTestMode ? "TEST" : "LIVE"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                  Ready
                </span>
              </div>
            )}

            {conv.success && conv.status !== "EXPIRED" && (
              <div className="flex items-center gap-1">
                <Link
                  href={conv.url}
                  target="_blank"
                  download
                  title="Download PDF"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(conv.url);
                    toast.success("URL copied to clipboard");
                  }}
                  title="Copy URL"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
