"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Code, FileCheck, RefreshCw } from "lucide-react";

const steps = [
  { label: "Messy document", icon: <FileText className="w-5 h-5" />, color: "text-slate-400" },
  { label: "Structured JSON", icon: <Code className="w-5 h-5" />, color: "text-blue-400" },
  { label: "Clean normalized output", icon: <FileCheck className="w-5 h-5" />, color: "text-emerald-400" },
  { label: "Synced system", icon: <RefreshCw className="w-5 h-5" />, color: "text-indigo-400" },
];

export function VisualStrip() {
  return (
    <div className="w-full bg-slate-900/30 border-y border-white/5 py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-4 group">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${step.color}`}>
                  {step.icon}
                </div>
                <span className="text-sm font-bold text-slate-300 tracking-wide uppercase">
                  {step.label}
                </span>
              </motion.div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-4 h-4 text-slate-700 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
