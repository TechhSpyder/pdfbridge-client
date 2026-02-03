"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/modules/app/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 text-center max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8 shadow-2xl">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            System <span className="text-red-500">Malfunction</span>
          </h1>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Something unexpected happened. We've been notified and are looking
            into it. In the meantime, you can try refreshing the page or head
            back to the dashboard.
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-10 text-left font-mono text-xs text-slate-500 overflow-auto max-h-32">
            <p className="text-red-400 font-bold mb-1">Error Details:</p>
            {error.message || "An unknown error occurred"}
            {error.digest && (
              <p className="mt-2 text-[10px] opacity-50">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 h-12 bg-white text-black hover:bg-slate-200 font-bold flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 h-12 border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Home Page
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
    </div>
  );
}
