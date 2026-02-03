"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import { Button } from "@/modules/app/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 border border-white/5 mb-8 shadow-2xl">
            <Ghost className="h-10 w-10 text-blue-500" />
          </div>

          <h1 className="text-8xl font-black tracking-tighter text-white mb-4">
            4<span className="text-blue-500">0</span>4
          </h1>

          <h2 className="text-2xl font-bold text-white mb-4">
            Bridge to Nowhere
          </h2>

          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            The page you're looking for has vanished or never existed. Don't
            worry, even the best bridges sometimes lead to dead ends.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 h-12 rounded-xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
    </div>
  );
}
