import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, FileSearch, Code, LayoutTemplate, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Document Intelligence Overview | PDFBridge",
  description:
    "Discover how PDFBridge uses GenAI to bridge the gap between unstructured PDFs and strict JSON data. Learn about AI extraction, smart templates, and automated OCR.",
  keywords: [
    "ai document parsing",
    "pdf to json extraction",
    "generative ai pdf tools",
    "pdfbridge ai overview",
    "llm document extraction",
    "ai invoice parsing"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/features/ai-overview",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "PDFBridge AI Document Intelligence",
  "description": "An advanced suite of API tools using Large Language Models to extract structured JSON from unstructured PDFs and automatically generate document templates.",
  "brand": {
    "@type": "Brand",
    "name": "PDFBridge"
  },
  "category": "Document Analytics Software",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "USD",
    "lowPrice": "0",
    "highPrice": "199",
    "offerCount": "4"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Core Feature",
      "value": "Zero-shot JSON Data Extraction"
    },
    {
      "@type": "PropertyValue",
      "name": "Core Feature",
      "value": "Generative HTML Templates"
    }
  ]
};

export default function AIOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Inject Structured Product Data for LLMs and Google */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest mb-8">
          <Sparkles size={16} /> Product Capabilities
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          AI Document Intelligence. <br />
          <span className="text-slate-400 font-medium text-4xl mt-4 block">Beyond simple rendering.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
          PDFBridge pairs best-in-class HTML-to-PDF rendering with state-of-the-art LLMs. Parse messy invoices into strict JSON, or prompt our engine to write pixel-perfect Tailwind receipt templates instantly.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        
        {/* Capability 1: Extraction */}
        <section className="mb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mb-6">
               <FileSearch size={24} />
             </div>
             <h2 className="text-3xl font-black mb-4">Zero-Shot PDF Extraction</h2>
             <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Legacy OCR breaks whenever a vendor changes their invoice layout. By passing documents through our AI Extraction endpoint, you define the desired output structure, and we intelligently map visual bounds to your schema.
             </p>
             <ul className="space-y-3 mb-8 text-slate-300">
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Supports scanned and digital PDFs</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Deeply nested arrays and mixed datatypes</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Built-in table and line-item resolution</li>
             </ul>
             <Link href="/features/ai-pdf-extraction" className="text-purple-400 font-bold hover:text-purple-300 flex items-center gap-2 w-max">
               Explore AI Extraction <ArrowRight size={16} />
             </Link>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-tr from-purple-500/20 to-pink-500/20 blur-xl rounded-3xl" />
            <div className="relative h-full rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl overflow-hidden font-mono text-sm text-slate-300">
               <div className="text-slate-500 mb-4 pb-4 border-b border-white/10 flex justify-between">
                 <span>Expected JSON Output</span>
                 <span className="text-emerald-400">200 OK</span>
               </div>
               <pre className="overflow-x-auto text-purple-200">
{`{
  "merchant": "Acme Cloud Services",
  "invoice_date": "2024-03-15",
  "currency": "USD",
  "totals": {
    "subtotal": 1250.50,
    "tax": 100.04,
    "total": 1350.54
  },
  "line_items": [
    {
      "description": "Database Engine - February",
      "quantity": 1,
      "amount": 850.00
    },
    {
      "description": "CDN Bandwidth Overage",
      "quantity": 4,
      "amount": 400.50
    }
  ]
}`}
               </pre>
            </div>
          </div>
        </section>

        {/* Capability 2: Generation */}
        <section className="mb-24 grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row-reverse">
          <div>
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 mb-6">
               <LayoutTemplate size={24} />
             </div>
             <h2 className="text-3xl font-black mb-4">Generative AI Templates</h2>
             <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Don't waste hours writing inline CSS for email chains and document templates. PDFBridge's AI Lab allows you to scaffold complex, stylized Tailwind PDF templates using simple natural language prompts.
             </p>
             <ul className="space-y-3 mb-8 text-slate-300">
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500"/> Iterative code refinement</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500"/> Direct integration with template engine</li>
               <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-500"/> Native React & Tailwind translation</li>
             </ul>
          </div>
          
          <div className="relative group p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
             <div className="flex gap-4 items-start mb-6">
               <div className="w-8 h-8 rounded-md bg-white/10 shrink-0" />
               <div className="bg-slate-800 rounded-2xl p-4 text-sm text-slate-200 rounded-tl-none">
                 Generate an elegant, dark-mode technical invoice for a strict B2B SaaS architecture firm.
               </div>
             </div>
             <div className="flex gap-4 items-start flex-row-reverse">
               <div className="w-8 h-8 rounded-md bg-pink-500/20 shrink-0 flex items-center justify-center"><Code size={16} className="text-pink-400" /></div>
               <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 text-sm text-pink-200 rounded-tr-none w-full font-mono overflow-x-auto whitespace-pre">
{`<div class="bg-gray-900 text-white p-10 font-sans">
  <div class="flex justify-between border-b pb-4">
    <h1 class="text-3xl font-bold">Acme Corp</h1>
    <span class="text-gray-400">#INV-992</span>
  </div>
  <!-- ... generated code ... -->
</div>`}
               </div>
             </div>
          </div>
        </section>

      </main>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 mt-12 mb-12">
        <div className="p-10 rounded-3xl bg-linear-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 text-center">
          <h2 className="text-3xl font-black mb-4">Automate your PDF infrastructure.</h2>
          <p className="text-slate-300 mb-8">Sign up today to test the AI data extraction API and template builder.</p>
          <Link href="/sign-up" className="inline-block px-8 py-4 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors shadow-xl">
             Start Building Free
          </Link>
        </div>
      </section>

    </div>
  );
}
