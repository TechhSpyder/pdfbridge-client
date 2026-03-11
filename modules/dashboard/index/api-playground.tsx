import { Button } from "@/modules/app/button";
import {
  useMe,
  useSaveTemplate,
  useJobStatus,
  useNormalizeInvoice,
} from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { useApiClient } from "@/utils/api-client";
import { Loader2, Sparkles, Terminal, Upload } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { toast } from "sonner";
import { Dialog } from "@/modules/app/dialog";
import { useDropzone } from "react-dropzone";

function generateSnippet(
  lang: "node" | "python" | "curl",
  activeTab: "url" | "html" | "file",
  url: string,
  html: string,
  mode: "live" | "test",
  extractMetadata: boolean,
  webhookUrl: string,
  uniqueVariables:string[],
  fallbackKey?: string
) {
  const apiKey = fallbackKey || "YOUR_API_KEY";

  if (activeTab === "file") {
    const endpoint = "https://pdfbridge.xyz/api/v1/normalize-invoice";
    if (lang === "curl") {
      return `curl -X POST ${endpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "file=@/path/to/your/invoice.pdf"${mode === "test" ? ' \\\n  -F "testMode=true"' : ""}`;
    }
    if (lang === "python") {
      return `import requests
 
url = "${endpoint}"
files = {'file': open('invoice.pdf', 'rb')}
data = {'testMode': 'true'} if "${mode}" == "test" else {}
headers = {"Authorization": "Bearer ${apiKey}"}
 
response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`;
    }
    return `const formData = new FormData();
formData.append("file", fileObject);
${mode === "test" ? 'formData.append("testMode", "true");' : ""}
 
const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}"
  },
  body: formData
});
 
const data = await response.json();
console.log(data);`;
  }

  const payload: Record<string, any> = {};
  if (activeTab === "url") payload.url = url;
  else payload.html = html || "<h1>Hello World</h1>";
  if (mode === "test") payload.testMode = true;
  if (extractMetadata) payload.extractMetadata = true;
  if (webhookUrl) payload.webhookUrl = webhookUrl;
  if (uniqueVariables.length > 0 && activeTab === "html") {
    payload.variables = uniqueVariables.reduce(
      (acc, v) => ({ ...acc, [v]: "value" }),
      {},
    );
  }

  const payloadStr = JSON.stringify(payload, null, 2);
  const endpoint = "https://pdfbridge.xyz/api/v1/convert";

  if (lang === "curl") {
    return `curl -X POST ${endpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${payloadStr}'`;
  }

  if (lang === "python") {
    return `import requests
import json
 
url = "${endpoint}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = ${payloadStr.replace(/true/g, "True").replace(/false/g, "False")}
 
response = requests.post(url, headers=headers, json=payload)
print(response.json())`;
  }

  return `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${payloadStr.replace(/\n/g, "\n  ")})
});
 
const data = await response.json();
console.log(data);`;
}

export function ApiPlayground() {
  const [url, setUrl] = useState("https://example.com");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "test">("test");
  const [extractMetadata, setExtractMetadata] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"url" | "html" | "file">("url");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [snippetLang, setSnippetLang] = useState<"curl" | "node" | "python">(
    "node",
  );

  const api = useApiClient();
  const { data: me } = useMe();
  const saveMutation = useSaveTemplate();
  const normalizeMutation = useNormalizeInvoice();
  const { data: jobStatus } = useJobStatus(activeJobId || "");

  const userKeys = me?.apiKeys || [];
  const currentKeyHint = userKeys.find((k: any) => k.type === mode)?.hint;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        normalizeMutation.mutate({
          file: acceptedFiles[0],
          testMode: mode === "test",
        });
      }
    },
    [normalizeMutation, mode],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: activeTab !== "file",
  });

  const detectedVariables =
    html
      .match(/\{\{\s*([\w.]+)\s*\}\}/g)
      ?.map((v) => v.replace(/[\{\}\s]/g, "")) || [];
  const uniqueVariables = Array.from(new Set(detectedVariables));

  const { data: userData } = useMe();
  const allowAi = userData?.plan?.allowAi;

  useEffect(() => {
    if (!jobStatus || !activeJobId) return;

    if (jobStatus.status === "COMPLETED") {
      toast.success("PDF Generated!", {
        description: "Your document is ready for download.",
        action: {
          label: "Download",
          onClick: () => window.open(jobStatus?.result?.url, "_blank"),
        },
      });
      setActiveJobId(null);
    } else if (jobStatus.status === "FAILED") {
      toast.error("Generation Failed", {
        description: jobStatus.result?.error || "An unknown error occurred.",
      });
      setActiveJobId(null);
    }
  }, [jobStatus, activeJobId]);

  const handleTest = async () => {
    if (activeTab === "file") return;

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
      const res = await api.post("/api/v1/convert", {
        ...(activeTab === "url" ? { url } : { html }),
        testMode: mode === "test",
        extractMetadata: mode === "live" && extractMetadata && allowAi,
        webhookUrl: webhookUrl || undefined,
      });

      if (res.jobId) {
        setActiveJobId(res.jobId);
      }

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
    <div
      id="api-playground-section"
      className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {activeTab === "file" ? "Invoice Normalization" : "Source Input"}
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
          {(["url", "html", "file"] as const).map((t) => (
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
          {activeTab === "url" && (
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="https://your-website.com"
            />
          )}

          {activeTab === "html" && (
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

          {activeTab === "file" && (
            <div
              {...getRootProps()}
              className={cn(
                "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer min-h-[120px]",
                isDragActive
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-white/10 bg-black/40 text-slate-500 hover:border-white/20 hover:bg-white/5",
              )}
            >
              <input {...getInputProps()} />
              {normalizeMutation.isPending ? (
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              ) : (
                <Upload className="h-8 w-8 mb-2" />
              )}
              <p className="text-sm font-medium text-center">
                {normalizeMutation.isPending
                  ? "Normalizing via AI..."
                  : "Drop invoice PDF here to test ERP sync"}
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                Supports all global invoice formats
              </p>
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full">
            <Button
              onClick={handleTest}
              disabled={loading || activeTab === "file"}
              className={cn(
                "max-sm:text-xs transition-transform w-1/2 hover:-translate-y-0.5 active:translate-y-0 shadow-xl",
                {
                  "bg-linear-to-r from-orange-500 to-orange-600! hover:shadow-orange-500/20 shadow-lg":
                    mode === "test",
                  "opacity-50 grayscale cursor-not-allowed":
                    activeTab === "file",
                },
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : activeTab === "file" ? (
                "Upload Required"
              ) : (
                `Run ${mode === "test" ? "Test" : "Live"}`
              )}
            </Button>
            <Button
              variant="secondary"
              disabled={activeTab === "file"}
              onClick={handleSaveTemplate}
              className="border-white/5 bg-white/5 w-1/2 hover:bg-white/10 gap-2 disabled:opacity-50"
              title="Save this URL as a template"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="max-sm:hidden text-[10px] uppercase font-bold">
                Save as Template
              </span>
            </Button>
          </div>
        </div>

        {activeTab !== "file" && (
          <>
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
          </>
        )}

        {mode === "test" && (
          <p className="text-[10px] text-orange-400 font-medium italic">
            * Test mode adds a diagonal watermark to the generated PDF. AI
            extraction is disabled in Test mode.
          </p>
        )}
      </div>

      <div className="rounded-xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col">
        {/* Term Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2 px-4 py-3">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Integration Code
            </span>
          </div>
          <div className="flex items-center gap-4 pr-4">
            <div className="flex gap-1">
              {(["node", "python", "curl"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSnippetLang(lang)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer",
                    snippetLang === lang
                      ? "bg-slate-800/80 text-white"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Code Content */}
        <div className="relative p-0 max-h-[300px] overflow-y-auto custom-scrollbar font-mono text-xs">
          <Highlight
            theme={themes.vsDark}
            language={
              snippetLang === "node"
                ? "typescript"
                : snippetLang === "curl"
                  ? "bash"
                  : "python"
            }
            code={generateSnippet(
              snippetLang,
              activeTab,
              url,
              html,
              mode,
              extractMetadata && allowAi,
              webhookUrl,
              uniqueVariables,
              currentKeyHint,
            )}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(className, "p-4 m-0 bg-transparent!")}
                style={style}
              >
                {tokens.map((line, i) => {
                  const { key, ...lineProps } = getLineProps({
                    line,
                    key: i,
                  }) as any;
                  return (
                    <div key={key} {...lineProps}>
                      <span className="inline-block w-6 text-slate-600 select-none opacity-50 text-[10px] mr-4">
                        {i + 1}
                      </span>
                      {line.map((token, keyIdx) => {
                        const { key: tokenKey, ...tokenProps } = getTokenProps({
                          token,
                          key: keyIdx,
                        }) as any;
                        return <span key={tokenKey} {...tokenProps} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                generateSnippet(
                  snippetLang,
                  activeTab,
                  url,
                  html,
                  mode,
                  extractMetadata && allowAi,
                  webhookUrl,
                  uniqueVariables,
                  currentKeyHint,
                ),
              );
              toast.success("Snippet copied to clipboard");
            }}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors shadow-lg cursor-pointer"
          >
            Copy
          </button>
        </div>
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
