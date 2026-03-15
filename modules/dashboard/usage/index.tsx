"use client";

import { useConversions, useWebhookLogs } from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { Button } from "@/modules/app/button";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Activity,
  Ghost,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Title from "@/modules/app/title";

export function UsagePage() {
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "success" | "failed"
  >("all");
  const [dateFilter, setDateFilter] = useState<"all" | "7d" | "30d">("all");
  const [pollInterval, setPollInterval] = useState<number | undefined>(30000);
  const { data, isLoading, error } = useConversions(page, 10, pollInterval);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const allConversions = data?.conversions || [];
  const conversions = allConversions.filter((c: any) => {
    // 1. Status Filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" ? c.success : !c.success);

    // 2. Date Filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const convDate = new Date(c.createdAt);
      const now = new Date();
      const diffDays =
        (now.getTime() - convDate.getTime()) / (1000 * 3600 * 24);
      const limit = dateFilter === "7d" ? 7 : 30;
      matchesDate = diffDays <= limit;
    }

    return matchesStatus && matchesDate;
  });
  const pagination = data?.pagination;

  const hasPending = (data?.conversions || []).some(
    (c: any) => c.status === "PENDING",
  );

  useEffect(() => {
    if (hasPending) {
      setPollInterval(3000);
    } else {
      setPollInterval(30000);
    }
  }, [hasPending]);

  const exportToCSV = () => {
    if (!conversions.length) return;
    const headers = [
      "ID",
      "URL",
      "Environment",
      "Status",
      "Duration (ms)",
      "Date",
    ];
    const rows = conversions.map((c: any) => [
      c.id,
      c.url || "HTML Payload",
      c.isTestMode ? "TEST" : "LIVE",
      c.success ? "SUCCESS" : "FAILED",
      c.duration,
      new Date(c.createdAt).toISOString(),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pdfbridge-usage-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    const isRateLimited =
      error.message?.toLowerCase().includes("rate limit") ||
      error.message?.toLowerCase().includes("ip");

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
              <XCircle className="h-8 w-8 text-red-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {isRateLimited ? "Rate Limited" : "History Unavailable"}
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {error.message ||
              "We couldn't retrieve your conversion history. Please check your network and try again."}
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Title
          title="Usage & History"
          description="A complete log of your PDF generation history and API performance."
          icon={<FileText className="h-8 w-8 text-blue-500" />}
        />

        <div className="flex flex-wrap gap-2">
          <div className="flex bg-slate-900/80 border border-white/5 p-1 rounded-xl">
            {(["all", "7d", "30d"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setDateFilter(f)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer uppercase transition-all ${
                  dateFilter === f
                    ? "bg-slate-700 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f === "all" ? "All Time" : f}
              </button>
            ))}
          </div>

          <div className="flex bg-slate-900/80 border border-white/5 p-1 rounded-xl">
            {(["all", "success", "failed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer uppercase transition-all ${
                  statusFilter === f
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={!conversions.length}
            className="text-[10px] uppercase font-bold h-9 border-white/5 text-slate-400 hover:bg-white/5"
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-slate-500">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Resource / URL
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Points
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Duration
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-24">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-500">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span className="text-sm animate-pulse">
                        Loading conversions…
                      </span>
                    </div>
                  </td>
                </tr>
              ) : conversions.length > 0 ? (
                <AnimatePresence mode="wait">
                  {conversions.map((job: any, index: number) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.03,
                        ease: "easeOut",
                      }}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[300px]">
                          <span className="text-sm font-medium text-white truncate">
                            {job.url || "HTML Content"}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                            {job.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            job.isTestMode
                              ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {job.isTestMode ? "TEST" : "LIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.status === "PENDING" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            PENDING
                          </div>
                        ) : job.success ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            SUCCESS
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase">
                            <XCircle className="h-3 w-3" />
                            FAILED
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Activity className="h-3 w-3 text-blue-500/50" />
                          {job.creditsUsed || 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          {job.isGhostMode ? (
                            <div className="flex items-center gap-1 text-purple-400">
                              <Ghost className="h-3.5 w-3.5" />
                              <span className="text-[10px] font-bold">
                                GHOST
                              </span>
                            </div>
                          ) : (
                            formatBytes(job.fileSize)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="h-3 w-3 text-slate-600" />
                          {job.duration}ms
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">
                          {formatDate(job.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {job.webhookUrl && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-8 p-0 text-white w-full"
                              onClick={() => setSelectedJobId(job.id)}
                              title="Inspect Webhooks"
                            >
                              <Search className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {job.success && (
                            <Link
                              href={`https://api.pdfbridge.xyz/api/v1/jobs/${job.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-white"
                            >
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 p-0 w-full"
                              >
                                <Download className="h-3.5 w-3.5 text-white" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-24 text-center text-slate-500"
                  >
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                      <FileText className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-base font-medium text-slate-400 mb-2">
                      No matching records
                    </p>
                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                      Adjust your filters or start using the API to see logs
                      here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-8">
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Page <span className="text-blue-400">{page}</span> of{" "}
                <span className="text-white">{pagination.totalPages}</span>
              </p>
              <div className="hidden md:flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    // Simple sliding window for page numbers
                    let pageNum = page;
                    if (page <= 3) pageNum = i + 1;
                    else if (page >= pagination.totalPages - 2)
                      pageNum = pagination.totalPages - 4 + i;
                    else pageNum = page - 2 + i;

                    if (pageNum <= 0 || pageNum > pagination.totalPages)
                      return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setPage(pageNum);
                          const table = document.querySelector("h1");
                          table?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          page === pageNum
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-1 ring-blue-400/50"
                            : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  const table = document.querySelector("h1");
                  table?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all rounded-xl group"
              >
                <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] uppercase font-bold">Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => {
                  setPage((p) => p + 1);
                  const table = document.querySelector("h1");
                  table?.scrollIntoView({ behavior: "smooth" });
                }}
                className="h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all rounded-xl group"
              >
                <span className="text-[10px] uppercase font-bold">Next</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Webhook Inspector Slide-over */}
      <AnimatePresence>
        {selectedJobId && (
          <WebhookInspector
            jobId={selectedJobId}
            onClose={() => setSelectedJobId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WebhookInspector({
  jobId,
  onClose,
}: {
  jobId: string;
  onClose: () => void;
}) {
  const { data: logs, isLoading } = useWebhookLogs(jobId);
  // Optional: Convert Axios response to data if needed.
  // Custom hooks usually return { data: response.data } but let's be safe.
  const webhookLogs = (logs as any)?.data || logs || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="h-full w-full max-w-xl bg-[#09090b] border-l border-white/10 shadow-2xl p-4 sm:p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              Webhook Inspector
            </h2>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
              {jobId}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
            size="sm"
            className="rounded-full bg-white/5 border-white/10"
          >
            Close
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-sm text-slate-500 animate-pulse uppercase tracking-widest text-[10px] font-bold">
              Fetching logs...
            </span>
          </div>
        ) : !webhookLogs || webhookLogs.length === 0 ? (
          <div className="py-20 text-center">
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
              <Activity className="h-8 w-8 text-slate-700" />
            </div>
            <p className="text-slate-400 text-sm">
              No webhook attempts recorded.
            </p>
            <p className="text-[10px] text-slate-600 mt-2 uppercase">
              Check if the conversion has a valid webhookUrl
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {webhookLogs.map((log: any) => (
              <div
                key={log.id}
                className="bg-[#121214] border border-white/10 rounded-2xl p-6 space-y-4 group hover:border-blue-500/30 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        log.statusCode >= 200 && log.statusCode < 300
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {log.statusCode || "TIMEOUT"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                      {log.url}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    {log.duration}ms •{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(new Date(log.createdAt))}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">
                    Response Payload
                  </label>
                  <pre className="p-4 bg-black/60 rounded-xl text-[11px] text-slate-400 font-mono overflow-x-auto border border-white/5 shadow-inner">
                    {(() => {
                      if (!log.responseBody)
                        return "Empty response from server.";
                      try {
                        // Check if it's already an object or a JSON string
                        const obj =
                          typeof log.responseBody === "string"
                            ? JSON.parse(log.responseBody)
                            : log.responseBody;
                        return JSON.stringify(obj, null, 2);
                      } catch (e) {
                        return log.responseBody;
                      }
                    })()}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
