import { motion, AnimatePresence } from "framer-motion";
import { useConversionStats } from "../../hooks/queries";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function UsageGraph() {
  const { data: stats, isLoading } = useConversionStats(30000);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-48 flex flex-col items-center justify-center space-y-3 border border-dashed border-white/5 rounded-2xl">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Analyzing Performance...
        </p>
      </div>
    );
  }

  // Process last 7 days in UTC to match server
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const last7Days: string[] = [];
  const dayLabels: string[] = [];
  const counts: number[] = [];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const isoDay = d.toISOString().split("T")[0];
    last7Days.push(isoDay);
    dayLabels.push(weekDays[d.getUTCDay()]);
    counts.push(0);
  }

  // Fill counts from API
  if (Array.isArray(stats)) {
    stats.forEach((s: any) => {
      const sDayStr = new Date(s.day).toISOString().split("T")[0];
      const idx = last7Days.indexOf(sDayStr);
      if (idx !== -1) {
        counts[idx] = s.count;
      }
    });
  }

  const max = Math.max(...counts, 5);

  // SVG dimensions for the line chart (using percentage views)
  const points = counts.map((c, i) => ({
    x: (i / (counts.length - 1)) * 100,
    y: 100 - (c / max) * 100,
  }));

  const linePath = `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div className="space-y-6">
      <div className="h-40 relative px-2">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          {[0, 1, 2, 3].map((_, i) => (
            <div key={i} className="w-full h-px bg-slate-500" />
          ))}
        </div>

        {/* The Graph */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.path
            d={areaPath}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Interactive Regions & Points */}
          {points.map((p, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <rect
                x={p.x - 5}
                y="0"
                width="10"
                height="100"
                fill="transparent"
              />
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 2 : 1.5}
                className={`${hoveredIdx === i ? "fill-white" : "fill-blue-500"} transition-colors duration-200`}
                stroke="#3b82f6"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip Overlay */}
        <AnimatePresence>
          {hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute z-20 bg-slate-900 border border-white/10 px-3 py-2 rounded-lg shadow-2xl pointer-events-none"
              style={{
                left: `${(hoveredIdx / (counts.length - 1)) * 100}%`,
                top: `${(points[hoveredIdx].y / 100) * 160 - 45}px`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="text-[8px] uppercase font-bold text-slate-500 mb-0.5">
                {dayLabels[hoveredIdx]}
              </div>
              <div className="text-xs font-bold text-white">
                {counts[hoveredIdx]} {counts[hoveredIdx] === 1 ? "job" : "jobs"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between px-2">
        {dayLabels.map((l, i) => (
          <span
            key={i}
            className={`text-[10px] font-bold transition-colors ${hoveredIdx === i ? "text-blue-400" : "text-slate-600"}`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
