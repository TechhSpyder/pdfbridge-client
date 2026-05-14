import Link from "next/link";
import { Code2, Cpu, Info, Terminal } from "lucide-react";
import { GlowCard } from "../../app/glow-card";
import { CodeBlock } from "./CodeBlock";

export function LegacyAdvancedFeatures() {
  return (
    <>
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

      {/* Intelligent Extraction */}
      <section id="ai" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Cpu className="text-purple-400" /> Intelligent Extraction
        </h2>
        <p className="text-slate-400 leading-relaxed">
          PDFBridge features a high-performance extraction engine designed for 
          <strong>Financial Document Automation</strong>. Use the specialized 
          <code className="text-blue-400">/extract</code> endpoint to upload 
          existing PDF invoices and receive strict, typed JSON in seconds.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <GlowCard
            title="Bill To & Vendor Recognition"
            sub="Zero Hallucination"
            content={
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                Our model is fine-tuned to distinguish between the party issuing the invoice 
                and the "Bill To" party, preventing metadata mismatches.
              </p>
            }
          />
          <GlowCard
            title="Direct Pipeline"
            sub="Faster & More Secure"
            content={
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                Uploading PDFs directly to <code className="text-blue-300">/extract</code> 
                is 5x faster than rendering via headless browser.
              </p>
            }
          />
        </div>

        <div className="space-y-4">
           <h4 className="font-bold text-white text-sm">Example Workflow (cURL)</h4>
           <CodeBlock 
              code={`curl -X POST https://api.pdfbridge.xyz/api/v1/extract \\
  -H "x-api-key: pk_live_..." \\
  -F "file=@invoice.pdf"`}
              language="bash"
           />
        </div>
      </section>

      {/* Job Polling Flow */}
      <section id="jobs" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Info className="text-blue-500" /> Job Polling Flow
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Since PDF generation and AI extraction are complex asynchronous tasks, the API 
          immediately returns a <code className="text-blue-400">jobId</code>. You should 
          poll for the final result or rely on <Link href="#webhooks" className="text-blue-400 hover:underline">Webhooks</Link>.
        </p>

        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">Polling Example</h4>
          <CodeBlock 
              code={`// Poll every 1-2 seconds until status is SUCCESS
const response = await fetch("https://api.pdfbridge.xyz/api/v1/jobs/JOB_ID", {
  headers: { "x-api-key": "..." }
});
const job = await response.json();

if (job.status === "SUCCESS") {
  console.log("Extraction Results:", job.result.aiMetadata);
}`}
              language="javascript"
          />
        </div>
      </section>

      {/* Ghost Mode */}
      <section id="ghost" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Info className="text-blue-400" /> Ghost Mode (Privacy-First)
        </h2>
        <p className="text-slate-400 leading-relaxed">
          For sensitive documents, enable <strong>Ghost Mode</strong> by
          passing{" "}
          <code className="text-blue-400 font-mono">"ghostMode": true</code>.
          The PDF will be generated, streamed to your webhook, and{" "}
          <strong>instantly deleted</strong> from our processing
          infrastructure.
        </p>

        <GlowCard
          title="Pricing & Tier Gating"
          sub="Pro & Enterprise Only"
          icon={<Info className="h-5 w-5 text-blue-400" />}
          content={
            <div className="space-y-4 mt-4 text-sm text-slate-400">
              <p>
                Ghost Mode is exclusive to our <strong>Pro</strong> and{" "}
                <strong>Enterprise</strong> plans. It is designed for
                high-compliance environments where data must never touch
                persistent storage.
              </p>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                <strong>Zero-Storage Guarantee:</strong> When Ghost Mode is
                enabled, no records are stored in S3, and retention is set to
                0 days.
              </div>
            </div>
          }
        />
        <GlowCard
          title="Compliance & Security"
          sub="Zero-Storage Policy"
          icon={<Info className="h-5 w-5 text-blue-400" />}
          content={
            <div className="space-y-2 mt-2 text-sm text-slate-400">
              <p>When Ghost Mode is enabled:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>S3 storage is bypassed completely.</li>
                <li>Retention days are set to 0.</li>
                <li>
                  Regeneration is unavailable (since the source HTML is not
                  stored).
                </li>
              </ul>
            </div>
          }
        />
      </section>
    </>
  );
}
