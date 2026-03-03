import { Metadata } from "next";
import Link from "next/link";
import { Layers, Zap, PenTool, LayoutTemplate, ArrowRight, Code2, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "React to PDF API | Render Tailwind to PDF (2026 Guide) | PDFBridge",
  description:
    "Convert modern React components directly into high-fidelity PDFs. Full support for Tailwind CSS formatting without painful inline CSS hacks or external headless browsers.",
  keywords: [
    "react to pdf",
    "render react components to pdf",
    "tailwind to pdf",
    "html to pdf react js",
    "puppeteer alternative react"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/frameworks/react-to-pdf", // Kept original URL path for routing simplicity
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "React to PDF by PDFBridge",
  operatingSystem: "Web",
  applicationCategory: "DeveloperApplication",
  description: "An API specifically optimized to convert complex React components styled with Tailwind CSS into pixel-perfect PDF documents.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD"
  }
};

export default function ReactToPDFPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero */}
      <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest mb-8">
          <Layers size={16} /> Framework Optimized
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
          React to PDF. <br />
          <span className="text-cyan-500">Solved for 2026.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
          Generating PDFs in React is historically painful. PDFBridge allows you to pass standard HTML rendered natively from React, perfectly preserving your <strong className="text-white">Tailwind classes</strong>, flexbox layouts, and custom web fonts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2">
              Start Generating Free <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2">
              View React Documentation <Terminal size={16} />
            </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
               <Zap className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Modern JS Support</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">PDFBridge waits for your client-side React hydration to resolve perfectly before triggering the V8 Chromium capture.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
               <PenTool className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Tailwind Native</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Flexbox, CSS Grids, and absolute positioning work out of the box. Stop writing hacky inline styles.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
               <LayoutTemplate className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Server Components</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Pass the output of JSX natively from your React Server Components directly to our /convert REST endpoint.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
               <Code2 className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Custom Web Fonts</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Host web fonts like Inter or custom brand fonts; our headless fleet loads and renders them sharply.</p>
          </div>
        </div>

        {/* Code Example */}
        <div className="max-w-4xl mx-auto mb-32">
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
             <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 mix-blend-screen" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 mix-blend-screen" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 mix-blend-screen" />
                </div>
                <span className="text-xs font-mono text-slate-500 uppercase">app/api/invoice/route.ts</span>
             </div>
             <pre className="text-sm font-mono text-cyan-200 overflow-x-auto leading-loose">
               <code>{`import { renderToStaticMarkup } from 'react-dom/server';
import { InvoiceTemplate } from '@/components/invoice';

export async function POST(req) {
  const data = await req.json();
  
  // 1. Render your React component to an HTML string
  const htmlString = renderToStaticMarkup(<InvoiceTemplate data={data} />);

  // 2. Fire it to PDFBridge
  const response = await fetch("https://api.pdfbridge.xyz/api/v1/convert", {
    method: "POST",
    headers: {
      "x-api-key": \`\${process.env.PDFBRIDGE_API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ html: htmlString })
  });

  return new Response(response.body, {
    headers: { "Content-Type": "application/pdf" }
  });
}`}</code>
             </pre>
          </div>
        </div>

        {/* Example section */}
        <div className="p-16 rounded-[3rem] bg-cyan-900/20 border border-cyan-500/20 text-center relative overflow-hidden group max-w-5xl mx-auto">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           <h2 className="text-4xl font-black mb-6 relative z-10">The Easiest Flow for React Teams</h2>
           <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
              Build your invoice template as a standard React component (<code>&lt;Invoice /&gt;</code>). Call <code>renderToStaticMarkup()</code> on the backend. Send the raw string to PDFBridge. Done.
           </p>
           <div className="flex justify-center relative z-10">
            <Link href="/sign-up" className="px-10 py-5 rounded-2xl bg-white hover:bg-slate-100 text-cyan-950 font-black tracking-wide text-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-3">
              Get Your Free API Key <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        <p className="text-xs text-slate-500 text-center pb-8 pt-16 mt-32 border-t border-white/5">
            Disclaimer: React and Next.js are registered trademarks of Meta Platforms, Inc. and Vercel Inc. respectively. PDFBridge is an independent infrastructure provider and is not affiliated with, endorsed by, or sponsored by Meta or Vercel. Information reflects best practices as of 2026.
        </p>

      </main>
    </div>
  );
}
