import Link from "next/link";
import { Book, Info, Terminal, Key, FileCode, Cpu, Users, Webhook } from "lucide-react";
import { GlowCard } from "../../app/glow-card";
import { CodeBlock } from "./CodeBlock";

interface Props {
  copyBaseUrl: () => void;
  copiedBaseUrl: boolean;
}

export function PublicContent({ copyBaseUrl, copiedBaseUrl }: Props) {
  return (
    <>
      <section id="intro" className="scroll-mt-24 space-y-6 text-slate-300 leading-relaxed">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Book className="h-3 w-3" /> Public SDK v1
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Settlement API</h1>
        <p className="text-slate-400">
          PDFBridge&apos;s public API is settlement-first: ledger, deterministic intent compilation,
          governance approvals, and settlement orchestration. Internal/legacy PDF conversion endpoints are not part of the public surface.
        </p>
        <GlowCard
          title="Base URL"
          sub="Production: v1 (Stable)"
          icon={<Info className="h-5 w-5 text-blue-400" />}
          content={
            <div className="space-y-4 mt-4">
              <div className="relative group">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-blue-400 pr-12 break-all">
                  https://api.pdfbridge.xyz/api/v1
                </div>
                <button
                  onClick={copyBaseUrl}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedBaseUrl ? (
                    <span className="text-[10px] font-bold text-emerald-400 px-1">Copied!</span>
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          }
        />
      </section>

      <section id="auth" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Key className="text-blue-500" /> Authentication
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Authenticate using your API key in the{" "}
          <code className="text-blue-400 font-mono bg-blue-400/5 px-1.5 py-0.5 rounded break-all">
            x-api-key
          </code>{" "}
          header. All requests must be made over HTTPS.
        </p>
        <CodeBlock
          code={`curl -H "x-api-key: pk_live_..." https://api.pdfbridge.xyz/api/v1/ledger`}
          language="bash"
        />
      </section>

      <section id="ledger" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <FileCode className="text-emerald-500" /> Ledger
        </h2>
        <p className="text-slate-400 leading-relaxed">
          The Ledger is the source of truth for all financial documents processed by PDFBridge. It maintains an immutable record of document states, from creation to settlement. Use these endpoints to query the state of your financial documents.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Immutable Records</h4>
            <p className="text-xs text-slate-500">
              Once a document is registered in the ledger, its core financial data cannot be altered.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
            <h4 className="font-bold text-white text-sm">Real-time State</h4>
            <p className="text-xs text-slate-500">
              Track transitions from `PENDING` to `SETTLED` deterministically.
            </p>
          </div>
        </div>
        <CodeBlock
          code={`GET /ledger\nGET /ledger/:id`}
          language="bash"
        />
      </section>

      <section id="compiler" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Cpu className="text-indigo-400" /> Compiler
        </h2>
        <p className="text-slate-400 leading-relaxed">
          The Compiler turns raw financial intents into deterministic, verifiable transactions. This is the core workflow for orchestrating settlements.
        </p>
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              1
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">Compile Intent</h5>
              <p className="text-xs text-slate-500 mt-1">
                Submit a document ID to compile a financial intent. This generates a deterministic payload ready for broadcast.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              2
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">Verify Recipient</h5>
              <p className="text-xs text-slate-500 mt-1">
                Ensure the target recipient's wallet and details are valid before proceeding.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              3
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">Broadcast</h5>
              <p className="text-xs text-slate-500 mt-1">
                After approvals are met, broadcast the intent to execute the settlement on-chain.
              </p>
            </div>
          </div>
        </div>
        <CodeBlock
          code={`POST /compiler/compile-intent\nGET /compiler/intent/:documentId\nPOST /compiler/intent/:id/broadcast\nGET /compiler/intent/:documentId/reconcile\nPOST /compiler/verify-recipient\nPATCH /compiler/intent/:id/category`}
          language="bash"
        />
      </section>

      <section id="approvals" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Users className="text-violet-400" /> Approvals
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Governance is enforced through the Approvals system. Organizations can require specific approvals before a compiled intent can be broadcasted. Use these endpoints to track and manage pending authorizations.
        </p>
        <GlowCard
          title="Multi-Sig Governance"
          sub="Policy-Driven Approvals"
          icon={<Info className="h-5 w-5 text-violet-400" />}
          content={
            <p className="text-sm text-slate-400 mt-2">
              Depending on your organization's policy, transactions may require approval from multiple stakeholders or specific roles before execution. The `authorize` endpoint allows authorized users to sign off.
            </p>
          }
        />
        <CodeBlock
          code={`GET /approvals\nGET /approvals/:intentId/status\nPOST /approvals/:id/authorize\nPOST /approvals/:id/reject`}
          language="bash"
        />
      </section>

      <section id="keys" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Key className="text-blue-500" /> API Keys
        </h2>
        <p className="text-slate-400">Manage your organization's API keys. Keep your secret keys safe and never expose them in client-side code.</p>
        <CodeBlock code={`GET /keys\nPOST /keys\nDELETE /keys/:id`} language="bash" />
      </section>

      <section id="organizations" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Users className="text-slate-300" /> Organizations
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Manage your organization's members, whitelists, and spend limits. You can also define granular approval policies to gate transaction broadcasting.
        </p>
        <CodeBlock
          code={`GET /organizations/:id/members\nPOST /organizations/:id/invites\nDELETE /organizations/:id/members/:targetId\nPATCH /organizations/:id/whitelist\nPATCH /organizations/:id\nPATCH /organizations/:id/members/:userId/spend-limit\nGET /organizations/:id/approval-policy\nPATCH /organizations/:id/approval-policy`}
          language="bash"
        />
      </section>

      <section id="webhook-endpoints" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Webhook className="text-amber-400" /> Webhook Endpoints
        </h2>
        <p className="text-slate-400">Configure endpoints to receive real-time event notifications from PDFBridge.</p>
        <CodeBlock
          code={`GET /webhook-endpoints\nGET /webhook-endpoints/:id\nPOST /webhook-endpoints\nPATCH /webhook-endpoints/:id\nDELETE /webhook-endpoints/:id`}
          language="bash"
        />
      </section>

      <section id="webhook-logs" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Terminal className="text-slate-300" /> Webhook Logs
        </h2>
        <p className="text-slate-400">Audit the delivery of webhooks and retry failed attempts.</p>
        <CodeBlock
          code={`GET /webhook-logs?executionId=...\nGET /webhook-logs/:id\nPOST /webhook-logs/:id/retry`}
          language="bash"
        />
      </section>

      <section id="node-sdk" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Terminal className="text-blue-400" /> Node.js SDK
        </h2>
        <p className="text-slate-400">Install: <code className="text-blue-400 font-mono">npm i @techhspyder/pdfbridge-node</code></p>
      </section>

      <section id="python-sdk" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Terminal className="text-blue-400" /> Python SDK
        </h2>
        <p className="text-slate-400">Install: <code className="text-blue-400 font-mono">pip install pdfbridge-python</code></p>
      </section>
    </>
  );
}
