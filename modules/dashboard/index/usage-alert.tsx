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
          <h4 className="text-lg font-bold text-white">
            {isFull
              ? "Conversion Limit Reached"
              : "Approaching API Usage Limit"}
          </h4>
          <p className="text-sm text-slate-400 max-w-lg">
            {isFull
              ? "You have used 100% of your monthly conversion limit. API requests may fail until your next billing cycle."
              : `You have consumed ${Math.round(usagePercentage)}% of your monthly API limits. Upgrade your plan to ensure uninterrupted service.`}
          </p>
        </div>
      </div>
      <Link href="/dashboard/billing" className="w-full md:w-auto">
        <Button
          className={`w-full md:w-auto font-bold px-8 ${
            isFull
              ? "bg-red-600 hover:bg-blue-500 shadow-red-600/20"
              : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
          }`}
        >
          {isFull ? "Upgrade Now" : "Manage Subscription"}
        </Button>
      </Link>
    </motion.div>
  );
}
