import { Button } from "@/modules/app/button";
import { cn } from "@/utils";
import { useApiClient } from "@/utils/api-client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ApiPlayground() {
  const [url, setUrl] = useState("https://example.com");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "test">("test");
  const api = useApiClient();

  const handleTest = async () => {
    setLoading(true);
    const tId = toast.loading(`Processing ${mode} conversion...`, {
      description: "We are preparing your PDF...",
    });
    try {
      await api.post("/api/v1/convert", { url, testMode: mode === "test" });
      toast.success("Conversion queued successfully!", {
        id: tId,
        description:
          mode === "test"
            ? "Test PDF (watermarked) will appear in and Recent Activity."
            : "PDF will appear in Recent Activity momentarily.",
      });
    } catch (e: any) {
      // Use the message from the API if available
      const errorMessage = e.message || "Failed to initiate conversion";
      toast.error(errorMessage, {
        id: tId,
        description: "Please check your limits or configuration.",
      });
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
                className={`px-3 py-1 text-[9px] font-bold uppercase rounded-md transition-all cursor-pointer ${
                  mode === m
                    ? m === "test"
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {m} Mode
              </button>
            ))}
          </div>
        </div>
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
            className={cn("max-sm:text-xs", {
              "bg-linear-to-r from-orange-500 to-orange-600! hover:bg-orange-500":
                mode === "test",
            })}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Run ${mode === "test" ? "Test" : "Live"}`
            )}
          </Button>
        </div>
        {mode === "test" && (
          <p className="text-[10px] text-orange-400 font-medium italic">
            * Test mode adds a diagonal watermark to the generated PDF.
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
            { url, options: { format: "A4" }, testMode: mode === "test" },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
    // </div>
  );
}
