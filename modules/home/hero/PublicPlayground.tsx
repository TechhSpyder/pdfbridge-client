"use client";

import { useState, useEffect } from "react";
import { Button } from "@/modules/app/button";
import {
  Loader2,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Download,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PUBLIC_DEMO_KEY =
  process.env.NEXT_PUBLIC_PUBLIC_DEMO_KEY || "pk_demo_public_bridge_2026";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function PublicPlayground() {
  const [url, setUrl] = useState("https://producthunt.com");
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "queued" | "processing" | "done" | "failed"
  >("idle");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

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
          const normalizedStatus = data.status?.toLowerCase();

          if (normalizedStatus === "done" || normalizedStatus === "success") {
            setStatus("done");
            setPdfUrl(data.result.url);
            clearInterval(interval);
          } else if (
            normalizedStatus === "failed" ||
            normalizedStatus === "error"
          ) {
            setStatus("failed");
            clearInterval(interval);
          } else if (normalizedStatus === "processing") {
            setStatus("processing");
          } else if (normalizedStatus === "queued") {
            setStatus("queued");
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleGenerate = async () => {
    if (usageCount >= 2) {
      setShowLimitModal(true);
      return;
    }

    setLoading(true);
    setStatus("queued");
    setPdfUrl(null);

    const tId = toast.loading("Connecting to PDF Engine...", {
      description: "Preparing your pixel-perfect export.",
    });

    try {
      const res = await fetch(`${API_URL}/api/v1/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": PUBLIC_DEMO_KEY,
        },
        body: JSON.stringify({ url, testMode: true }),
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
      toast.success("Job accepted!", { id: tId });
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
              Public Sandbox
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-tighter">
              Watermarked Demo
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300">
                Enter a URL to convert
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={
                    loading || status === "queued" || status === "processing"
                  }
                  size="lg"
                  className="rounded-2xl h-auto py-4 px-8 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 group font-bold"
                >
                  {loading || status === "queued" || status === "processing" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Generate PDF
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Status / Preview Section */}
          <AnimatePresence mode="wait">
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-white/5 bg-black/40 p-6 flex flex-col items-center justify-center min-h-[160px] text-center"
              >
                {status === "queued" && (
                  <>
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                    <h4 className="text-white font-bold">In Queue</h4>
                    <p className="text-slate-500 text-sm">
                      Connecting to our high-performance rendering engine...
                    </p>
                  </>
                )}
                {status === "processing" && (
                  <>
                    <div className="relative mb-4">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                      <ShieldCheck className="w-4 h-4 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h4 className="text-white font-bold">
                      Generating High-Fidelity PDF
                    </h4>
                    <p className="text-slate-500 text-sm">
                      Applying professional styles and layout precision...
                    </p>
                  </>
                )}
                {status === "done" && pdfUrl && (
                  <div className="w-full space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                        <Download className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h4 className="text-white font-bold text-xl">
                        Success! PDF is ready.
                      </h4>
                      <p className="text-orange-400/80 text-xs font-medium mt-1">
                        * Sandbox Mode: This version contains our "Demo"
                        watermark.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => window.open(pdfUrl, "_blank")}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-bold text-sm cursor-pointer"
                      >
                        View Temporary Link <ExternalLink className="w-4 h-4" />
                      </button>
                      <Link href="/sign-up">
                        <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6 py-3 h-auto font-bold text-sm">
                          Sign Up to Remove Watermark
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
                {status === "failed" && (
                  <>
                    <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
                    <h4 className="text-white font-bold">Generation Failed</h4>
                    <p className="text-slate-500 text-sm">
                      The URL might be blocking headless browsers or is too
                      complex for the demo.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fine Print */}
          <div className="pt-4 flex items-center justify-center gap-6 text-slate-500 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API
              V1.0.1
            </div>
            {/* <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
              Gotenberg Engine
            </div> */}
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
                Pixel-Perfect, right?
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                You've seen the magic. Now it's time to build. Sign up now and
                get your first 1,000 PDFs free every month. No credit card
                required.
              </p>
              <Link href="/sign-up">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-bold shadow-xl shadow-blue-500/20 text-lg">
                  Create Your Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <button
                onClick={() => setShowLimitModal(false)}
                className="mt-6 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
