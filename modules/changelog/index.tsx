"use client";

import { motion } from "framer-motion";
import { CHANGELOG_DATA } from "./data";
import { CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/utils";

export function Changelog() {
  return (
    <div className="space-y-16 py-12">
      {CHANGELOG_DATA.map((entry, index) => (
        <motion.div
          key={entry.version}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative pl-8 md:pl-0"
        >
          {/* Timeline Connector */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 md:left-1/2 md:-ml-px" />

          {/* Version Circle */}
          <div className="absolute left-[-4px] top-0 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] md:left-1/2 md:-ml-[4px]" />

          <div
            className={cn(
              "flex flex-col md:w-[calc(50%-2rem)]",
              index % 2 === 0
                ? "md:ml-auto md:pl-8 text-left"
                : "md:mr-auto md:pr-8 md:text-right",
            )}
          >
            <div
              className={cn(
                "flex flex-col gap-2",
                index % 2 === 0 ? "" : "md:items-end",
              )}
            >
              <span className="text-sm font-mono text-blue-400">
                v{entry.version}
              </span>
              <h3 className="text-2xl font-bold text-white">{entry.title}</h3>
              <p className="text-xs text-slate-500 font-medium">{entry.date}</p>
            </div>

            <div className="mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {entry.description}
              </p>

              <div className="space-y-4">
                {entry.changes.map((change, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3 text-sm",
                      index % 2 !== 0 ? "md:flex-row-reverse" : "",
                    )}
                  >
                    <div className="shrink-0 mt-0.5">
                      {change.type === "feature" && (
                        <Zap className="h-4 w-4 text-amber-400" />
                      )}
                      {change.type === "improvement" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      {change.type === "fix" && (
                        <AlertCircle className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-slate-300">{change.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
