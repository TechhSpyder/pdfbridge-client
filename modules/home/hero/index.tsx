"use client";

import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "../../app/button";
import { useScrollAnimation } from "../../hooks/use-scroll-animation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const TransformationAnimation = dynamic(
  () => import("./index/TransformationAnimation"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-w-[500px] mx-auto opacity-0" />
    ),
  },
);
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const router = useRouter();

  return (
    <section
      ref={contentRef}
      className="relative min-h-[90svh] lg:min-h-[90vh] flex items-center overflow-hidden py-20 sm:py-32 w-full"
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#020617]" />
        <Image
          src="/webp/hero_bg_1_1x.webp"
          alt="hero background"
          fill
          priority
          className="object-cover opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#020617]/50 to-[#020617]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={contentVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={contentVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase"
              >
                <Sparkles className="w-3 h-3" />
                <Link
                  href="https://www.producthunt.com/products/pdfbridge?launch=pdfbridge"
                  target="_blank"
                >
                  Launching on Product Hunt March 3 → Follow for updates
                </Link>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Generate <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 via-indigo-300 to-cyan-400">
                  Pixel-Perfect
                </span>
                <br /> PDFs.
              </h1>
            </div>

            <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
              The high-performance API for developers who need reliable
              HTML-to-PDF conversion, AI-powered document parsing, and
              enterprise security—without the infrastructure headache.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                size="lg"
                onClick={() => router.push("/sign-up")}
                className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-5 h-14 flex items-center justify-center rounded-2xl shadow-xl shadow-blue-500/20 group"
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 ease-out" />
              </Button>
              <Link href="/docs" className="block">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  className="h-14 px-8 rounded-2xl border-slate-800 hover:bg-slate-900 cursor-pointer w-full sm:w-auto"
                >
                  Read Docs
                </Button>
              </Link>
            </div>

            {/* <div className="flex flex-wrap gap-6 text-sm text-slate-500 pt-8 border-t border-slate-800/50">
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() =>
                      toast.info("Feature highlight scrolling coming in V1.1")
                    }
                    className="hover:text-foreground cursor-pointer text-left transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <Link href="/#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    API
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() =>
                      toast.info("Security compliance portal coming soon")
                    }
                    className="hover:text-foreground cursor-pointer text-left transition-colors"
                  >
                    Security
                  </button>
                </li>
              </ul>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={contentVisible ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="relative lg:block"
          >
            <TransformationAnimation />

            {/* Contextual floaters */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl hidden xl:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                    Status
                  </div>
                  <div className="text-xs text-white font-semibold">
                    Job #8234 Processed
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Floater */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -bottom-10 -left-10 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl hidden xl:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-[10px] text-blue-400/80 uppercase font-bold tracking-widest">
                    AI Extracted
                  </div>
                  <div className="text-xs text-white font-mono mt-1 bg-black/50 p-1.5 rounded-md border border-white/5">
                    {`{ "total": "$450.00" }`}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CheckCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
