import { cn } from "@/utils";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface AuditBadgeProps {
  isReconciled: boolean;
  requiresHumanReview: boolean;
  id?: string;
}

export function AuditBadge({ isReconciled, requiresHumanReview, id }: AuditBadgeProps) {
  const isPass = isReconciled && !requiresHumanReview;

  return (
    <div className="flex items-center gap-3">
      {isPass ? (
        <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <ShieldCheck className="h-4 w-4" />
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <AlertTriangle className="h-4 w-4" />
        </div>
      )}
      <div className="flex flex-col">
        {id && (
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
            {id.split("-")[0].toUpperCase()}
          </span>
        )}
        <span
          className={cn(
            "text-[8px] font-black uppercase tracking-widest mt-0.5",
            isPass ? "text-emerald-500/60" : "text-amber-500/60"
          )}
        >
          {isPass ? "Audit Pass" : "Audit Escalation"}
        </span>
      </div>
    </div>
  );
}
