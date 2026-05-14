import { FileCode, Cpu, Sparkles, Layout, Info } from "lucide-react";
import { GlowCard } from "../../app/glow-card";
import { CodeBlock } from "./CodeBlock";

export function LegacyCoreApi() {
  return (
    <>
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
  "ghostMode": true,
  "options": {
    "format": "A4",
    "printBackground": true
  }
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
        Process up to 1,000 conversions in a single request. Highly efficient
        for generating large sets of documents like monthly invoices.
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

      {/* Dynamic Templates */}
      <section id="templates" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Sparkles className="text-indigo-500" /> Dynamic Templates
        </h2>
        <p className="text-slate-400 leading-relaxed">
          PDFBridge supports dynamic content injection using{" "}
          <strong className="text-white">Handlebars-style</strong> variables.
          You can define placeholders like{" "}
          <code className="text-indigo-400 font-mono">{"{{name}}"}</code> in
          your HTML and provide values at conversion time.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <GlowCard
            title="Variable Syntax"
            sub="Double-curly braces"
            content={
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                Use{" "}
                <code className="text-indigo-400">{"{{variable_name}}"}</code>{" "}
                anywhere in your HTML. Supports dot notation for nested
                objects (e.g.,{" "}
                <code className="text-indigo-400">{"{{user.name}}"}</code>).
              </p>
            }
          />
          <GlowCard
            title="Ad-hoc Usage"
            sub="No template required"
            content={
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                Pass variables directly with your raw HTML. The engine
                automatically detects and merges them before rendering.
              </p>
            }
          />
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">Example Payload</h4>
          <CodeBlock
            code={`{
  "html": "<h1>Hello {{name}}!</h1><p>Invoice #{{inv_id}}</p>",
  "variables": {
    "name": "Jane Doe",
    "inv_id": "99342"
  }
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
              <div className="space-y-2 mt-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Standard Chromium paper sizes. Default is A4.
                </p>
                <p className="text-[10px] text-slate-400">
                  Set <code className="text-indigo-400">landscape: true</code>{" "}
                  or{" "}
                  <code className="text-indigo-400">
                    orientation: 'landscape'
                  </code>{" "}
                  for horizontal layouts.
                </p>
              </div>
            }
          />
          <GlowCard
            title="Custom Dimensions"
            sub="paperWidth, paperHeight, preferCSSPageSize"
            content={
              <div className="space-y-2 mt-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Override standard formats with custom values (numbers in{" "}
                  <strong>mm</strong> or strings like "10in").
                </p>
                <p className="text-[10px] text-slate-400">
                  Use{" "}
                  <code className="text-indigo-400">
                    preferCSSPageSize: true
                  </code>{" "}
                  to respect <code>@page</code> rules in your CSS.
                </p>
              </div>
            }
          />
          <GlowCard
            title="Precise Margins"
            sub="marginTop, marginBottom, marginLeft, marginRight"
            content={
              <div className="space-y-2 mt-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Define margins globally via{" "}
                  <code className="text-indigo-400">margin</code> or use
                  individual overrides for pixel-perfect control.
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports numbers (mm) or strings (e.g., "0.5in", "20px").
                </p>
              </div>
            }
          />
          <GlowCard
            title="Rendering Engine"
            sub="waitDelay, userAgent, width, height"
            content={
              <div className="space-y-2 mt-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tune the generator for complex sites. Default width is{" "}
                  <strong>1440px</strong> for URLs.
                </p>
                <p className="text-[10px] text-slate-400">
                  Use <code className="text-indigo-400">waitDelay: "5s"</code>{" "}
                  to wait for JS hydration or heavy animations.
                </p>
              </div>
            }
          />
          <GlowCard
            className="md:col-span-2"
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
                    • <code className="text-emerald-400">date</code>:
                    Rendering date
                  </li>
                  <li>
                    • <code className="text-emerald-400">title</code>:
                    Document title
                  </li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-2">
                  Set a document title via{" "}
                  <code className="text-indigo-400">
                    options.metadata.title
                  </code>{" "}
                  to enable PDF/A compliance.
                </p>
              </div>
            }
          />
        </div>
      </section>
    </>
  );
}
