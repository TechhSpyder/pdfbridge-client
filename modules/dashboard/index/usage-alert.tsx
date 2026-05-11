import { Button } from "@/modules/app/button";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function UsageAlert({ usagePercentage }: { usagePercentage: number }) {
  if (usagePercentage < 80) return null;

  const isFull = usagePercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md ${
        isFull
          ? "bg-red-500/10 border-red-500/20"
          : "bg-amber-500/10 border-amber-500/20"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${isFull ? "bg-red-500/20" : "bg-amber-500/20"}`}
        >
          <AlertCircle
            className={`h-6 w-6 ${isFull ? "text-red-500" : "text-amber-500"}`}
          />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-sm font-bold text-red-400">
            {isFull
              ? "Workflow Limit Reached"
              : "Approaching Monthly Workflow Limit"}
          </h3>
          <p className="text-sm text-slate-400 max-w-lg">
            {isFull
              ? "You've used all your invoice workflows for this billing period. New settlement jobs will be blocked until you buy a top-up pack or upgrade your plan."
              : `You've consumed ${Math.round(usagePercentage)}% of your monthly invoice workflows. Buy a top-up for $9 or upgrade to avoid disruption.`}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <Link href="/dashboard/billing" className="w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-auto font-bold px-6 border-white/10 text-slate-300 hover:bg-white/5"
          >
            Buy Top-Up — $9
          </Button>
        </Link>
        <Link href="/dashboard/billing" className="w-full md:w-auto">
          <Button
            className={`w-full md:w-auto font-bold px-8 ${
              isFull
                ? "bg-red-600 hover:bg-red-500 shadow-red-600/20"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
            }`}
          >
            {isFull ? "Upgrade Plan" : "Manage Plan"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
