import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { AICapabilities } from "@/components/sections/ai-capabilities";
import { Metrics } from "@/components/sections/metrics";
import { Testimonials } from "@/components/sections/testimonials";
import { PricingPreview } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";

export default function Home() {
  return (
    <div className="noise">
      <Hero />
      <Features />
      <HowItWorks />
      <AICapabilities />
      <Metrics />
      <Testimonials />
      <PricingPreview />
      <FAQ />
    </div>
  );
}
