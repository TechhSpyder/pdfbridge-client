import { Metadata } from "next";
import Link from "next/link";
import { ReceiptText, Printer, Lock, CheckCircle2, ArrowRight, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Receipt PDF API | HTML to Digital Receipts | PDFBridge",
  description:
    "Generate instant, branded digital receipts from HTML. A highly optimized API for point-of-sale systems, e-commerce, and SaaS platforms.",
  keywords: [
    "receipt pdf api",
    "generate receipt from html",
    "html to pdf receipt",
    "pos receipt generator api",
    "digital receipt api"
  ],
  alternates: {
    canonical: "https://pdfbridge.xyz/use-cases/receipt-pdf-api",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Receipt PDF Generation API",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  description: "A fast, scalable API for e-commerce and POS developers to instantly generate digital PDF receipts directly from HTML payloads.",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "42"
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Sarah Chen"
      },
      reviewBody: "Seamless integration with our POS system. Digital receipts are delivered in milliseconds."
    }
  ]
};

export default function ReceiptPdfApiPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Hero */}
      <header className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
          <ReceiptText size={16} /> E-Commerce & POS
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] bg-linear-to-b from-white to-slate-400 bg-clip-text text-transparent">
          The Receipt PDF API. <br />
          <span className="text-blue-500">Milli-second generation.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
          Whether you are building a SaaS or a Point-of-Sale (POS) terminal, your customers expect instant digital receipts post-checkout. Generate them dynamically from <strong className="text-white">raw HTML</strong> with PDFBridge.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/sign-up" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              Get Your Sandbox Key <ArrowRight size={18} />
            </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 mb-32">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
               <Printer className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Thermal Paper Sizes</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Provide custom dimensions (e.g., 80mm roll width) in the API request settings. Render receipts perfectly sized for Bluetooth thermal printers.</p>
          </div>
          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
               <CheckCircle2 className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Barcode & QR Codes</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Because we use standard Chromium, JavaScript-based QR Code and SVG barcode libraries render perfectly on the final document.</p>
          </div>
          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
               <Lock className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">PCI Scope Separation</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">Send the redacted, masked receipt HTML to PDFBridge. Our stateless infrastructure deletes the file from RAM instantly, keeping you compliant.</p>
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
                <span className="text-xs font-mono text-slate-500 uppercase">express_checkout.js</span>
             </div>
             <pre className="text-sm font-mono text-blue-200 overflow-x-auto leading-loose">
               <code>{`// Example: Raw HTML String to Receipt PDF
import PDFBridge from "@techhspyder/pdfbridge-node";

const pdfBridge = new PDFBridge();

const stripeReceiptHtml = \`
  <h1>Order #1092</h1>
  <p>Amount Paid: $24.00</p>
  ...
\`;

// In Ghost Mode, the binary buffer is returned directly. 
// No data is saved to disk.
const pdfBuffer = await pdfBridge.generate({
    html: stripeReceiptHtml,
    ghostMode: true,
    options: {
      width: "3.14in", // 80mm thermal receipt
      height: "7in", 
      printBackground: true,
      marginTop: "0",
      marginBottom: "0",
      marginLeft: "0",
      marginRight: "0"
    }
});`}</code>
             </pre>
          </div>
        </div>

      </main>
    </div>
  );
}
