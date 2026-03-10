import { Metadata } from "next";
import Link from "next/link";
import { BrainCircuit, Code, Database, FileDigit, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI PDF Extraction API | Parse Unstructured PDFs to JSON | PDFBridge",
  description:
    "Transform messy, unstructured PDFs into clean, predictable JSON using our AI PDF Extraction API. Built for developers handling invoices, receipts, and forms.",
  keywords: [
    "ai pdf extraction api", "parse pdf to json", "llm pdf parsing", 
    "extract data from pdf api", "ocr and ai extraction", "pdf data extraction tool",
    "unstructured pdf to structured data"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/features/ai-pdf-extraction",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Best AI PDF Extraction API for Developers",
  "description": "Learn how PDFBridge turns unstructured PDFs directly into structured JSON objects using state-of-the-art LLMs.",
  "author": {
    "@type": "Organization",
    "name": "PDFBridge"
  }
};

export default function AIPDFExtractionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      
      {/* Hero */}
      <header className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
          <BrainCircuit size={16} /> Native AI Integration
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
          AI PDF Extraction API. <br />
          <span className="text-slate-400 font-medium">Unstructured PDFs to Clean JSON.</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
          Stop writing brittle Regex parsers for every new vendor invoice. Pass a PDF to the PDFBridge API, provide a prompt, and get back predictable, deeply nested JSON data using our native LLM integration.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold transition-all shadow-xl flex items-center gap-2">
              Get an API Key <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold transition-all">
              Try Interactive Playground
            </Link>
          </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <Database className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Any Layout, Any Format</h3>
            <p className="text-slate-400 leading-relaxed">Vendors change invoice layouts constantly. Traditional OCR tools break the moment a table moves 10 pixels. AI extraction understands context so it never breaks.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <Code className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Strict JSON Schemas</h3>
            <p className="text-slate-400 leading-relaxed">Don't just get a wall of text back. Define exactly the JSON keys you want (e.g., `total_amount`, `merchant_name`, `line_items`), and the endpoint returns perfect datatypes.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900 border border-white/5">
            <FileDigit className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Two-way Street</h3>
            <p className="text-slate-400 leading-relaxed">PDFBridge is unique: you can generate PDFs rapidly, but you can also parse external PDFs fed into the API using the exact same authentication pipeline.</p>
          </div>
        </div>

        {/* Code Example */}
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
          <div className="relative h-full rounded-3xl bg-slate-950 border border-white/10 p-6 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
               <div className="w-3 h-3 rounded-full bg-red-500" />
               <div className="w-3 h-3 rounded-full bg-yellow-500" />
               <div className="w-3 h-3 rounded-full bg-green-500" />
               <span className="ml-4 text-xs font-mono text-slate-500">cURL Example</span>
            </div>
            <pre className="flex-1 text-sm font-mono text-slate-300 overflow-x-auto">
              <code>{`curl -X POST https://api.pdfbridge.xyz/v1/extract \\
  -H "Authorization: Bearer pb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "file_url": "https://example.com/invoice-602.pdf",
    "prompt": "Extract the merchant name, date, and items.",
    "schema": {
      "merchant": "string",
      "date": "string",
      "items": [{"name": "string", "price": "number"}]
    }
  }'

// RESPONSE
{
  "merchant": "Acme Corp",
  "date": "2024-11-20",
  "items": [
    { "name": "Server Hosting", "price": 149.99 }
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </main>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto mt-24 px-6 text-center">
         <h2 className="text-3xl font-black mb-6">Built for Engineering Velocity</h2>
         <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Skip the painful OCR integrations and massive ML overhead. Plug a single endpoint into your app and extract data instantly.</p>
         <Link href="/docs" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-2">
           Read the Documentation <ArrowRight size={16} />
         </Link>
      </section>
    </div>
  );
}
