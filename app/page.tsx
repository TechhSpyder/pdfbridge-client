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
