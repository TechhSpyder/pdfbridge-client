import { Metadata } from "next";
import Link from "next/link";
import { Layers, Zap, PenTool, LayoutTemplate, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "React & Next.js to PDF API | Render Tailwind to PDF | PDFBridge",
  description:
    "Convert React components and Next.js pages directly into high-fidelity PDFs. Full support for Tailwind CSS formatting without painful CSS hacks.",
  keywords: [
    "react to pdf",
    "next.js to pdf api",
    "render react components to pdf",
    "tailwind to pdf",
    "html to pdf react js",
    "puppeteer alternative react"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/frameworks/react-to-pdf",
  },
};

export default function ReactToPDFPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center relative z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-widest mb-8">
          <Layers size={16} /> Developer Frameworks
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          React & Next.js to PDF. <br />
          <span className="text-slate-500 font-medium tracking-normal text-4xl">Stop fighting styling engines.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
          Generating PDFs in React is notoriously painful. PDFBridge allows you to pass straight HTML rendered server-side natively from React and Next.js, preserving every Tailwind class.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
            <Zap className="text-cyan-400 mb-4" />
            <h3 className="font-bold mb-2">Modern JS Support</h3>
            <p className="text-sm text-slate-400">We wait for client-side JavaScript to resolve perfectly before triggering the capture.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
            <PenTool className="text-cyan-400 mb-4" />
            <h3 className="font-bold mb-2">Tailwind Native</h3>
            <p className="text-sm text-slate-400">Flexbox, Grids, and absolute positioning work out of the box. No inline-style hacking.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
            <LayoutTemplate className="text-cyan-400 mb-4" />
            <h3 className="font-bold mb-2">React Server Components</h3>
            <p className="text-sm text-slate-400">Pass the output of JSX natively from your Next.js API routes safely into our /convert endpoint.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900 border border-white/5">
            <Layers className="text-cyan-400 mb-4" />
            <h3 className="font-bold mb-2">Custom Fonts</h3>
            <p className="text-sm text-slate-400">Host web fonts like Inter or Roboto; our headless instances load and render them sharply.</p>
          </div>
        </div>

        {/* Example section */}
        <div className="p-12 rounded-3xl bg-slate-900 border border-white/10 text-center relative overflow-hidden">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-cyan-500/10 blur-[100px]" />
           <h2 className="text-3xl font-black mb-6 relative z-10">The Easiest Flow for Frontend Teams</h2>
           <p className="text-slate-400 max-w-2xl mx-auto mb-8 relative z-10">
              Build your invoice template as a standard React component (`&lt;Invoice /&gt;`). Call `renderToString(&lt;Invoice /&gt;)` on the backend. Send the HTML string to PDFBridge. Done.
           </p>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg flex items-center gap-2">
              Start Free Today <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
