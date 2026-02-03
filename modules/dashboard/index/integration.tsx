import { useMe } from "@/modules/hooks/queries";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function IntegrationSnippets() {
  const [lang, setLang] = useState("javascript");
  const [mode, setMode] = useState<"live" | "test">("live");
  const { data: userData } = useMe();
  const userIdHash = userData?.id
    ? btoa(userData.id).slice(0, 16)
    : "secure_identifier";
  const liveKeyFull = `pk_live_${userIdHash}`;
  const testKeyFull = `pk_test_${userIdHash}`;

  const displayKey = mode === "live" ? "pk_live_••••••••" : "pk_test_••••••••";
  const copyKey = mode === "live" ? liveKeyFull : testKeyFull;

  const getSnippets = (k: string) => ({
    javascript: `const res = await fetch("https://api.pdfbridge.xyz/v1/convert", {
  method: "POST",
  headers: {
    "X-API-Key": "${k}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://google.com"
  })
});`,
    python: `import requests
 
res = requests.post(
    "https://api.pdfbridge.xyx/v1/convert",
    headers={"X-API-Key": "${k}"},
    json={"url": "https://google.com"}
)`,
    php: `$ch = curl_init("https://api.pdfbridge.xyz/v1/convert");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: ${k}",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "url" => "https://google.com"
]));
$res = curl_exec($ch);`,
    curl: `curl -X POST https://api.pdfbridge.xyz/v1/convert \\
  -H "X-API-Key: ${k}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://google.com"}'`,
  });

  const displaySnippets: any = getSnippets(displayKey);
  const copySnippets: any = getSnippets(copyKey);

  return (
    <div className="rounded-2xl border border-muted bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between bg-black/40 border-b border-muted p-2">
        <div className="flex gap-2">
          {Object.keys(displaySnippets).map((l) => (
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
        <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5 gap-1">
          {(["live", "test"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded transition-all cursor-pointer ${
                mode === m
                  ? m === "live"
                    ? "bg-emerald-500 text-white"
                    : "bg-orange-500 text-white"
                  : "text-slate-500 hover:text-slate-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 bg-black/40 relative group">
        <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed pr-10">
          {displaySnippets[lang]}
        </pre>
        <button
          onClick={() => {
            navigator.clipboard.writeText(copySnippets[lang]);
            toast.success("Full code snippet copied to clipboard!");
          }}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-xl hover:bg-slate-700"
        >
          <Copy className="h-4 w-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
