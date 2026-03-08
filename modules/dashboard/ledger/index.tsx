"use client";

import { useLedger, useNormalizeInvoice } from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { Button } from "@/modules/app/button";
import {
  Banknote,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload,
  Loader2,
  Search,
  ExternalLink,
  ArrowRight,
  Receipt,
  FileJson,
  Database,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Title from "@/modules/app/title";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export function LedgerPage() {
  const [page, setPage] = useState(1);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const { data, isLoading, error } = useLedger(page, 10, 5000);
  const normalizeMutation = useNormalizeInvoice();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        normalizeMutation.mutate({ file: acceptedFiles[0], testMode: true });
      }
    },
    [normalizeMutation],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const documents = data?.documents || [];
  const pagination = data?.pagination;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-md max-w-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Ledger Unavailable
          </h2>
          <p className="text-slate-400 mb-6">{error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Title
          title="Financial Ledger"
          description="Real-time monitor for AI extractions and accounting dispatches."
          icon={<Banknote className="h-8 w-8 text-emerald-500" />}
        />

        <div className="flex gap-2">
          <div
            {...getRootProps()}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed transition-all cursor-pointer text-xs font-bold uppercase tracking-widest leading-none h-11",
              isDragActive
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10",
            )}
          >
            <input {...getInputProps()} />
            {normalizeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {normalizeMutation.isPending
              ? "Processing..."
              : "Quick Test Upload"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-black/20 text-slate-500">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Document / Vendor
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Internal Sync
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
                  Captured At
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mx-auto mb-2" />
                    <span className="text-sm text-slate-500 animate-pulse">
                      Syncing ledger...
                    </span>
                  </td>
                </tr>
              ) : documents.length > 0 ? (
                documents.map((doc: any) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {doc.vendorName || "Detecting Vendor..."}
                          </span>
                          {doc.isTestMode && (
                            <span className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-white/10 text-slate-500 border border-white/5 uppercase tracking-tighter">
                              Sandbox
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {doc.invoiceNumber || doc.id.split("-")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-medium">
                        {doc.totalAmount
                          ? formatCurrency(doc.totalAmount, doc.currency)
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={doc.status}
                        isTestMode={doc.isTestMode}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <IntegrationIcon
                          provider="quickbooks"
                          active={!!doc.quickbooksId}
                        />
                        <IntegrationIcon
                          provider="xero"
                          active={!!doc.xeroId}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-400">
                        {formatDate(doc.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-3 border-white/5 bg-white/5 hover:bg-white/10 text-[10px] uppercase font-bold"
                        onClick={() => setSelectedDocId(doc.id)}
                      >
                        <Search className="h-3 w-3 mr-2" />
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-24 text-center text-slate-500"
                  >
                    <Receipt className="h-10 w-10 mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-xs mt-1">
                      Extractions from the API will appear here instantly.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (Simplified) */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase font-bold text-slate-500">
            Page {page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Document Inspector Slide-over */}
      <AnimatePresence>
        {selectedDocId && (
          <DocumentInspector
            docId={selectedDocId}
            onClose={() => setSelectedDocId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({
  status,
  isTestMode,
}: {
  status: string;
  isTestMode?: boolean;
}) {
  const styles: any = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse",
    CAPTURED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    DISPATCHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DISPATCH_FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  let label = status === "PENDING" ? "Processing" : status;
  if (isTestMode && status === "CAPTURED") {
    label = "Sandbox: Ready";
  }

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider",
        styles[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20",
      )}
    >
      {label}
    </span>
  );
}

function IntegrationIcon({
  provider,
  active,
}: {
  provider: string;
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "h-6 w-6 rounded-md flex items-center justify-center border transition-all grayscale opacity-40",
        active &&
          "grayscale-0 opacity-100 border-white/20 bg-white/5 shadow-lg shadow-white/5",
      )}
      title={provider}
    >
      <img
        src={
          provider === "quickbooks"
            ? "https://upload.wikimedia.org/wikipedia/commons/6/6c/Intuit_QuickBooks_logo.svg"
            : "https://developer.xero.com/_next/static/media/developer-logo-light.80bcbef8.svg"
        }
        alt={provider}
        className="h-4 w-4 object-contain"
      />
    </div>
  );
}

import { useLedgerDocument } from "@/modules/hooks/queries";

function DocumentInspector({
  docId,
  onClose,
}: {
  docId: string;
  onClose: () => void;
}) {
  const { data: doc, isLoading } = useLedgerDocument(docId);
  const [tab, setTab] = useState<"metadata" | "line-items" | "sync">(
    "metadata",
  );

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
        className="h-full w-full max-w-2xl bg-[#0b0c10] border-l border-white/10 shadow-3xl p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                Document Inspector
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  {docId}
                </span>
                <StatusBadge status={doc?.status} />
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="rounded-xl"
          >
            Close
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">
              Hydrating data...
            </span>
          </div>
        ) : (
          doc && (
            <div className="space-y-8">
              {/* Tabs */}
              <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
                {(["metadata", "line-items", "sync"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all",
                      tab === t
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-slate-500 hover:text-slate-300",
                    )}
                  >
                    {t.replace("-", " ")}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {tab === "metadata" && (
                    <div className="grid grid-cols-2 gap-4">
                      <MetaField
                        label="Vendor"
                        value={doc.vendorName}
                        icon={<Database />}
                      />
                      <MetaField
                        label="Invoice #"
                        value={doc.invoiceNumber}
                        icon={<FileText />}
                      />
                      <MetaField
                        label="Total Amount"
                        value={doc.totalAmount?.toString()}
                        icon={<Banknote />}
                      />
                      <MetaField
                        label="Currency"
                        value={doc.currency}
                        icon={<Database />}
                      />
                      <MetaField
                        label="Due Date"
                        value={doc.dueDate}
                        icon={<Clock />}
                      />
                      <MetaField
                        label="Confidence"
                        value={
                          doc.confidenceScore
                            ? `${doc.confidenceScore}%`
                            : "100%"
                        }
                        icon={<CheckCircle2 />}
                      />
                    </div>
                  )}

                  {tab === "line-items" && (
                    <div className="rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5">
                          <tr>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">
                              Description
                            </th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">
                              Qty
                            </th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {doc.lineItems?.map((item: any, i: number) => (
                            <tr key={i} className="text-xs text-slate-300">
                              <td className="px-4 py-3">{item.description}</td>
                              <td className="px-4 py-3 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {item.unitPrice}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {tab === "sync" && (
                    <div className="space-y-4">
                      <SyncLog
                        provider="QuickBooks"
                        externalId={doc.quickbooksId}
                        status={
                          doc.quickbooksId
                            ? "SUCCESS"
                            : doc.status === "DISPATCH_FAILED"
                              ? "FAILED"
                              : "PENDING"
                        }
                        isTestMode={doc.isTestMode}
                      />
                      <SyncLog
                        provider="Xero"
                        externalId={doc.xeroId}
                        status={doc.xeroId ? "SUCCESS" : "PENDING"}
                        isTestMode={doc.isTestMode}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="pt-8 border-t border-white/5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">
                  Raw AI JSON Payload
                </label>
                <div className="p-4 bg-black rounded-2xl border border-white/10 font-mono text-[11px] text-slate-400 overflow-x-auto shadow-inner">
                  <pre>{JSON.stringify(doc.metadata || {}, null, 2)}</pre>
                </div>
              </div>
            </div>
          )
        )}
      </motion.div>
    </motion.div>
  );
}

function MetaField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: any;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {icon && <div className="h-3 w-3">{icon}</div>}
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-sm font-medium text-white truncate">
        {value || "—"}
      </div>
    </div>
  );
}

function SyncLog({
  provider,
  externalId,
  status,
  isTestMode,
}: {
  provider: string;
  externalId?: string;
  status: string;
  isTestMode?: boolean;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <IntegrationIcon
          provider={provider.toLowerCase()}
          active={status === "SUCCESS"}
        />
        <div>
          <h4 className="text-sm font-bold text-white">{provider} Dispatch</h4>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5">
            {externalId
              ? `ID: ${externalId}`
              : status === "FAILED"
                ? "Dispatch failed during worker execution"
                : isTestMode
                  ? "Sandbox: Dispatch Disabled"
                  : "Awaiting transmission..."}
          </p>
        </div>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
