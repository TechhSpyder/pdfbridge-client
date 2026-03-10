import { Metadata } from "next";
import { ApiReferenceContent } from "@/modules/docs/api-reference-content";
import Link from "next/link";
import { ChevronLeft, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "API Reference | PDFBridge",
  description: "Technical reference for the PDFBridge API, including endpoints, request schemas, and response formats.",
};

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 max-lg:overflow-x-hidden">
      {/* Header with Breadcrumbs */}
      <div className="border-b border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm mb-4 group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Docs
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
               <Terminal className="h-8 w-8" />
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    API <span className="text-blue-500">Reference</span>
                </h1>
                <p className="mt-1 text-slate-400">
                    Version 1.0 (Stable)
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Table of Contents / Sidebar */}
            <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-32 h-fit">
                <nav className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
                    <TocLink href="#ref-intro" title="Introduction" />
                    <TocLink href="#ref-auth" title="Authentication" />
                    
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-8">Endpoints</p>
                    <TocLink href="#ref-convert" title="POST /convert" method="POST" />
                    <TocLink href="#ref-extract" title="POST /extract" method="POST" />
                    <TocLink href="#ref-polling" title="GET /jobs/:id" method="GET" />
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 min-w-0">
                <ApiReferenceContent />
            </main>
        </div>
      </div>
    </div>
  );
}

function TocLink({ href, title, method }: { href: string; title: string, method?: string }) {
    return (
        <a 
            href={href}
            className="group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
            <span className="truncate">{title}</span>
            {method && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    method === 'POST' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' : 'text-blue-400 border-blue-400/20 bg-blue-400/5'
                }`}>
                    {method}
                </span>
            )}
        </a>
    )
}
