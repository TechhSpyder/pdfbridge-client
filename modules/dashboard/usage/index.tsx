"use client";

import { useConversions } from "@/modules/hooks/queries";
import { GlowCard } from "@/modules/app/glow-card";
import { Button } from "@/modules/app/button";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react";
import { useState } from "react";

export function UsagePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useConversions(page);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <Clock className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-slate-500 text-sm animate-pulse">
          Loading conversion history...
        </p>
      </div>
    );
  }

  const conversions = data?.conversions || [];
  const pagination = data?.pagination;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            Usage & History
          </h1>
          <p className="mt-1 text-slate-400 text-sm">
            A complete log of your PDF generation history and API performance.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-xs h-9 border-white/5 text-slate-400"
          >
            <Filter className="h-3.5 w-3.5 mr-2" />
            Filter
          </Button>
          <Button
            variant="outline"
            className="text-xs h-9 border-white/5 text-slate-400"
          >
            <Download className="h-3.5 w-3.5 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-slate-500">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Resource / URL
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Latency
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {conversions.length > 0 ? (
                conversions.map((job: any) => (
                  <tr
                    key={job.id}
                    className="hover:bg-white/[0.02] transition-colors group"
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
                      {job.success ? (
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
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0 border-white/5 opacity-0 group-hover:opacity-100 transition shadow-lg"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-slate-500"
                  >
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                      <FileText className="h-8 w-8 text-slate-600" />
                    </div>
                    <p className="text-base font-medium text-slate-400 mb-2">
                      No conversion history
                    </p>
                    <p className="text-sm text-slate-600 max-w-xs mx-auto">
                      Your conversion attempts will appear here once you start
                      using the API.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing page <span className="text-white font-bold">{page}</span>{" "}
              of{" "}
              <span className="text-white font-bold">
                {pagination.totalPages}
              </span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="h-8 border-white/5 disabled:opacity-20 hover:bg-white/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.totalPages}
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="h-8 border-white/5 disabled:opacity-20 hover:bg-white/5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
