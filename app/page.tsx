import {
  Hero,
  HowItWorks,
  SocialProof,
  WhyPdfBridge,
  BuiltForDevelopers,
  Pricing,
  FAQ,
  CTA,
  Footer,
} from "@/modules/home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modern PDF Generation API for Developers",
  description:
    "Generate high-fidelity PDFs from HTML, URLs, and React components. 99.9% Uptime, lightning-fast rendering, and developer-first documentation.",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <SocialProof />
      <WhyPdfBridge />
      <HowItWorks />
      <BuiltForDevelopers />
      {/* <Pricing /> */}
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
