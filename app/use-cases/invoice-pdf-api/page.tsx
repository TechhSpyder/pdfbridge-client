import { Metadata } from "next";
import Link from "next/link";
import { FileText, Zap, ShieldCheck, CheckCircle2, ArrowRight, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Invoice PDF API | Generate Invoices from HTML | PDFBridge",
  description:
    "Automate your billing cycle. Generate pixel-perfect, branded invoice PDFs directly from HTML/CSS or web URLs using our highly reliable Chromium API.",
  keywords: [
    "invoice pdf api",
    "generate invoice from html",
    "html to pdf invoice",
    "automate invoice generation",
    "receipt pdf api"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/use-cases/invoice-pdf-api",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Invoice PDF Generation API",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  description: "A developer API for automatically generating pixel-perfect invoice and billing PDFs from HTML templates or URLs.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "89"
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Marcus V."
      },
      reviewBody: "Perfect for high-volume billing. The zero-shot extraction is spooky accurate."
    }
  ]
};

export default function InvoicePdfApiPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero */}
      <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
          <FileText size={16} /> Fintech & Billing
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
          The Invoice PDF API. <br />
          <span className="text-emerald-500">Built for Scale.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
          Stop managing headless browsers for your billing system. Generate pixel-perfect, branded <strong className="text-white">invoice PDFs</strong> from any HTML template or dashboard URL in milliseconds.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2">
              Start Automating Free <ArrowRight size={18} />
            </Link>
            <Link href="/docs" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2">
              Read Developer Docs <Terminal size={16} />
            </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
               <Zap className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Tailwind & CSS Grids</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Design beautiful invoices using modern CSS frameworks. Our V8 Chromium engine renders flexbox and grids flawlessly.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
               <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Zero Data Retention</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">For strict compliance, enable Ghost Mode. We process the HTML invoice entirely in memory and permanently destroy the buffer post-response.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
               <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Pagination & Print CSS</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Automatically break long invoices across multiple pages with repeated table headers using standard @media print CSS rules.</p>
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
                <span className="text-xs font-mono text-slate-500 uppercase">billing_service.js</span>
             </div>
             <pre className="text-sm font-mono text-emerald-200 overflow-x-auto leading-loose">
               <code>{`// A Node.js example for generating an Invoice PDF
import PDFBridge from "@techhspyder/pdfbridge-node";

// Initializes using process.env.PDFBRIDGE_API_KEY under the hood
const pdfBridge = new PDFBridge();

// .generateAndWait() handles the status-polling pipeline automatically
const job = await pdfBridge.generateAndWait({
    url: "https://your-app.com/invoices/INV-9902",
    options: {
      format: "A4",
      printBackground: true,
      scale: 0.95,
      marginTop: "1cm",
      marginBottom: "1cm",
      marginLeft: "1cm",
      marginRight: "1cm"
    }
});

// Returns the final state including the hosted PDF URL
console.log(job.pdfUrl);`}</code>
             </pre>
          </div>
        </div>

        {/* CTA */}
        <div className="p-16 rounded-[3rem] bg-emerald-900/20 border border-emerald-500/20 text-center relative overflow-hidden group max-w-5xl mx-auto">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
           <h2 className="text-4xl font-black mb-6 relative z-10">Scale your billing infrastructure.</h2>
           <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
              Don't let a brittle reporting engine break your payment flows. Integrate the PDFBridge REST API in under 5 minutes.
           </p>
           <div className="flex justify-center relative z-10">
            <Link href="/sign-up" className="px-10 py-5 rounded-2xl bg-white hover:bg-slate-100 text-emerald-950 font-black tracking-wide text-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-3">
              Get Your Free API Key <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
