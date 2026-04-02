"use client";

import { useScrollAnimation } from "@/modules/hooks/use-scroll-animation";
import { Activity, RefreshCcw, ShieldCheck, Search } from "lucide-react";
import { motion } from "framer-motion";

const visibilityFeatures = [
  {
    title: "Job Lifecycle Tracking",
    description: "Follow every document from ingestion to final delivery with sub-second status updates.",
    icon: <Activity className="h-5 w-5 text-blue-400" />,
    stats: "Queued → Processing → Resolved"
  },
  {
    title: "Smart Retry Orchestration",
    description: "Automatic exponential backoff handles transient network flakes so your pipeline never stalls.",
    icon: <RefreshCcw className="h-5 w-5 text-emerald-400" />,
    stats: "5 Max Retries"
  },
  {
    title: "Audit-Ready Logs",
    description: "Every document processed is indexed with full metadata, job IDs, and timestamps for internal reconciliation.",
    icon: <Search className="h-5 w-5 text-purple-400" />,
    stats: "Configurable Retention"
  },
  {
    title: "Infrastructure Resilience",
    description: "Multi-region redundancy ensures your financial automation stays live, even if a whole cloud region goes dark.",
    icon: <ShieldCheck className="h-5 w-5 text-cyan-400" />,
    stats: "99.99% Uptime"
  }
];

export function OperationalVisibility() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-[#020617] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={isVisible ? "animate-in fade-in slide-in-from-left-8 duration-700" : "opacity-0"}>
            <h2 className="text-3xl font-semibold tracking-tight">
              Infrastructure visibility for production systems
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              PDFBridge is more than just a script; it&apos;s a resilient document
              infrastructure layer.
              Monitor your document pipeline with infrastructure-level transparency 
              and enterprise-grade reliability.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {visibilityFeatures.map((feature, index) => (
                <div key={feature.title} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-block px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative ${isVisible ? "animate-in fade-in zoom-in-95 duration-1000 delay-200" : "opacity-0"}`}>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Pipeline Monitor</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500">v1.2.0-stable</div>
              </div>

              <div className="space-y-6">
                {[
                  { id: "JOB-9023", status: "Completed", time: "1.2s", color: "text-emerald-400" },
                  { id: "JOB-9024", status: "Processing", time: "0.4s", color: "text-blue-400" },
                  { id: "JOB-9025", status: "Queued", time: "---", color: "text-slate-500" },
                ].map((job) => (
                  <div key={job.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-mono text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
                        #
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide">{job.id}</div>
                        <div className={`text-[10px] font-medium ${job.color}`}>{job.status}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">{job.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-black tracking-tighter text-slate-500">System Health</div>
                    <div className="text-xl font-black text-white">99.99%</div>
                  </div>
                  <div className="flex gap-1">
                    {[20, 40, 30, 60, 45, 70, 55, 80].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-1 bg-blue-500/40 rounded-t" 
                        style={{ height: `${h}%` }} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating indicator */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-blue-600 rounded-2xl p-4 shadow-xl border border-blue-400/20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <RefreshCcw className="w-5 h-5 text-white animate-spin-slow" />
                <div className="text-xs font-bold text-white">Retry Handler Active</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
