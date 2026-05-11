"use client";

import { Terminal, Key, Cpu, FileCode, Layout, Sparkles } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

export function ApiReferenceContent() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Introduction */}
      <section id="ref-intro" className="scroll-mt-24 space-y-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">API Reference</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          The PDFBridge API is organized around REST. Our API has predictable resource-oriented URLs, 
          accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP 
          response codes, authentication, and verbs.
        </p>
      </section>

      {/* Authentication */}
      <section id="ref-auth" className="scroll-mt-24 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Key className="text-blue-500 h-6 w-6" /> Authentication
        </h2>
        <p className="text-slate-400">
          The PDFBridge API uses API keys to authenticate requests. You can view and manage your API keys 
          in the <a href="/dashboard/settings" className="text-blue-400 hover:underline">Settings</a> page.
        </p>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4">
          <p className="text-sm text-slate-300">
            Authentication is performed via the <code className="text-blue-400">x-api-key</code> header.
          </p>
          <Highlight theme={themes.vsDark} code={`curl -H "x-api-key: YOUR_API_KEY" https://api.pdfbridge.xyz/api/v1/...`} language="bash">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 rounded-lg bg-black/40 text-xs overflow-x-auto`} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </section>

      {/* Endpoints */}
      <div className="space-y-20">
        {/* POST /process */}
        <section id="ref-convert" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md font-bold text-xs">POST</span>
            <h3 className="text-xl font-bold text-white">/process</h3>
          </div>
          <p className="text-slate-400">
            Create a PDF generation job from a URL or raw HTML.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Request Body</h4>
              <ul className="space-y-4">
                <ParamRow name="html" type="string" desc="Raw HTML content to convert. Required if 'url' is not provided." />
                <ParamRow name="filename" type="string" desc="The destination filename (default: output.pdf)." />
                <ParamRow name="extractMetadata" type="boolean" desc="Enable AI-powered metadata extraction." />
                <ParamRow name="options" type="object" desc="PDF rendering options (margins, format, etc.)." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Example Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "jobId": "87ca23-...",
  "status": "pending",
  "message": "Job queued successfully"
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>

        {/* POST /normalize-invoice */}
        <section id="ref-normalize" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md font-bold text-xs">POST</span>
            <h3 className="text-xl font-bold text-white">/normalize-invoice</h3>
          </div>
          <p className="text-slate-400">
            The "Closed-Loop" workflow. Normalize an invoice into structured data for downstream intent compilation and settlement.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Request Body</h4>
              <ul className="space-y-4">
                <ParamRow name="file" type="binary" desc="The input document (PDF/PNG/JPG). Max 5MB." />
                <ParamRow name="branding" type="object" desc="Branding options: { companyName, logoUrl, primaryColor }." />
                <ParamRow name="isGhostMode" type="boolean" desc="Enable zero-retention privacy protocol." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Example Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "jobId": "norm-8231-...",
  "status": "pending",
  "message": "Normalization job queued"
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>

        {/* POST /extract */}
        <section id="ref-extract" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md font-bold text-xs">POST</span>
            <h3 className="text-xl font-bold text-white">/extract</h3>
          </div>
          <p className="text-slate-400">
            Directly upload a PDF file for intelligent Engine analysis. Optimized for Speed & Privacy.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Multipart Form Data</h4>
              <ul className="space-y-4">
                <ParamRow name="file" type="binary" desc="The PDF file to analyze. Max 20MB." />
                <ParamRow name="isGhostMode" type="boolean" desc="Process without disk storage (Pro+)." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Example Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "jobId": "ee23-...",
  "status": "processing"
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>

        {/* POST /process/bulk */}
        <section id="ref-bulk" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md font-bold text-xs">POST</span>
            <h3 className="text-xl font-bold text-white">/process/bulk</h3>
          </div>
          <p className="text-slate-400">
            Process up to 1,000 PDF generation or extraction jobs in a single request. 
            Ideal for monthly billing cycles and high-volume data processing.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Request Body</h4>
              <ul className="space-y-4">
                <ParamRow name="jobs" type="array" desc="Array of job objects (same schema as /process)." />
                <ParamRow name="extractMetadata" type="boolean" desc="Run Engine analysis on all generated documents." />
                <ParamRow name="webhookUrl" type="string" desc="Global webhook for all job completions." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Example Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "jobIds": ["job_1", "job_2", ...],
  "status": "queued",
  "count": 100
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>

        {/* GET /ledger */}
        <section id="ref-ledger" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md font-bold text-xs">GET</span>
            <h3 className="text-xl font-bold text-white">/ledger</h3>
          </div>
          <p className="text-slate-400">
            Query the organization-wide Financial Ledger of all processed documents.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Query Parameters</h4>
              <ul className="space-y-4">
                <ParamRow name="page" type="number" desc="Results page (default: 1)." />
                <ParamRow name="limit" type="number" desc="Items per page (default: 20, max: 100)." />
                <ParamRow name="currency" type="string" desc="Filter by ISO currency code." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Success Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "documents": [
    {
      "id": "ledger_823",
      "vendorName": "Acme Corp",
      "totalAmount": 1250,
      "date": "2024-03-18T10:00:00Z"
    }
  ],
  "pagination": { "total": 45, "page": 1 }
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>

        {/* GET /jobs/:id */}
        <section id="ref-polling" className="scroll-mt-24 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md font-bold text-xs">GET</span>
            <h3 className="text-xl font-bold text-white">/jobs/:id</h3>
          </div>
          <p className="text-slate-400">
            Retrieve the status and results of a generation or extraction job.
          </p>
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Path Parameters</h4>
              <ul className="space-y-4">
                <ParamRow name="id" type="string" desc="the unique jobId returned from the POST request." />
              </ul>
            </div>
            <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-6 h-fit">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Success Response</h4>
              <Highlight theme={themes.vsDark} code={`{
  "status": "SUCCESS",
  "result": {
    "url": "https://storage.pdfbridge.xyz/...",
    "normalizedUrl": "https://storage.pdfbridge.xyz/...",
    "aiMetadata": {
      "vendorName": "Acme Corp",
      "totalAmount": 1250,
      "requiresReview": false
    }
  }
}`} language="json">
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-0 bg-transparent text-xs`} style={style}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ParamRow({ name, type, desc }: { name: string; type: string; desc: string }) {
  return (
    <li className="flex flex-col gap-1 pb-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-blue-400 text-sm">{name}</span>
        <span className="text-[10px] text-slate-500 font-mono uppercase bg-slate-800/50 px-1 py-0.5 rounded italic">
          {type}
        </span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
    </li>
  );
}

