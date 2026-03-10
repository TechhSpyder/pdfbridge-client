import { Metadata } from "next";
import Link from "next/link";
import { Layers, Zap, PenTool, LayoutTemplate, ArrowRight, Code2, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Next.js to PDF API | Native App Router & RSC Support | PDFBridge",
  description:
    "Convert Next.js pages and React Server Components directly into high-fidelity PDFs. Optimize your Next.js 15+ architecture with native Tailwind CSS rendering and zero headless browser overhead.",
  keywords: [
    "nextjs to pdf",
    "next js pdf generation 2026",
    "next.js app router pdf",
    "react server components to pdf",
    "puppeteer alternative nextjs",
    "tailwind to pdf nextjs"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/for/nextjs",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Next.js to PDF by PDFBridge",
  operatingSystem: "Web",
  applicationCategory: "DeveloperApplication",
  description: "An infrastructure API designed to instantly convert Next.js App Router pages and React Server Components into pixel-perfect PDFs.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD"
  }
};

export default function NextJsToPdfPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero */}
      <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-300 text-xs font-black uppercase tracking-widest mb-8">
          <Layers size={16} /> Vercel & Next.js Optimized
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Next.js to PDF. <br />
          <span className="text-slate-300">App Router Ready.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
          Stop struggling with massive Puppeteer bundles in your Serverless functions. PDFBridge is the native, high-performance API for converting <strong className="text-white">Next.js App Router</strong> pages and server components directly into PDFs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-slate-100 hover:bg-white text-slate-900 font-black tracking-wide transition-all shadow-lg shadow-white/10 flex items-center gap-2">
              Start Generating Free <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2">
              View Next.js Documentation <Terminal size={16} />
            </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
               <LayoutTemplate className="text-slate-300" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">React Server Components</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Natively parse the HTML output from RSCs or standard pages directly in your Next.js Route Handlers.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
               <Zap className="text-slate-300" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Serverless Optimized</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">No 50MB Chromium binaries crashing your Vercel edge functions. Just one lightweight REST API call.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
               <PenTool className="text-slate-300" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Tailwind CSS & Fonts</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Since we utilize real headless Chromium, your next/fonts, CSS grids, and Tailwind JIT compiler work flawlessly.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-white/10">
               <Code2 className="text-slate-300" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Protected Routes</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Pass Bearer tokens natively through the API to generate PDFs of dashboards locked behind Clerk or NextAuth.</p>
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
                <span className="text-xs font-mono text-slate-500 uppercase">app/api/pdf/route.ts</span>
             </div>
             <pre className="text-sm font-mono text-slate-300 overflow-x-auto leading-loose">
               <code>{`import { NextResponse } from 'next/server';

export async function POST(req) {
  // Option 1: URL to PDF (Great for static/public Next.js pages)
  const response = await fetch("https://api.pdfbridge.xyz/api/v1/convert", {
    method: "POST",
    headers: {
      "x-api-key": \`\${process.env.PDFBRIDGE_API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: "https://your-nextjs-app.com/invoices/992",
      options: {
        format: "A4",
        printBackground: true,
        waitForNetworkIdle: true // Ensures Next.js hydration finishes
      }
    })
  });

  // Stream the PDF directly back to the client
  return new NextResponse(response.body, {
    headers: { "Content-Type": "application/pdf" }
  });
}`}</code>
             </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="p-16 rounded-[3rem] bg-slate-900/50 border border-white/10 text-center relative overflow-hidden group max-w-5xl mx-auto">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-white/5 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           <h2 className="text-4xl font-black mb-6 relative z-10">The Vercel-Native PDF Engine.</h2>
           <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
              Don't compromise your Next.js architecture just to generate a PDF. Connect PDFBridge and reliably print complex layouts in milliseconds.
           </p>
           <div className="flex justify-center relative z-10">
            <Link href="/sign-up" className="px-10 py-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black tracking-wide text-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-3">
              Get Your Free API Key <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        {/* Legal Disclaimer */}
        <p className="text-xs text-slate-500 text-center pb-8 pt-16 mt-32 border-t border-white/5">
            Disclaimer: Next.js and Vercel are registered trademarks of Vercel Inc. PDFBridge is an independent infrastructure provider and is not affiliated with, endorsed by, or sponsored by Vercel. Information reflects best practices as of 2026.
        </p>

      </main>
    </div>
  );
}
