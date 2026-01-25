"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "../app/button";
import { GlowCard } from "../app/glow-card";

import {
  Loader2,
  AlertCircle,
  Zap,
  Key,
  Activity,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Code2,
  FileText,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMe, useConversions } from "../hooks/queries";
import { useApiClient } from "@/app/api/api-client";
import { toast } from "sonner";

export function DashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: userData, isLoading: beLoading, error } = useMe();

  // Check if new user (created within last minute of sign in)
  const isNewUser =
    clerkUser?.createdAt && clerkUser?.lastSignInAt
      ? Math.abs(
          clerkUser.createdAt.getTime() - clerkUser.lastSignInAt.getTime(),
        ) < 60000
      : false;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!clerkLoaded || beLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-blue-500/20 rounded-full animate-pulse" />
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 relative z-10" />
        </div>
        <p className="text-slate-400 font-medium animate-pulse text-center">
          Synchronizing your developer workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-md max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Connection Error
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            We couldn't connect to your backend environment. This usually
            happens during synchronization.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const usageCount = userData?.usage?.count || 0;
  const usageLimit = userData?.plan?.limit || 5;
  const usagePercentage = Math.min((usageCount / usageLimit) * 100, 100);

  const getDaysUntilReset = () => {
    const anchorDate = userData?.planStartedAt || userData?.createdAt;
    if (!anchorDate) return 0;

    const now = new Date();
    const joined = new Date(anchorDate);
    const day = joined.getDate();

    // Target date in current month
    let target = new Date(now.getFullYear(), now.getMonth(), day);

    // If target has passed, move to next month
    if (now.getDate() >= day) {
      target = new Date(now.getFullYear(), now.getMonth() + 1, day);
    }

    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntilReset = getDaysUntilReset();
  const keyHint = userData?.id ? `pk_live_••••••••` : "sk_loading_••••••••";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isNewUser ? "Welcome, " : "Welcome back, "}
            <span className="text-blue-500">
              {clerkUser?.firstName || "Developer"}
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl">
            Manage your PDF infrastructure and monitor API performance across
            your applications.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/docs" target="_blank">
            <Button
              variant="outline"
              className="gap-2 flex items-center justify-center border-white/5 hover:bg-white/5"
            >
              <FileText className="h-4 w-4" />
              API Docs
            </Button>
          </Link>
        </div>
      </div>

      {/* Usage Analytics Graph */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Conversion Trends</h2>
            <p className="text-sm text-slate-500">
              Daily conversion volume for this billing cycle
            </p>
          </div>
          <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
            <button className="px-3 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-md shadow-lg cursor-pointer transition-all active:scale-95">
              7 Days
            </button>
            <button
              onClick={() => toast.info("30-day analytics unlocking in V1.1")}
              className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-300 cursor-pointer transition-all active:scale-95"
            >
              30 Days
            </button>
          </div>
        </div>
        <UsageGraph />
      </div>

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlowCard
          title="Monthly Requests"
          sub={`${usageCount} / ${usageLimit}`}
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          content={
            <div className="mt-4 space-y-3">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">
                  Reset in {daysUntilReset}{" "}
                  {daysUntilReset === 1 ? "day" : "days"}
                </span>
                <span className="text-blue-400 font-bold">
                  {Math.round(usagePercentage)}% utilized
                </span>
              </div>
            </div>
          }
        />

        <GlowCard
          title="Secret Keys"
          sub="1 Active Identifier"
          icon={<Key className="h-5 w-5 text-emerald-500" />}
          content={
            <div className="mt-4 space-y-4">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between group/key">
                <code className="text-[10px] font-mono text-slate-400 truncate pr-2">
                  {keyHint}
                </code>
                <button
                  onClick={() => {
                    copyToClipboard(keyHint);
                    toast.info(
                      "This is just a hint. View API Keys for the full secret.",
                    );
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-500 hover:text-white cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <Link href="/dashboard/api-keys" className="block">
                <Button
                  variant="outline"
                  className="w-full text-xs h-9 gap-2 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400"
                >
                  Manage & Rotate <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          }
        />

        <GlowCard
          title="Current Plan"
          sub={userData?.plan?.name || "Standard Free"}
          icon={<Zap className="h-5 w-5 text-amber-500" />}
          content={
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {userData?.plan?.limit.toLocaleString()} conversions / mo
              </div>
              <Link href="/dashboard/billing" className="block">
                <Button
                  variant="outline"
                  className="w-full text-xs h-9 border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                >
                  View Details & Billing
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      {/* Upgrade Prompts */}
      <UsageAlert usagePercentage={usagePercentage} />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* API Playground Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800/50">
              <Terminal className="h-5 w-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">API Playground</h2>
          </div>

          <ApiPlayground />

          <div className="flex items-center gap-3 pt-6">
            <div className="p-2 rounded-lg bg-orange-800/20">
              <Code2 className="h-5 w-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Integration Snippets
            </h2>
          </div>
          <IntegrationSnippets />
        </div>

        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm space-y-6 border border-muted p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-800/20">
                  <Activity className="h-5 w-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Recent Conversions
                </h2>
              </div>

              <span className="hidden md:inline text-[10px] text-slate-500 font-medium">
                Updates automatically as jobs complete
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/usage"
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <RecentConversionsList />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentConversionsList() {
  const [pollInterval, setPollInterval] = useState<number | undefined>(30000);
  const { data, isLoading } = useConversions(1, 5, pollInterval);
  const conversions = data?.conversions || [];

  const hasPending = conversions.some((c: any) => c.status === "PENDING");

  useEffect(() => {
    if (hasPending) {
      setPollInterval(3000); // Fast poll when things are happening
    } else {
      setPollInterval(30000); // Slow poll otherwise
    }
  }, [hasPending]);

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm p-6 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-600">
          <Activity className="h-8 w-8" />
        </div>
        <p className="text-slate-500 text-sm max-w-[200px] mx-auto leading-relaxed">
          No conversion attempts recorded in this billing cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversions.map((conv: any) => (
        <div
          key={conv.id}
          className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate max-w-[150px]">
              {conv.url && conv.url.startsWith("http")
                ? new URL(conv.url).hostname
                : "HTML Payload"}
            </span>
            <span className="text-[10px] text-slate-500">
              {new Date(conv.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {conv.status === "PENDING" ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 flex items-center gap-1.5 animate-pulse">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Pending
              </span>
            ) : conv.status === "FAILED" || !conv.success ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500">
                Failed
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                Ready
              </span>
            )}

            {conv.success && (
              <div className="flex items-center gap-1">
                <Link
                  href={conv.url}
                  target="_blank"
                  download
                  title="Download PDF"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(conv.url);
                    toast.success("URL copied to clipboard");
                  }}
                  title="Copy URL"
                  className="p-1.5 hover:bg-white/10 rounded-md transition text-slate-400 hover:text-white cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ApiPlayground() {
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const api = useApiClient();

  const handleTest = async () => {
    setLoading(true);
    const tId = toast.loading("Initiating test conversion...", {
      description: "Asynchronous worker is spinning up...",
    });
    try {
      await api.post("/api/v1/convert", { url });
      toast.success("Conversion queued successfully!", {
        id: tId,
        description: "PDF will appear in Recent Activity within seconds.",
      });
    } catch (e: any) {
      toast.error(e.message, { id: tId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Source URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://your-website.com"
            />
            <Button
              onClick={handleTest}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Run Test"
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/60 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Request Payload
            </span>
          </div>
          <pre className="text-xs font-mono text-blue-400 overflow-x-auto">
            {JSON.stringify({ url, options: { format: "A4" } }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function UsageGraph() {
  // Mock data for now, ideally derived from recent conversions aggregation
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = [12, 18, 5, 25, 40, 15, 30];
  const max = Math.max(...counts);

  return (
    <div className="h-48 flex items-end justify-between gap-2 px-2">
      {counts.map((c, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
          <div className="relative w-full flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(c / max) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="w-full max-w-[40px] bg-linear-to-t from-blue-600/20 to-blue-500 rounded-t-lg group-hover:from-blue-500 group-hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            />
            <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/5 px-2 py-1 rounded text-[10px] font-bold text-white">
              {c}
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-400 transition-colors">
            {days[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

function IntegrationSnippets() {
  const [lang, setLang] = useState("javascript");
  const { data: userData } = useMe();
  const key = "pk_live_YOUR_SECRET_KEY";

  const snippets: any = {
    javascript: `const res = await fetch("https://api.pdfbridge.io/v1/convert", {
  method: "POST",
  headers: {
    "X-API-Key": "${key}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://google.com"
  })
});`,
    python: `import requests

res = requests.post(
    "https://api.pdfbridge.io/v1/convert",
    headers={"X-API-Key": "${key}"},
    json={"url": "https://google.com"}
)`,
    php: `$ch = curl_init("https://api.pdfbridge.io/v1/convert");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: ${key}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "url" => "https://google.com"
]));
$res = curl_exec($ch);`,
    curl: `curl -X POST https://api.pdfbridge.io/v1/convert \\
  -H "X-API-Key: ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://google.com"}'`,
  };

  return (
    <div className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="flex bg-black/40 border-b border-muted p-2">
        {Object.keys(snippets).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all cursor-pointer ${
              lang === l
                ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="p-6 bg-black/40 relative group">
        <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed pr-10">
          {snippets[lang]}
        </pre>
        <button
          onClick={() => {
            navigator.clipboard.writeText(snippets[lang]);
            toast.success("Snippet copied to clipboard!");
          }}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl hover:bg-slate-700"
        >
          <Copy className="h-4 w-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}

function UsageAlert({ usagePercentage }: { usagePercentage: number }) {
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
