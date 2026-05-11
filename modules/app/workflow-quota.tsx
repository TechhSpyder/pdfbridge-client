/**
 * WorkflowQuota
 * Single reusable component for displaying invoice workflow usage.
 * Used in: dashboard home stat cards, billing page Monthly Capacity card.
 *
 * Shows: progress bar, used/effective, optional bonus badge, optional reset countdown.
 * Does NOT contain Paddle or checkout logic — that stays in the consuming component.
 */

import { cn } from "@/utils";
import Link from "next/link";

interface WorkflowQuotaProps {
  /** Number of workflows consumed this period */
  used: number;
  /** Base plan limit (from plan.intelligenceLimit or plan.limit) */
  planLimit: number;
  /** Extra workflows from top-up packs (bonusWorkflows from Usage record) */
  bonus?: number;
  /** Days until billing cycle resets — shown as footer hint */
  daysUntilReset?: number;
  /** Compact layout — omits footer hint, used inside GlowCard */
  compact?: boolean;
  /** Show upgrade/top-up CTA when at/near limit */
  showCta?: boolean;
}

export function WorkflowQuota({
  used,
  planLimit,
  bonus = 0,
  daysUntilReset,
  compact = false,
  showCta = false,
}: WorkflowQuotaProps) {
  const effective = planLimit + bonus;
  const pct = effective > 0 ? Math.min((used / effective) * 100, 100) : 0;
  const isAtLimit = used >= effective;
  const isWarning = pct >= 80 && !isAtLimit;

  const barColor = isAtLimit
    ? "bg-linear-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
    : isWarning
      ? "bg-linear-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
      : "bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]";

  return (
    <div className={cn("space-y-3", compact ? "mt-4" : "mt-2")}>
      {/* Bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={cn("h-full transition-all duration-1000 ease-out", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Meta row */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-2">
          {daysUntilReset !== undefined && !isAtLimit && (
            <>Resets in {daysUntilReset} {daysUntilReset === 1 ? "day" : "days"}</>
          )}
          {bonus > 0 && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              +{bonus} BONUS
            </span>
          )}
        </span>
        <span
          className={cn(
            "font-bold",
            isAtLimit ? "text-red-400" : isWarning ? "text-amber-400" : "text-blue-400",
          )}
        >
          {Math.round(pct)}% utilized
        </span>
      </div>

      {/* CTA: only shows when at/near limit */}
      {showCta && (isAtLimit || isWarning) && (
        <div
          className={cn(
            "rounded-lg p-3 text-xs flex items-center justify-between gap-3",
            isAtLimit
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-amber-500/10 border border-amber-500/20",
          )}
        >
          <span className={cn("font-medium", isAtLimit ? "text-red-300" : "text-amber-300")}>
            {isAtLimit
              ? "Workflows exhausted — new jobs will be blocked."
              : `${Math.round(100 - pct)}% capacity remaining.`}
          </span>
          <Link
            href="/dashboard/billing"
            className={cn(
              "font-bold whitespace-nowrap hover:underline",
              isAtLimit ? "text-red-400" : "text-amber-400",
            )}
          >
            {isAtLimit ? "Buy More" : "Upgrade"}
          </Link>
        </div>
      )}
    </div>
  );
}
