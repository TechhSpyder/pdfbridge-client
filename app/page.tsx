import { Hero, VisualStrip } from "@/modules/home";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const SocialProof = dynamic(() =>
  import("@/modules/home/social-proof").then((mod) => mod.SocialProof),
);
const WhyPdfBridge = dynamic(() =>
  import("@/modules/home/why-pdfbridge").then((mod) => mod.WhyPdfBridge),
);
const HowItWorks = dynamic(() =>
  import("@/modules/home/how-it-works").then((mod) => mod.HowItWorks),
);
const BuiltForDevelopers = dynamic(() =>
  import("@/modules/home/built-for-developers").then((mod) => mod.BuiltForDevelopers),
);
const Pricing = dynamic(() =>
  import("@/modules/home/pricing").then((mod) => mod.Pricing),
);
const FAQ = dynamic(() => import("@/modules/home/faq").then((mod) => mod.FAQ));
const CTA = dynamic(() => import("@/modules/home/cta").then((mod) => mod.CTA));
const Footer = dynamic(() =>
  import("@/modules/home/footer").then((mod) => mod.Footer),
);
const Problem = dynamic(() =>
  import("@/modules/home/problem").then((mod) => mod.Problem),
);
const PuppeteerVs = dynamic(() =>
  import("@/modules/home/puppeteer-vs").then((mod) => mod.PuppeteerVs),
);
const OperationalVisibility = dynamic(() =>
  import("@/modules/home/visibility").then((mod) => mod.OperationalVisibility),
);

export const metadata: Metadata = {
  title: "PDFBridge — Financial Document Processing Infrastructure",
  description:
    "Turn invoices, receipts, and financial documents into validated, structured data instantly. Built for fintechs and finance teams.",
};

import { PublicPlaygroundWrapper as PublicPlayground } from "@/modules/home/hero/PublicPlaygroundWrapper";

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDFBridge",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "description":
    "Financial document processing infrastructure. Extract, Validate, and Normalize financial documents into structured data instantly.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "120"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Jordan Smith"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Unbelievably fast. The React-to-PDF integration saved us weeks of development time."
    }
  ],
  "url": "https://pdfbridge.xyz",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Hero />
      <VisualStrip />
      <div id="playground" className="w-full py-10">
        <PublicPlayground />
      </div>
      <SocialProof />
      <Problem />
      <WhyPdfBridge />
      <HowItWorks />
      <BuiltForDevelopers />
      <PuppeteerVs />
      <OperationalVisibility />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}


