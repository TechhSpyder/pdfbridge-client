import { Button } from "@/modules/app/button";
import { useMe, useSaveTemplate } from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { useApiClient } from "@/utils/api-client";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/modules/app/dialog";

export function ApiPlayground() {
  const [url, setUrl] = useState("https://example.com");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "test">("test");
  const [extractMetadata, setExtractMetadata] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"url" | "html">("url");
  const api = useApiClient();
  const saveMutation = useSaveTemplate();

  const detectedVariables =
    html
      .match(/\{\{\s*([\w.]+)\s*\}\}/g)
      ?.map((v) => v.replace(/[\{\}\s]/g, "")) || [];
  const uniqueVariables = Array.from(new Set(detectedVariables));

  const { data: userData } = useMe();
  const allowAi = userData?.plan?.allowAi;

  const handleTest = async () => {
    if (extractMetadata && !allowAi && mode === "live") {
      toast.error("Intelligent PDF Analysis restricted", {
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
        ...(activeTab === "url" ? { url } : { html }),
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

  const handleSaveTemplate = async () => {
    if (!url) return;
    setIsSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    try {
      await saveMutation.mutateAsync({
        name: saveName,
        html: `<!-- Generated from URL: ${url} -->\n<iframe src="${url}" style="width:100%; height:1000px; border:none;"></iframe>`,
      });
      toast.success("Template saved!", {
        description: `${saveName} has been added to your library.`,
      });
      setIsSaveDialogOpen(false);
      setSaveName("");
    } catch (e: any) {
      toast.error("Failed to save template", {
        description: e.message || "Please try again.",
      });
    }
  };

  return (
    <div className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
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
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 gap-1 mb-2">
          {(["url", "html"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer",
                activeTab === t
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          {activeTab === "url" ? (
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://your-website.com"
            />
          ) : (
            <div className="flex-1 relative">
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-blue-300 focus:outline-none focus:border-blue-500 transition-colors min-h-[120px] resize-none"
                placeholder="<h1>Hello {{name}}</h1>"
              />
              {uniqueVariables.length > 0 && (
                <div className="absolute top-3 right-3 flex flex-wrap gap-1 max-w-[150px] justify-end">
                  {uniqueVariables.map((v) => (
                    <span
                      key={v}
                      className="bg-indigo-500/20 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase font-bold"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full">
            <Button
              onClick={handleTest}
              disabled={loading}
              className={cn(
                "max-sm:text-xs transition-transform w-1/2 hover:-translate-y-0.5 active:translate-y-0 shadow-xl",
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
            <Button
              variant="secondary"
              onClick={handleSaveTemplate}
              className="border-white/5 bg-white/5 w-1/2 hover:bg-white/10 gap-2"
              title="Save this URL as a template"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="max-sm:hidden text-[10px] uppercase font-bold">
                Save as Template
              </span>
            </Button>
          </div>
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
              Intelligent PDF Analysis
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
                : "Intelligent PDF Analysis is available on Starter plans and above."}
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
              ...(activeTab === "url"
                ? { url }
                : {
                    html:
                      html.substring(0, 100) + (html.length > 100 ? "..." : ""),
                  }),
              webhookUrl: webhookUrl || undefined,
              testMode: mode === "test",
              extractMetadata: mode === "live" && extractMetadata,
              variables:
                uniqueVariables.length > 0 ? "{ ... detected ... }" : undefined,
            },
            null,
            2,
          )}
        </pre>
      </div>

      <SaveTemplateDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        name={saveName}
        setName={setSaveName}
        onConfirm={confirmSave}
        isPending={saveMutation.isPending}
      />
    </div>
  );
}

function SaveTemplateDialog({
  open,
  onOpenChange,
  name,
  setName,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Save to Library</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className="items-start gap-4">
          <p className="text-sm text-slate-400">
            Store this configuration as a reusable template.
          </p>
          <div className="w-full space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Template Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onConfirm()}
              className="w-full bg-black/40 border border-white/5 text-slate-300 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g. Website Wrapper"
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer className="gap-3">
          <Dialog.Close>
            <Button variant="secondary" className="h-11 px-6">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={onConfirm}
            disabled={!name || isPending}
            className="h-11 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/20"
          >
            {isPending ? "Saving..." : "Save Template"}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
