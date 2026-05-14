"use client";

import { Key, Terminal } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

export function ApiReferenceContent() {
  return (
    <div className="space-y-24 pb-20">
      <section id="ref-intro" className="scroll-mt-24 space-y-6">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          API Reference
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Public SDK v1 (settlement-first): ledger, compiler, approvals,
          governance, and webhooks. Internal/legacy conversion endpoints are not
          part of this reference.
        </p>
      </section>

      <section id="ref-auth" className="scroll-mt-24 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Key className="text-blue-500 h-6 w-6" /> Authentication
        </h2>
        <p className="text-slate-400">
          Authenticate requests using the{" "}
          <code className="text-blue-400">x-api-key</code> header.
        </p>
        <Highlight
          theme={themes.vsDark}
          code={`curl -H \"x-api-key: pk_live_...\" https://api.pdfbridge.xyz/api/v1/ledger`}
          language="bash"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 rounded-lg bg-black/40 text-xs overflow-x-auto`}
              style={style}
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
      </section>

      <div className="space-y-20">
        <EndpointBlock
          id="ref-ledger"
          method="GET"
          path="/ledger"
          description="List ledger documents for the active organization."
          example={`curl -H \"x-api-key: pk_live_...\" \"https://api.pdfbridge.xyz/api/v1/ledger?page=1&limit=20\"`}
        />

        <EndpointBlock
          id="ref-compile"
          method="POST"
          path="/compiler/compile-intent"
          description="Compile a deterministic execution intent for settlement."
          example={`curl -X POST -H \"x-api-key: pk_live_...\" -H \"Content-Type: application/json\" \\\n  -d '{\"documentId\":\"doc_...\"}' \\\n  https://api.pdfbridge.xyz/api/v1/compiler/compile-intent`}
        />

        <EndpointBlock
          id="ref-approvals"
          method="GET"
          path="/approvals"
          description="List pending governance approvals for the organization."
          example={`curl -H \"x-api-key: pk_live_...\" https://api.pdfbridge.xyz/api/v1/approvals`}
        />

        <EndpointBlock
          id="ref-keys"
          method="GET"
          path="/keys"
          description="List API keys for the current organization."
          example={`curl -H \"x-api-key: pk_live_...\" https://api.pdfbridge.xyz/api/v1/keys`}
        />

        <EndpointBlock
          id="ref-orgs"
          method="GET"
          path="/organizations/:id/members"
          description="List org members and invites."
          example={`curl -H \"x-api-key: pk_live_...\" https://api.pdfbridge.xyz/api/v1/organizations/org_.../members`}
        />

        <EndpointBlock
          id="ref-webhook-endpoints"
          method="GET"
          path="/webhook-endpoints"
          description="Manage webhook destinations (create/update/delete)."
          example={`curl -H \"x-api-key: pk_live_...\" https://api.pdfbridge.xyz/api/v1/webhook-endpoints`}
        />

        <EndpointBlock
          id="ref-webhook-logs"
          method="GET"
          path="/webhook-logs"
          description="Inspect webhook deliveries (supports ?executionId=...)."
          example={`curl -H \"x-api-key: pk_live_...\" \"https://api.pdfbridge.xyz/api/v1/webhook-logs?executionId=doc_or_intent_id\"`}
        />
      </div>
    </div>
  );
}

function EndpointBlock({
  id,
  method,
  path,
  description,
  example,
}: {
  id: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  example: string;
}) {
  const methodStyles: Record<string, string> = {
    GET: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    POST: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    PATCH: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    DELETE: "text-rose-400 border-rose-400/20 bg-rose-400/5",
  };

  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 border rounded-md font-bold text-xs ${methodStyles[method]}`}
        >
          {method}
        </span>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="h-5 w-5 text-slate-500" /> {path}
        </h3>
      </div>
      <p className="text-slate-400">{description}</p>
      <Highlight theme={themes.vsDark} code={example} language="bash">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} p-4 rounded-lg bg-black/40 text-xs overflow-x-auto`}
            style={style}
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
    </section>
  );
}
