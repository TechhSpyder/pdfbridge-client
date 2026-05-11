import { ShieldCheck } from "lucide-react";
import React from "react";

type GovernanceProps = {
  isOwner: boolean;
  policy: any;
  updatePolicy: any;
  policySignificant: string;
  policyMaterial: string;
  setPolicySignificant: (value: string) => void;
  setPolicyMaterial: (value: string) => void;
};
export function Governance({
  isOwner,
  policy,
  updatePolicy,
  policySignificant,
  policyMaterial,
  setPolicySignificant,
  setPolicyMaterial,
}: GovernanceProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-500/10">
          <ShieldCheck className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Governance Policy</h3>
          <p className="text-xs text-slate-500">
            Spend delegation thresholds for your organization. Changes apply to
            the next compiled payment.
          </p>
        </div>
      </div>

      {isOwner ? (
        <div className="p-6 rounded-2xl border border-violet-500/20 bg-slate-900/60 space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold block">
                Significant Threshold (ADMIN auto-execute below)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  value={policySignificant}
                  onChange={(e) => setPolicySignificant(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-600">
                Payments above this amount require OWNER/APPROVER countersign.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold block">
                Material Threshold (Dual OWNER countersign + memo)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  value={policyMaterial}
                  onChange={(e) => setPolicyMaterial(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-600">
                Above this, TWO OWNER approvals are required with a mandatory
                memo.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-mono">
              Source: {policy?.source ?? "plan_default"}
            </p>
            <button
              onClick={() =>
                updatePolicy.mutate({
                  significant: Number(policySignificant),
                  material: Number(policyMaterial),
                })
              }
              disabled={updatePolicy.isPending}
              className="h-10 px-6 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-black uppercase text-[10px] transition-all disabled:opacity-50"
            >
              {updatePolicy.isPending ? "Saving..." : "Save Policy"}
            </button>
          </div>
        </div>
      ) : (
        /* ADMIN: read-only view of their effective limit */
        <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/40 space-y-4">
          <p className="text-[10px] text-slate-500 uppercase font-bold">
            Your Effective Spend Limit
          </p>
          <p className="text-3xl font-black text-white font-mono">
            $
            {Number(
              policy?.mySpendLimit ?? policy?.significantThreshold ?? 1000,
            ).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            Payments above this amount require OWNER/APPROVER authorization.
            Source:{" "}
            <span className="text-slate-400 font-mono">
              {policy?.source ?? "plan_default"}
            </span>
          </p>
          <p className="text-[10px] text-slate-600">
            Contact your OWNER to adjust your spend delegation limit.
          </p>
        </div>
      )}
    </div>
  );
}
