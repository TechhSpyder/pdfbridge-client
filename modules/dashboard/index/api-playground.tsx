import { Button } from "@/modules/app/button";
import {
  useMe,
  useApiKeys,
  useJobStatus,
  useIngestDocument,
} from "@/modules/hooks/queries";
import { cn } from "@/utils";
import { Loader2, Terminal, Upload } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

function generateSnippet(
  lang: "node" | "python" | "curl",
  mode: "live" | "test",
  fallbackKey?: string,
) {
  const apiKey = fallbackKey || "YOUR_API_KEY";
  const endpoint = "https://api.pdfbridge.xyz/api/v1/ingest";

  if (lang === "curl") {
    return `curl -X POST ${endpoint} \\
  -H "x-api-key: ${apiKey}" \\
  -F "file=@/path/to/your/invoice.pdf"${mode === "test" ? ' \\\n  -F "testMode=true"' : ""}`;
  }
  if (lang === "python") {
    return `import requests
 
url = "${endpoint}"
files = {'file': open('invoice.pdf', 'rb')}
data = {'testMode': 'true'} if "${mode}" == "test" else {}
headers = {"x-api-key": "${apiKey}"}
 
response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`;
  }
  return `const formData = new FormData();
formData.append("file", fileObject);
${mode === "test" ? 'formData.append("testMode", "true");' : ""}
 
const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "x-api-key": "${apiKey}"
  },
  body: formData
});
 
const data = await response.json();
console.log(data);`;
}

export function ApiPlayground() {
  const [mode, setMode] = useState<"live" | "test">("test");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [snippetLang, setSnippetLang] = useState<"curl" | "node" | "python">(
    "node",
  );

  const { data: me } = useMe();
  const { data: keysData } = useApiKeys();
  const ingestMutation = useIngestDocument();
  const { data: jobStatus } = useJobStatus(activeJobId || "");
  const currentToastIdRef = useRef<string | number | null>(null);

  const userKeys = keysData?.keys || [];
  const currentKeyHint = userKeys.find((k: any) => k.type === mode)?.hint;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // Security check for Live mode
        if (mode === "live") {
          const hasLiveKey = userKeys.some((k: any) => k.type === "live");
          if (!hasLiveKey) {
            toast.error("Live API Key Required", {
              description: "You need a live API key for production ingestion.",
            });
            return;
          }
        }

        ingestMutation.mutate({
          file: acceptedFiles[0],
          testMode: mode === "test",
        });
      }
    },
    [ingestMutation, mode, userKeys],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (!jobStatus || !activeJobId) return;

    if (jobStatus.status === "COMPLETED") {
      toast.success("Document Ingested!", {
        id: currentToastIdRef.current || undefined,
        description: "Your document is ready in the Financial Ledger.",
      });
      currentToastIdRef.current = null;
      setActiveJobId(null);
    } else if (jobStatus.status === "FAILED") {
      toast.error("Ingestion Failed", {
        id: currentToastIdRef.current || undefined,
        description: (jobStatus as any).result?.error || "Math mismatch or audit failure.",
      });
      currentToastIdRef.current = null;
      setActiveJobId(null);
    }
  }, [jobStatus, activeJobId]);

  return (
    <div
      id="api-playground-section"
      className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Document Ingestion Pipeline
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

        <div className="flex flex-col gap-4">
          <div
            {...getRootProps()}
            className={cn(
              "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-all cursor-pointer min-h-[160px]",
              isDragActive
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-white/10 bg-black/40 text-slate-500 hover:border-white/20 hover:bg-white/5",
            )}
          >
            <input {...getInputProps()} />
            {ingestMutation.isPending ? (
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            ) : (
              <Upload className="h-10 w-10 mb-3" />
            )}
            <p className="text-sm font-semibold text-center text-slate-200">
              {ingestMutation.isPending
                ? "Hardening Document Intelligence..."
                : "Drop Invoice for Deterministic Ingestion"}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 text-center max-w-[250px]">
              Supports PDF, PNG, and JPEG. Native OCR and Math Audit applied instantly.
            </p>
          </div>
        </div>

        {mode === "test" && (
          <p className="text-[10px] text-orange-400 font-medium italic">
            * Test mode ingests documents into the sandbox. Reconciliation audits are active but tax ghosting is simulated.
          </p>
        )}
      </div>

      <div className="rounded-xl bg-slate-950 border border-white/10 overflow-hidden shadow-2xl flex flex-col">
        {/* Term Header */}
        <div className="flex items-center justify-between border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center gap-2 px-4 py-3">
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Institutional Integration
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
        <div className="relative p-0 max-h-[350px] overflow-y-auto custom-scrollbar font-mono text-xs">
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
              mode,
              currentKeyHint,
            )}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn(className, "p-5 m-0 bg-transparent!")}
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
                      {line.map((token, keyIdx) => (
                        <span key={keyIdx} {...getTokenProps({ token })} />
                      ))}
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
                  mode,
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
    </div>
  );
}
