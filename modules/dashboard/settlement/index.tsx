"use client";

import {
  useSettlements,
  useOverrideReconciliation,
  useLedger,
  useMe,
  useApprovals,
  useAuthorizeApproval,
  useRejectApproval,
} from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/app/button";
import {
  ShieldCheck,
  AlertTriangle,
  Coins,
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Zap,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import Title from "@/modules/app/title";
import { useSession } from "@/lib/auth-client";
import { AuditBadge } from "../components/audit-badge";
import type {
  LedgerDocument,
  LineItem,
  SettlementStatus,
  LedgerResponse,
} from "./types";

const CORPORATE_CATEGORIES = [
  "PAYROLL",
  "MARKETING",
  "INFRASTRUCTURE",
  "LEGAL",
  "SOFTWARE",
  "OPERATIONS",
  "TAXES",
  "OTHER",
];

export function SettlementHubPage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"settle" | "resolve" | "approvals">("settle");
  const [memoInputs, setMemoInputs] = useState<Record<string, string>>({});
  const [rejectInputs, setRejectInputs] = useState<Record<string, string>>({});
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { data: userData } = useMe();
  const router = useRouter();
  const userRole = (userData as any)?.role as string | undefined;
  const canApprove = userRole === "OWNER" || userRole === "APPROVER";
  const { data: approvalsData } = useApprovals();
  const pendingApprovals: any[] = (approvalsData as any)?.data ?? [];
  const { mutate: authorizeApproval, isPending: isAuthorizing } = useAuthorizeApproval();
  const { mutate: rejectApproval, isPending: isRejecting } = useRejectApproval();


  // Fetch only reconciled docs for 'settle' view, or all for 'resolve' view to find escalations
  // Enable 2-second polling to watch the M2M execution live
  const { data: ledgerData, isLoading: ledgerLoading } = useLedger(page, 10, 2000);
  const { data: settlementData, isLoading: settlementLoading } = useSettlements(
    page,
    10,
    2000
  );

  // 1. Treasury Guardian Effect: Re-calculate liquidity whenever selection or wallet moves

  // Cast hook data to typed responses
  const ledger = ledgerData as LedgerResponse | undefined;
  const settlements = settlementData as LedgerResponse | undefined;

  const escalatedDocs = (ledger?.documents || []).filter(
    (d: LedgerDocument) => d.requiresHumanReview,
  );
  const reconciledDocs = settlements?.documents || [];

  const isLoading = view === "settle" ? settlementLoading : ledgerLoading;
  const currentDocs = view === "settle" ? reconciledDocs : escalatedDocs;

  const currencyTotals = reconciledDocs.reduce(
    (acc: Record<string, number>, doc: LedgerDocument) => {
      const cur = (doc.resolutions?.currency ||
        doc.currency ||
        "USDC") as string;
      acc[cur] = (acc[cur] || 0) + Number(doc.totalAmount || 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleCategoryChange = async (
    intentId: string | null,
    category: string,
  ) => {
    if (!intentId) return;
    try {
      const resp = await fetch(`/api/v1/compiler/intent/${intentId}/category`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (resp.ok) {
        // Optimistic UI or refetch
        router.refresh();
      }
    } catch (e) {
      console.error("[CATEGORY] Update failed:", e);
    }
  };

  const formatCurrency = (amount: number, currency: string = "USDC") => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(amount) +
      " " +
      currency
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Title
          title="Settlement Hub"
          description="Institutional payout gateway with deterministic audit enforcement."
          icon={<ShieldCheck className="h-8 w-8 text-indigo-500" />}
        />
        <div className="flex items-center gap-4 max-md:flex-col flex-row-reverse">
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            <button
              onClick={() => setView("settle")}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2",
                view === "settle"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              <Coins className="h-3 w-3" />
              Payout Queue
            </button>
            <button
              onClick={() => setView("resolve")}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2",
                view === "resolve"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              <AlertTriangle className="h-3 w-3" />
              Resolution Center
              {escalatedDocs.length > 0 && (
                <span className="h-4 w-4 rounded-full bg-black/20 text-[8px] flex items-center justify-center border border-white/10">
                  {escalatedDocs.length}
                </span>
              )}
            </button>
            {/* Approvals tab: OWNER + APPROVER only */}
            {canApprove && (
              <button
                onClick={() => setView("approvals")}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2",
                  view === "approvals"
                    ? "bg-violet-500 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                <ShieldCheck className="h-3 w-3" />
                Approvals
                {pendingApprovals.length > 0 && (
                  <span className="h-4 w-4 rounded-full bg-violet-500 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {(userData as any)?.role === "ADMIN" ||
          (userData as any)?.role === "OWNER" ? (
            <Button
              variant="secondary"
              onClick={() => {
                const baseUrl =
                  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
                const cleanBaseUrl = baseUrl.endsWith("/")
                  ? baseUrl.slice(0, -1)
                  : baseUrl;
                window.open(
                  `${cleanBaseUrl}/api/v1/export/audit-pack`,
                  "_blank",
                );
              }}
              className="md:flex ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 font-bold uppercase tracking-widest text-[10px]"
            >
              <History className="w-4 h-4 mr-2" />
              Download Audit Pack (CSV)
            </Button>
          ) : null}
        </div>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
          <div className="flex items-center gap-3 text-indigo-400 mb-2">
            <Coins className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Liquid for Payout
            </span>
          </div>
          <div className="space-y-1">
            {Object.keys(currencyTotals).length > 0 ? (
              Object.entries(currencyTotals).map(([cur, total]) => (
                <div
                  key={cur}
                  className="text-2xl font-black text-white flex items-baseline gap-2"
                >
                  {formatCurrency(total, cur)}
                </div>
              ))
            ) : (
              <div className="text-3xl font-black text-white opacity-20">
                0.00 USDC
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> 100% Deterministic Integrity
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Escalated Records
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {escalatedDocs.length}
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            Requires Manual Audit Overwrite
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Fingerprint className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Compiler Ruleset
            </span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            Deterministic Engine
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-tighter">
              Active Protocol
            </span>
          </div>
        </div>
      </div>

      {/* Main Queue */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-slate-500">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Audit Sieve
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Counterparty
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Category (COA)
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Settlement Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Protocol Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-right">
                  Gateway
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mx-auto mb-2" />
                  </td>
                </tr>
              ) : currentDocs.length > 0 ? (
                currentDocs.map((doc: LedgerDocument) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <AuditBadge
                        isReconciled={doc.isReconciled}
                        requiresHumanReview={doc.requiresHumanReview}
                        id={doc.id}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {doc.vendorName || "Unknown"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {doc.invoiceNumber || "No Reference"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="bg-black/40 border border-white/10 rounded-lg text-[10px] text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none px-2 py-1 uppercase font-bold tracking-widest cursor-pointer hover:bg-black/60 transition-colors"
                        value={doc.category || "OTHER"}
                        disabled={
                          doc.status === "SETTLED" || doc.status === "SETTLING"
                        }
                        onChange={(e) =>
                          handleCategoryChange(doc.intentId, e.target.value)
                        }
                      >
                        {CORPORATE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-mono font-bold">
                        {formatCurrency(
                          Number(doc.totalAmount),
                          doc.resolutions?.currency || doc.currency,
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ProtocolBadge
                        status={
                          doc.status || doc.settlementStatus || "UNSETTLED"
                        }
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {view === "settle" ? (
                        doc.status === "SETTLED" && doc.signatures?.[0] ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl border-emerald-500/20 text-[10px] uppercase font-black"
                            onClick={() =>
                              window.open(
                                `https://solscan.io/tx/${doc.signatures![0]}?cluster=devnet`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View on Solscan
                          </Button>
                        ) : doc.status === "SETTLING" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled
                            className="h-9 px-4 bg-indigo-500/10 text-indigo-400 rounded-xl border-indigo-500/20 text-[10px] uppercase font-black cursor-wait"
                          >
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Confirming Block...
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl border-none text-[10px] uppercase font-black shadow-lg shadow-indigo-500/20"
                            onClick={() =>
                              router.push(`/compiler?id=${doc.id}`)
                            }
                          >
                            <Zap className="h-3 w-3 mr-2" />
                            Execute Payout
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-9 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-xl border-amber-500/20 text-[10px] uppercase font-black"
                          onClick={() => setSelectedDocId(doc.id)}
                        >
                          <Search className="h-3 w-3 mr-2" />
                          Audit Review
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-slate-500"
                  >
                    <History className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">
                      {view === "settle" && escalatedDocs.length > 0
                        ? "Payout Queue Blocked"
                        : "Clear Queue"}
                    </p>
                    <p className="text-xs mt-1 max-w-xs mx-auto">
                      {view === "settle" && escalatedDocs.length > 0
                        ? `${escalatedDocs.length} items have failed the mathematical sieve and require manual review in the Resolution Center before payout.`
                        : "New institutional extractions will appear after deterministic audit."}
                    </p>
                    {view === "settle" && escalatedDocs.length > 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="mt-6 bg-white/5 hover:bg-white/10 text-white rounded-xl"
                        onClick={() => setView("resolve")}
                      >
                        Go to Resolution Center
                        <ArrowRightLeft className="h-3 w-3 ml-2" />
                      </Button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Approvals Queue ─────────────────────────────────────────── */}
      {view === "approvals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] text-violet-400 font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Spend Authorization Queue
            </h3>
            <span className="text-[9px] text-slate-600 font-mono">
              {pendingApprovals.length} pending · 4-eyes protocol active
            </span>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-12 text-center">
              <ShieldCheck className="h-8 w-8 text-violet-400/30 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-bold">No pending authorizations</p>
              <p className="text-[10px] text-slate-600 mt-1">All payments are within auto-approve thresholds.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((w: any) => {
                const doc = w.executionIntent?.document;
                const approvals: any[] = w.approvals ?? [];
                const context = w.executionIntent?.context ?? {};
                const spendTier: string = context.spendTier ?? "SIGNIFICANT";
                const isMaterial = spendTier === "MATERIAL";
                const amount = Number(doc?.totalAmount ?? 0);
                const isRejectMode = rejectTarget === w.id;

                return (
                  <div key={w.id} className="rounded-2xl border border-violet-500/20 bg-slate-900/60 overflow-hidden">
                    {/* Tier indicator bar */}
                    <div className={`h-1 w-full ${isMaterial ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-amber-500 to-yellow-400"}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-white font-bold text-sm">{doc?.vendorName ?? "Unknown Vendor"}</p>
                          <p className="text-slate-500 text-[10px] font-mono mt-0.5">#{doc?.invoiceNumber ?? "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-black text-lg font-mono">${amount.toFixed(2)}</p>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${isMaterial ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"}`}>
                            {spendTier}
                          </span>
                        </div>
                      </div>

                      {/* Approval progress */}
                      <div className="mb-4 text-[10px] text-slate-500 font-mono">
                        {approvals.length} / {context.requiredApprovals ?? "?"} countersigns received
                        {approvals.map((a: any, i: number) => (
                          <span key={i} className="ml-2 text-emerald-400">✓ {a.role}</span>
                        ))}
                      </div>

                      {/* Material tier: memo required */}
                      {isMaterial && !isRejectMode && (
                        <div className="mb-3">
                          <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">
                            Authorization Memo (required for Material tier)
                          </label>
                          <input
                            type="text"
                            value={memoInputs[w.id] ?? ""}
                            onChange={(e) => setMemoInputs(prev => ({ ...prev, [w.id]: e.target.value }))}
                            placeholder="e.g. Q2 vendor payment approved at board meeting 2026-04-19"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-violet-500/50"
                          />
                        </div>
                      )}

                      {/* Reject reason input */}
                      {isRejectMode && (
                        <div className="mb-3">
                          <label className="text-[9px] text-rose-400 uppercase font-bold block mb-1">Rejection Reason (required)</label>
                          <input
                            type="text"
                            value={rejectInputs[w.id] ?? ""}
                            onChange={(e) => setRejectInputs(prev => ({ ...prev, [w.id]: e.target.value }))}
                            placeholder="e.g. Duplicate invoice detected, pending CFO review"
                            className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl px-3 py-2 text-[11px] text-slate-300 placeholder:text-slate-600 outline-none focus:border-rose-500/50"
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        {!isRejectMode ? (
                          <>
                            <button
                              onClick={() => authorizeApproval({
                                workflowId: w.id,
                                memo: memoInputs[w.id] || undefined,
                              })}
                              disabled={isAuthorizing || (isMaterial && !memoInputs[w.id]?.trim())}
                              className="flex-1 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-[10px] transition-all disabled:opacity-40"
                            >
                              {isAuthorizing ? "Authorizing..." : "Authorize"}
                            </button>
                            <button
                              onClick={() => setRejectTarget(w.id)}
                              className="h-10 px-5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-black uppercase text-[10px] border border-rose-500/20 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                if (!rejectInputs[w.id]?.trim()) return;
                                rejectApproval({ workflowId: w.id, reason: rejectInputs[w.id] }, {
                                  onSuccess: () => setRejectTarget(null),
                                });
                              }}
                              disabled={isRejecting || !rejectInputs[w.id]?.trim()}
                              className="flex-1 h-10 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black uppercase text-[10px] transition-all disabled:opacity-40"
                            >
                              {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                            <button
                              onClick={() => setRejectTarget(null)}
                              className="h-10 px-5 rounded-xl bg-white/5 text-slate-400 font-bold text-[10px] transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedDocId && (
          <ResolutionCenter
            document={
              escalatedDocs.find((d: any) => d.id === selectedDocId) ||
              reconciledDocs.find((d: any) => d.id === selectedDocId)
            }
            onClose={() => setSelectedDocId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProtocolBadge({ status }: { status: SettlementStatus }) {
  const styles: Record<SettlementStatus, string> = {
    UNSETTLED: "bg-white/5 text-slate-400 border-white/10",
    REJECTED_AUDIT: "bg-red-500/10 text-red-400 border-red-500/20",
    SETTLING:
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse",
    SETTLED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    PENDING_APPROVAL: "bg-violet-500/10 text-violet-400 border-violet-500/20 animate-pulse",
  };


  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded flex items-center gap-1.5 text-[9px] font-black border uppercase tracking-widest w-fit",
        styles[status] || styles.UNSETTLED,
      )}
    >
      <div
        className={cn(
          "h-1 w-1 rounded-full",
          status === "SETTLED"
            ? "bg-emerald-500"
            : status === "REJECTED_AUDIT"
              ? "bg-red-500"
              : "bg-slate-500",
        )}
      />
      {status}
    </span>
  );
}

function ResolutionCenter({
  document,
  onClose,
}: {
  document?: any;
  onClose: () => void;
}) {
  const overrideMutation = useOverrideReconciliation();

  const handleOverride = async () => {
    if (!document) return;
    await overrideMutation.mutateAsync(document.id);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="h-full w-full max-w-xl bg-[#0d0e12] border-l border-white/15 p-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Resolution Center
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Manual Audit Overwrite Interface
              </p>
            </div>
          </div>
        </div>

        {!document ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-slate-500">
              Document context lost. Please refresh.
            </span>
          </div>
        ) : (
          <div className="flex-1 space-y-10 overflow-y-auto pr-4 custom-scrollbar">
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                Audit Failures Detected
              </h3>
              <div className="space-y-3">
                {(
                  (document.metadata as any)?.reconciliationErrors || [
                    "Unknown audit discrepancy detected by protocol",
                  ]
                ).map((err: string, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-3"
                  >
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-200/70 font-medium leading-relaxed">
                      {err}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Deterministic Comparison
                </h3>
                <Zap className="h-3 w-3 text-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 h-4 block">
                    AI Extracted Total
                  </span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {document.totalAmount} {document.currency}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-white/2 border border-white/5">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 h-4 block">
                    Footer Tax Amount
                  </span>
                  <span className="text-xl font-bold text-white mt-1 block">
                    {document.taxAmount || 0}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 block">
                  Line Item Breakdown
                </span>
                <div className="space-y-3">
                  {document.lineItems?.map((item: LineItem, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0"
                    >
                      <span className="text-slate-400 max-w-[200px] truncate">
                        {item.description}
                      </span>
                      <span className="text-white font-mono tracking-tighter">
                        {item.quantity} x {item.unitPrice} ={" "}
                        <span className="text-indigo-400 font-bold">
                          {item.totalPrice}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="pt-10 border-t border-white/5 space-y-6 pb-10">
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/60 leading-relaxed italic">
                  By overriding this audit, you acknowledge that the extracted
                  data is correct despite protocol discrepancies. This action
                  will be recorded in the immutable audit log.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 h-14 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/10"
                  onClick={handleOverride}
                  disabled={overrideMutation.isPending}
                >
                  {overrideMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Authorize Settlement"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="h-14 px-8 rounded-2xl border-white/10 text-slate-400"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
