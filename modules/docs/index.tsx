"use client";

import { useState } from "react";
import { GlowCard } from "../app/glow-card";
import {
  Book,
  Key,
  Terminal,
  Webhook,
  Layout,
  FileCode,
  Info,
  ChevronRight,
  Code2,
  Cpu,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

const SECTIONS = [
  { id: "intro", title: "Introduction", icon: <Book className="h-4 w-4" /> },
  { id: "auth", title: "Authentication", icon: <Key className="h-4 w-4" /> },
  {
    id: "convert",
    title: "Convert PDF",
    icon: <FileCode className="h-4 w-4" />,
  },
  { id: "bulk", title: "Bulk Conversion", icon: <Cpu className="h-4 w-4" /> },
  {
    id: "options",
    title: "Options Reference",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    id: "tailwind",
    title: "Tailwind-Native",
    icon: <Code2 className="h-4 w-4" />,
  },
  {
    id: "ai",
    title: "AI Metadata",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    id: "n8n",
    title: "n8n Integration",
    icon: <Webhook className="h-4 w-4" />,
  },
  { id: "webhooks", title: "Webhooks", icon: <Webhook className="h-4 w-4" /> },
];

export function Documentation({
  noContainer = false,
}: {
  noContainer?: boolean;
}) {
  const [activeSection, setActiveSection] = useState("intro");

  const content = (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="sticky top-24 space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">
            Documentation
          </p>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeSection === section.id
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-20 min-w-0">
        {/* Introduction */}
        <section
          id="intro"
          className="scroll-mt-24 space-y-6 text-slate-300 leading-relaxed"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Book className="h-3 w-3" /> Get Started
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Introduction
          </h1>
          <p className="text-lg">
            Welcome to the PDFBridge API. Our platform provides high-performance
            Chromium-based PDF generation from URLs or HTML payloads. Designed
            for developers who need scale, security, and precision.
          </p>
          <GlowCard
            title="Base URL / API Versioning"
            sub="Production: v1 (Latest)"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-blue-400">
                  https://api.pdfbridge.xyz/api/v1
                </div>
              </div>
            }
          />
        </section>

        {/* Authentication */}
        <section id="auth" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Key className="text-blue-500" /> Authentication
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge uses a <strong>Dual API Key</strong> system. You are
            assigned two keys upon signup:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
              <h4 className="font-bold text-orange-400 text-sm">
                Test Key (pk_test_...)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Unlimited testing. Every PDF will have a large diagonal
                watermark. Does not count against your quota.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <h4 className="font-bold text-blue-400 text-sm">
                Live Key (pk_live_...)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Production usage. Clean PDFs. Usage counts against your plan's
                monthly conversion quota.
              </p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Include your key in the{" "}
            <code className="text-blue-400 font-mono bg-blue-400/5 px-1.5 py-0.5 rounded">
              x-api-key
            </code>{" "}
            header for all requests.
          </p>
          <CodeBlock
            code={`curl -X POST https://api.pdfbridge.xyz/api/v1/convert \\
  -H "x-api-key: pk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
            language="bash"
          />
        </section>

        {/* Convert PDF */}
        <section id="convert" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <FileCode className="text-emerald-500" /> Convert PDF
          </h2>
          <p className="text-slate-400">
            Convert a public URL or raw HTML string into a PDF document. This
            operation is asynchronous and returns a{" "}
            <code className="text-blue-400 font-mono">jobId</code>.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-bold">
                POST
              </span>
              <span className="text-slate-200">/convert</span>
            </div>
            <CodeBlock
              code={`{
  "url": "https://stripe.com",
  "filename": "monthly_invoice_january",
  "webhookUrl": "https://your-app.com/api/webhooks/pdf",
  "options": {
    "format": "A4",
    "printBackground": true,
    "displayHeaderFooter": true,
    "headerTemplate": "<div style='font-size: 10px;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>",
    "margin": { "top": "1in", "bottom": "1in" }
  },
  "metadata": { "user_id": "usr_789" },
  "tailwind": true,
  "extractMetadata": true
}`}
              language="json"
            />
          </div>
        </section>

        {/* Bulk Conversion */}
        <section id="bulk" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Cpu className="text-amber-500" /> Bulk Conversion
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Process up to 50 conversions in a single request. Highly efficient
            for generating large sets of documents like monthly invoices.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20 font-bold">
                POST
              </span>
              <span className="text-slate-200">/convert/bulk</span>
            </div>
            <CodeBlock
              code={`{
  "jobs": [
    { "url": "https://site.com/doc1", "filename": "doc1" },
    { "url": "https://site.com/doc2", "filename": "doc2" }
  ]
}`}
              language="json"
            />
          </div>
        </section>

        {/* Options Reference */}
        <section id="options" className="scroll-mt-24 space-y-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Layout className="text-indigo-500" /> Options Reference
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <GlowCard
              title="Page Formats"
              sub="Available: A4, Letter, Legal, Tabloid, Ledger, A3"
              content={
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Standardized Chromium paper sizes. Default is A4.
                </p>
              }
            />
            <GlowCard
              title="Custom Margins"
              sub="Supports inches (in), pixels (px), or cm"
              content={
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Define top, bottom, left, and right individually.
                </p>
              }
            />
            <GlowCard
              title="Header & Footer"
              sub="HTML Templates & Placeholders"
              content={
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Set{" "}
                    <code className="text-blue-400">
                      displayHeaderFooter: true
                    </code>
                    . Use these classes for dynamic data:
                  </p>
                  <ul className="text-[10px] text-slate-400 space-y-1 ml-2">
                    <li>
                      • <code className="text-emerald-400">pageNumber</code>:
                      Current page
                    </li>
                    <li>
                      • <code className="text-emerald-400">totalPages</code>:
                      Total pages
                    </li>
                    <li>
                      • <code className="text-emerald-400">date</code>: Current
                      date
                    </li>
                    <li>
                      • <code className="text-emerald-400">title</code>:
                      Document title
                    </li>
                  </ul>
                </div>
              }
            />
            <GlowCard
              title="Dimensions & Viewport"
              sub="width, height, deviceScaleFactor"
              content={
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Provide <code className="text-blue-400">width</code> or{" "}
                  <code className="text-blue-400">height</code> in pixels to
                  override standard paper sizes and control the rendering
                  viewport.
                </p>
              }
            />
          </div>
        </section>

        {/* Tailwind-Native */}
        <section id="tailwind" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Code2 className="text-blue-400" /> Tailwind-Native
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge features native support for Tailwind CSS. You can use any
            utility classes directly in your HTML payloads without manually
            linking stylesheets or configuring complex build pipelines.
          </p>

          <GlowCard
            title="How it Works"
            sub="Automatic JIT Injection"
            icon={<Info className="h-5 w-5 text-blue-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400">
                <p>
                  When you set{" "}
                  <code className="text-blue-400 font-mono">
                    tailwind: true
                  </code>{" "}
                  in your request:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    The engine automatically injects the Tailwind Play CDN
                    script.
                  </li>
                  <li>
                    The generator waits until the JIT compiler has fully
                    rendered your styles before taking the snapshot.
                  </li>
                  <li>You get a pixel-perfect Tailwind PDF every time.</li>
                </ol>
              </div>
            }
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Example Payload</h4>
            <CodeBlock
              code={`{
  "html": "<div class='bg-blue-600 p-12 text-white text-center rounded-3xl shadow-2xl'>
    <h1 class='text-4xl font-black mb-4'>Tailwind-Native</h1>
    <p class='text-blue-100'>No setup. No hacks. Just CSS utilities.</p>
  </div>",
  "tailwind": true
}`}
              language="json"
            />
          </div>
        </section>

        {/* AI Metadata */}
        <section id="ai" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Cpu className="text-purple-400" /> AI Metadata Layer
          </h2>
          <p className="text-slate-400 leading-relaxed">
            PDFBridge uses <strong>Gemini 1.5 Flash</strong> to automatically
            analyze and extract structured JSON data from your generated PDFs.
            Perfect for auto-tagging, data entry automation, and content
            summarization.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <h4 className="font-bold text-white text-xs mb-1">Doc Types</h4>
              <p className="text-[10px] text-slate-500">
                Invoices, Receipts, Reports, CVs, and more.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <h4 className="font-bold text-white text-xs mb-1">Entities</h4>
              <p className="text-[10px] text-slate-500">
                Totals, Dates, Companies, and Names.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/5">
              <h4 className="font-bold text-white text-xs mb-1">Summaries</h4>
              <p className="text-[10px] text-slate-500">
                Automated 1-2 sentence content insights.
              </p>
            </div>
          </div>

          <GlowCard
            title="Pricing & Restrictions"
            sub="Paid Tiers Only"
            icon={<Info className="h-5 w-5 text-purple-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400">
                <p>
                  AI Metadata extraction is exclusive to our{" "}
                  <strong>Paid Plans</strong> (Starter, Pro, Enterprise).
                </p>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs">
                  <strong>Sandbox Mode:</strong> This feature is disabled when
                  using Test Keys (`pk_test_...`) to prevent quota abuse.
                </div>
              </div>
            }
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">
              Example AI Response
            </h4>
            <CodeBlock
              code={`{
  "documentType": "invoice",
  "total": 540.50,
  "currency": "USD",
  "summary": "Monthly subscription invoice for cloud services.",
  "tags": ["financial", "cloud", "saas"]
}`}
              language="json"
            />
          </div>
        </section>

        {/* n8n Integration */}
        <section id="n8n" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Webhook className="text-orange-500" /> n8n Integration
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Connect PDFBridge to 400+ applications using our custom n8n node.
            Automate your document generation workflows without writing code.
          </p>

          <GlowCard
            title="Professional Automation"
            sub="No-Code Document Workflows"
            icon={<Info className="h-5 w-5 text-orange-400" />}
            content={
              <div className="space-y-4 mt-4 text-sm text-slate-400 leading-relaxed">
                <p>
                  Our <strong>n8n Community Node</strong> allows you to
                  integrate PDFBridge directly into your automated pipelines.
                  Whether you're generating invoices from a database or
                  summaries from web scrapers, the n8n node provides a visual
                  interface for configuring every aspect of the conversion.
                </p>
                <p>
                  The node supports all core API features, including
                  Tailwind-Native rendering, AI Metadata extraction, and custom
                  formatting options, making it the ideal choice for
                  enterprise-grade automation.
                </p>
              </div>
            }
          />

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">How to use it:</h4>
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  1
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">Install Node</h5>
                  <p className="text-xs text-slate-500 mt-1">
                    In your n8n settings, go to "Community Nodes" and install:
                    <br />
                    <code className="text-emerald-400 font-mono">
                      n8n-nodes-pdfbridge
                    </code>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  2
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">
                    Add Your Secret Key
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Copy your API Key from the dashboard and paste it into the
                    node's credentials.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  3
                </div>
                <div>
                  <h5 className="text-white font-bold text-sm">
                    Start Printing!
                  </h5>
                  <p className="text-xs text-slate-500 mt-1">
                    Drag the PDFBridge node into your workflow, give it a URL,
                    and watch the magic happen!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Webhooks */}
        <section id="webhooks" className="scroll-mt-24 space-y-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-4">
            <Webhook className="text-purple-500" /> Webhooks
          </h2>
          <p className="text-slate-400">
            Set a <code className="text-purple-400">webhookUrl</code> in your
            request to receive a POST callback when document generation is
            finished or if it fails.
          </p>
          <CodeBlock
            code={`{
  "event": "pdf.generated",
  "jobId": "4ce4fc3a-2865-4404-933c-22da12f19679",
  "status": "completed",
  "url": "https://storage.pdfbridge.xyz/pdfs/..."
}`}
            language="json"
          />
          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-6 space-y-3">
            <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Retry Policy
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If your endpoint fails (non-2xx response), we will retry with
              exponential backoff (1m, 2m, 4m, 8m, 16m) before marking the
              webhook as failed.
            </p>
          </div>
        </section>
      </main>
    </div>
  );

  if (noContainer) return content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {content}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-4 top-4 z-20 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
      >
        {copied ? "Copied!" : <Terminal className="h-4 w-4" />}
      </button>
      <Highlight theme={themes.vsDark} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm overflow-auto text-sm leading-relaxed`}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
