"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/modules/app/button";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Download,
  ArrowRight,
  ShieldCheck,
  FileText,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PUBLIC_DEMO_KEY =
  process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "pk_demo_57b12a2ff6c54bac7b45c0f0fcce47b2c1a80c8a4613a2b6";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function PublicPlayground() {
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "queued" | "processing" | "done" | "failed"
  >("idle");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [aiMetadata, setAiMetadata] = useState<any>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll for job status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && (status === "queued" || status === "processing")) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/api/v1/jobs/${jobId}`, {
            headers: { "X-API-Key": PUBLIC_DEMO_KEY },
          });
          const data = await res.json();
          const normalizedStatus =
            data.status?.toLowerCase() || data.state?.toLowerCase();

          if (
            normalizedStatus === "done" ||
            normalizedStatus === "success" ||
            normalizedStatus === "completed"
          ) {
            const output = data.output || data.result;
            setStatus("done");
            setPdfUrl(output.url || output.pdfUrl);
            setAiMetadata(output.aiMetadata);
            clearInterval(interval);
          } else if (
            normalizedStatus === "failed" ||
            normalizedStatus === "error"
          ) {
            setStatus("failed");
            clearInterval(interval);
          } else if (normalizedStatus === "processing") {
            setStatus("processing");
          } else if (
            normalizedStatus === "queued" ||
            normalizedStatus === "pending"
          ) {
            setStatus("queued");
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await handleGenerate(file);
    }
  };

  const handleGenerate = async (file: File) => {
    if (usageCount >= 2) {
      setShowLimitModal(true);
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF invoice.");
      return;
    }

    setLoading(true);
    setStatus("queued");
    setPdfUrl(null);
    setAiMetadata(null);

    const tId = toast.loading("Uploading & Analyzing document...", {
      description: "Our AI is mapping financial fields for orchestration.",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/v1/normalize-invoice`, {
        method: "POST",
        headers: {
          "X-API-Key": PUBLIC_DEMO_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || errData.error || "Sandbox busy. Please try again.",
        );
      }

      const data = await res.json();
      setJobId(data.jobId);
      setUsageCount((prev) => prev + 1);
      toast.success("Job started!", { id: tId });
    } catch (e: any) {
      toast.error(e.message || "Failed to start", { id: tId });
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-16 px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full -z-10" />

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-blue-500/10">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="ml-4 text-[10px] uppercase font-black tracking-widest text-slate-500">
              Interactive Demo · Invoice Orchestration
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-tighter">
              Watermarked Sandbox
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Section */}
          {status === "idle" && (
            <div className="space-y-6 text-center py-12">
              <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-2xl mb-2">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Upload a problematic invoice
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  Experience the AI-to-PDF loop. We extract structured JSON and
                  regenerate a clean, professional copy.
                </p>
              </div>

              <div className="flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  className="rounded-2xl px-12 py-7 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 group font-bold text-lg"
                >
                  Select Invoice PDF
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
                No data persists · Zero retention sandbox
              </p>
            </div>
          )}

          {/* Status / Processing View */}
          <AnimatePresence mode="wait">
            {(status === "queued" || status === "processing") && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2x border border-white/5 bg-black/40 p-12 flex flex-col items-center justify-center min-h-[240px] text-center"
              >
                {status === "queued" && (
                  <>
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <h4 className="text-white font-bold text-lg">
                      Acquiring GPU Node
                    </h4>
                    <p className="text-slate-500 text-sm">
                      Streaming your document to our ingestion orchestrator...
                    </p>
                  </>
                )}
                {status === "processing" && (
                  <>
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative" />
                    </div>
                    <h4 className="text-white font-bold text-lg">
                      AI Mapping & Normalization
                    </h4>
                    <p className="text-slate-500 text-sm max-w-xs">
                      Extracting line items and applying high-fidelity layout
                      precision.
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* Success View */}
            {status === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* JSON View */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Code2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Extracted Metadata
                    </span>
                  </div>
                  <div className="bg-black/60 rounded-2xl border border-white/5 p-4 h-[300px] overflow-y-auto font-mono text-[10px] text-emerald-400">
                    <pre>{JSON.stringify(aiMetadata, null, 2)}</pre>
                  </div>
                </div>

                {/* PDF View Mock/Link */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Normalized Export
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-2xl border border-white/10 p-4 h-[300px] flex flex-col items-center justify-center text-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-bold">Document Rebuilt</h4>
                      <p className="text-slate-500 text-xs px-8">
                        AI-verified data rendered via clean, compliant CSS
                        templates.
                      </p>
                    </div>
                    <Button
                      onClick={() => window.open(pdfUrl!, "_blank")}
                      variant="outline"
                      className="bg-transparent border-white/10 hover:bg-white/5 rounded-xl h-auto py-3 px-6 font-bold"
                    >
                      Open Normalized PDF
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center justify-between p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        Deploy this workflow tonight.
                      </p>
                      <p className="text-blue-300/60 text-xs">
                        Our SDK handles the polling, extraction, and rendering
                        for you.
                      </p>
                    </div>
                  </div>
                  <Link href="/sign-up">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-8 h-auto py-3 font-bold">
                      Get API Access
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

            {status === "failed" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 flex flex-col items-center justify-center text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h4 className="text-white font-bold text-lg">
                  Orchestration Failed
                </h4>
                <p className="text-slate-400 text-sm max-w-sm">
                  This document might be password-protected or not a standard
                  invoice. Try another sample.
                </p>
                <Button
                  onClick={() => setStatus("idle")}
                  variant="outline"
                  className="mt-6 border-white/10 hover:bg-white/5"
                >
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fine Print */}
          <div className="pt-4 flex items-center justify-center gap-6 text-slate-500 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API
              V1.2.0 (Finance-Grade)
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> SOC-2
              Ready Infra
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limit Modal (Tease) */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLimitModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0f172a] border border-white/10 p-10 rounded-[40px] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">
                Scale your pipeline.
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                You've seen the power of "Closed-Loop" normalization. Start
                building production-grade workflows today.
              </p>
              <Link href="/sign-up">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-bold shadow-xl shadow-blue-500/20 text-lg">
                  Get Your API Key
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <button
                onClick={() => setShowLimitModal(false)}
                className="mt-6 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Back to sandbox
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
