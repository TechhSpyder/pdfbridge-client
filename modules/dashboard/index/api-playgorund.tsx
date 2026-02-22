import { Button } from "@/modules/app/button";
import { useMe } from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { useApiClient } from "@/utils/api-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ApiPlayground() {
  const [url, setUrl] = useState("https://example.com");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "test">("test");
  const [extractMetadata, setExtractMetadata] = useState(false);
  const api = useApiClient();

  const { data: userData } = useMe();
  const allowAi = userData?.plan?.allowAi;

  const handleTest = async () => {
    if (extractMetadata && !allowAi && mode === "live") {
      toast.error("AI Extraction restricted", {
        description: "Please upgrade your plan to use Gemini AI features.",
      });
      return;
    }
    setLoading(true);
    const tId = toast.loading(`Processing ${mode} conversion...`, {
      description: "We are preparing your PDF...",
    });
    try {
      await api.post("/api/v1/convert", {
        url,
        testMode: mode === "test",
        extractMetadata: mode === "live" && extractMetadata && allowAi,
        webhookUrl: webhookUrl || undefined,
      });
      toast.success("Conversion queued successfully!", {
        id: tId,
        description:
          mode === "test"
            ? "Test PDF (watermarked) will appear in Recent Activity."
            : "PDF will appear in Recent Activity momentarily.",
      });
    } catch (e: any) {
      const isRateLimited =
        e.message?.toLowerCase().includes("rate limit") ||
        e.message?.toLowerCase().includes("ip");
      const isQuotaError =
        e.message?.toLowerCase().includes("quota") ||
        e.message?.toLowerCase().includes("credit");

      toast.error(
        isRateLimited
          ? "Slow down!"
          : isQuotaError
            ? "Monthly limit reached"
            : "Failed to initiate conversion",
        {
          id: tId,
          description: e.message || "Please check your network and try again.",
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Source URL
          </label>
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 gap-1">
            {(["test", "live"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all duration-300 cursor-pointer active:scale-90 ${
                  mode === m
                    ? m === "test"
                      ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                      : "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {m} Mode
              </button>
            ))}
          </div>
        </div>
        <div className="flex max-md:flex-col gap-2.5">
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
            className={cn(
              "max-sm:text-xs transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-xl",
              {
                "bg-linear-to-r from-orange-500 to-orange-600! hover:shadow-orange-500/20 shadow-lg":
                  mode === "test",
              },
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Run ${mode === "test" ? "Test" : "Live"}`
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Webhook URL (Optional)
          </label>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="https://webhook.site/your-unique-id"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-2">
              Gemini AI Extraction
              {!allowAi && (
                <span className="bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[8px] border border-amber-500/20 uppercase">
                  Upgrade Required
                </span>
              )}
              {allowAi && (
                <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[8px] border border-blue-500/20 uppercase">
                  Pro Feature
                </span>
              )}
            </span>
            <p className="text-[9px] text-slate-500">
              {allowAi
                ? "Automatically extract structured JSON from the generated document."
                : "Structured AI extraction is available on Starter plans and above."}
            </p>
          </div>
          <button
            onClick={() => setExtractMetadata(!extractMetadata)}
            disabled={mode === "test" || !allowAi}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed!",
              mode === "test" || !allowAi
                ? "cursor-not-allowed!"
                : "cursor-pointer",
              extractMetadata && mode === "live" && allowAi
                ? "bg-blue-600"
                : "bg-slate-700",
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                extractMetadata && mode === "live" && allowAi
                  ? "translate-x-4"
                  : "translate-x-1",
              )}
            />
          </button>
        </div>

        {mode === "test" && (
          <p className="text-[10px] text-orange-400 font-medium italic">
            * Test mode adds a diagonal watermark to the generated PDF. AI
            extraction is disabled in Test mode.
          </p>
        )}
      </div>

      <div className="p-4 rounded-xl bg-black/60 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Request Payload
          </span>
        </div>
        <pre className="text-xs font-mono text-blue-400 overflow-x-auto">
          {JSON.stringify(
            {
              url,
              webhookUrl: webhookUrl || undefined,
              testMode: mode === "test",
              extractMetadata: mode === "live" && extractMetadata,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}
