import { Users, Webhook, Info } from "lucide-react";
import { GlowCard } from "../../app/glow-card";
import { CodeBlock } from "./CodeBlock";

export function LegacyIntegrations() {
  return (
    <>
      {/* Team Management */}
      <section id="team" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Users className="text-blue-400" /> Team Management
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Collaborate with your team seamlessly. Invite members, manage roles,
          and share templates across your organization.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">
              Role-Based Access
            </h4>
            <p className="text-xs text-slate-500">
              Owners have full billing and seat control, while Members can
              create and manage templates.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Shared Resources</h4>
            <p className="text-xs text-slate-500">
              All templates and API keys are shared within the organization,
              ensuring consistent output.
            </p>
          </div>
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
                Tailwind-Native rendering, Intelligent PDF analysis, and
                custom formatting options, making it the ideal choice for
                enterprise-grade automation.
              </p>
            </div>
          }
        />

        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">How to use it:</h4>
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm space-y-4">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
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
  "url": "https://api.pdfbridge.xyz/api/v1/jobs/id/download"
}`}
          language="json"
        />

        <div className="space-y-4">
          <h4 className="font-bold text-white text-sm">
            Cryptographic Verification (HMAC-SHA256)
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every webhook sent by PDFBridge includes an{" "}
            <code className="text-blue-400">X-PDFBridge-Signature</code>{" "}
            header. This allows you to verify that the notification came from
            us and has not been altered in transit.
          </p>
          <CodeBlock
            code={`const crypto = require('crypto');

// The raw body of the POST request
const payload = JSON.stringify(req.body); 
const signature = req.headers['x-pdfbridge-signature'];
const secret = process.env.PDFBRIDGE_WEBHOOK_SECRET;

const hmac = crypto.createHmac('sha256', secret);
const digest = hmac.update(payload).digest('hex');

if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
  console.log("Verified! Process the PDF...");
} else {
  console.error("Invalid signature. Rejecting request.");
}`}
            language="javascript"
          />
        </div>

        <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-6 space-y-3">
          <h4 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
            <Info className="h-4 w-4" /> Webhook Inspector
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Debug your integrations with our built-in{" "}
            <strong>Webhook Inspector</strong>. View delivery logs, response
            bodies, and latency for every attempt directly in the
            <strong> Usage Dashboard</strong>. Note: Webhooks are a paid-tier
            feature.
          </p>
        </div>
      </section>
    </>
  );
}
