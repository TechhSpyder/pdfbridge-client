import Link from "next/link";
import { Book, Key, Info, Terminal } from "lucide-react";
import { GlowCard } from "../../app/glow-card";
import { CodeBlock } from "./CodeBlock";

interface Props {
  copyBaseUrl: () => void;
  copiedBaseUrl: boolean;
}

export function LegacyGettingStarted({ copyBaseUrl, copiedBaseUrl }: Props) {
  return (
    <>
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
        <p>
          PDFBridge is a powerful API for developers who need scale, security,
          and precision. All generated PDFs are stored according to your{" "}
          <Link
            href="/dashboard/billing"
            className="text-blue-400 hover:underline"
          >
            plan&apos;s retention policy
          </Link>{" "}
          (ranging from 7 to 30+ days) before being automatically purged,
          unless <span className="font-bold text-white">Ghost Mode</span> is
          used.
        </p>
        <GlowCard
          title="Base URL / API Versioning"
          sub="Production: v1 (Latest)"
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
                    <span className="text-[10px] font-bold text-emerald-400 px-1">
                      Copied!
                    </span>
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                </button>
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
          <code className="text-blue-400 font-mono bg-blue-400/5 px-1.5 py-0.5 rounded break-all">
            x-api-key
          </code>{" "}
          header for all requests.
        </p>
        <CodeBlock
          code={`curl -X POST https://api.pdfbridge.xyz/api/v1/compiler/compile-intent \\
  -H "x-api-key: pk_live_your_key_here" \\
  -F "file=@invoice.pdf"`}
          language="bash"
        />
      </section>

      {/* Usage & Credits */}
      <section id="usage" className="scroll-mt-24 space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-4">
          <Info className="text-blue-500" /> Usage & Credits
        </h2>
        <p className="text-slate-400 leading-relaxed">
          Each conversion job counts towards your plan's monthly credit limit.
          To ensure fair infrastructure usage, credits are calculated based on
          the final PDF file size.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/5 space-y-3">
            <h4 className="font-bold text-white text-sm">Standard Credits</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              1 credit is deducted for any document up to your plan's base
              size limit (e.g., 10MB on Free Tier).
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 space-y-3">
            <h4 className="font-bold text-blue-400 text-sm">
              Dynamic Scaling
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If a document exceeds the base unit, 1 extra credit is deducted
              per additional unit (or part thereof).
            </p>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <h4 className="font-bold text-white text-sm mb-4">
            Calculation Table (Free Tier Example)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead>
                <tr className="bg-white/5 text-slate-300">
                  <th className="px-4 py-3 font-semibold">File Size</th>
                  <th className="px-4 py-3 font-semibold">
                    Credits Deducted
                  </th>
                  <th className="px-4 py-3 font-semibold">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-400">
                <tr>
                  <td className="px-4 py-3">0.5 MB - 10.0 MB</td>
                  <td className="px-4 py-3 text-white font-mono">1</td>
                  <td className="px-4 py-3 italic font-light">Base cost</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">10.1 MB - 20.0 MB</td>
                  <td className="px-4 py-3 text-white font-mono">2</td>
                  <td className="px-4 py-3 font-light">+1 extra credit</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">20.1 MB - 30.0 MB</td>
                  <td className="px-4 py-3 text-white font-mono">3</td>
                  <td className="px-4 py-3 font-light">+2 extra credits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
