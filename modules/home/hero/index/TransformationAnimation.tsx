"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FileText, Link, Globe, CheckCircle } from "lucide-react";
import NextImage from "next/image";

export default function TransformationAnimation() {
  const [stage, setStage] = useState(0); // 0: URL, 1: Loading, 2: Webpage, 3: PDF Ready
  const [displayText, setDisplayText] = useState("");
  const targetUrl = "https://pdfbridge.xyz/docs";

  useEffect(() => {
    const runAnimation = () => {
      setStage(0);
      setDisplayText("");

      let i = 0;
      const typingInterval = setInterval(() => {
        setDisplayText(targetUrl.slice(0, i));
        i++;
        if (i > targetUrl.length) {
          clearInterval(typingInterval);
          setTimeout(() => setStage(1), 800);
          setTimeout(() => setStage(2), 2200);
          setTimeout(() => setStage(3), 4500);
        }
      }, 50);
    };

    runAnimation();
    const mainInterval = setInterval(runAnimation, 15000);

    return () => {
      clearInterval(mainInterval);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center p-8">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full animate-pulse-slow" />
      <div className="absolute -inset-10 bg-indigo-500/5 blur-[80px] rounded-full delay-1000" />

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="url-stage"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            className="w-full relative z-10 glass rounded-2xl p-6 shadow-2xl border-blue-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Link className="w-5 h-5 text-blue-400" />
              </div>
              <div className="h-4 w-32 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.8 }}
                  className="h-full w-full bg-slate-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-14 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 flex items-center">
                <Globe className="w-4 h-4 text-slate-500 mr-3" />
                <span className="text-slate-300 font-mono text-sm tracking-tight">
                  {displayText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-[2px] h-4 bg-blue-400 ml-1 translate-y-[2px]"
                  />
                </span>
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-12 bg-blue-600 rounded-xl flex items-center justify-center font-semibold text-sm shadow-lg shadow-blue-500/20"
              >
                Capture Page
              </motion.div>
            </div>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="z-10 flex flex-col items-center gap-6"
          >
            <div className="relative w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-4 bg-blue-500/20 rounded-full flex items-center justify-center"
              >
                <Globe className="w-8 h-8 text-blue-400" />
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-200">
                Capturing DOM...
              </h3>
              <p className="text-sm text-slate-500">
                Executing JavaScript & Styles
              </p>
            </div>
          </motion.div>
        )}

        {stage === 2 && stage < 4 && (
          <motion.div
            key="webpage-stage"
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full relative z-10 glass rounded-2xl overflow-hidden shadow-2xl border-white/5"
          >
            <div className="h-6 bg-slate-800/80 flex items-center px-4 gap-1.5 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-amber-500/50" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
            <motion.div
              className="relative aspect-video overflow-hidden"
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
            >
              <NextImage
                src="/webp/mock_webpage.avif"
                alt="Webpage Preview"
                fill
                className="object-cover brightness-90 contrast-110"
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-blue-600 shadow-[0_0_100px_rgba(37,99,235,0.4)] mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ delay: 1, duration: 1.5 }}
            />
          </motion.div>
        )}

        {stage === 3 && (
          <motion.div
            key="pdf-stage"
            initial={{ opacity: 0, scale: 0.5, rotateY: 45 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative z-20 w-full group"
          >
            <div className="absolute inset-0 bg-blue-500/40 blur-[120px] scale-150 animate-pulse" />

            <motion.div className="relative glass rounded-[2.5rem] p-1 shadow-[0_0_50px_rgba(59,130,246,0.2)] bg-linear-to-br from-blue-600/20 to-indigo-600/20 animate-float">
              <div className="bg-slate-950/80 rounded-[2.3rem] p-8 flex flex-col items-center">
                <div className="w-24 h-32 bg-slate-900 border-2 border-slate-800 rounded-xl mb-6 relative overflow-hidden group-hover:border-blue-500/50 transition-colors">
                  <div className="absolute top-0 left-0 w-8 h-8 bg-blue-600/30 rounded-br-xl border-r border-b border-blue-500/50" />
                  <div className="p-4 space-y-2 mt-8">
                    <div className="h-2 w-full bg-slate-800 rounded" />
                    <div className="h-2 w-3/4 bg-slate-800 rounded" />
                    <div className="h-10 w-full bg-blue-500/10 rounded-lg mt-4 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Ready to Download{" "}
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </h3>
                <p className="text-slate-400 text-sm mb-8">
                  Generated in 428ms
                </p>

                <div className="flex gap-4 w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-14 bg-white text-slate-950 rounded-2xl font-bold text-sm"
                  >
                    Get PDF URL
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-14 w-14 glass rounded-2xl flex items-center justify-center text-white"
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  x: (i - 2.5) * 60,
                  y: -100 - (i % 3) * 40,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full blur-[2px]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Indicator */}
      <div className="absolute bottom-4 flex gap-2">
        {[0, 1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${stage === s ? "w-8 bg-blue-500" : "w-2 bg-slate-800"}`}
          />
        ))}
      </div>
    </div>
  );
}
