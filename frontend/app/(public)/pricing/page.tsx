import { PricingPreview } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";

export default function PricingPage() {
  return (
    <div className="noise">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-900 px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing</h1>
        <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
          Choose the plan that fits your team. Upgrade or downgrade anytime.
        </p>
      </section>
      <PricingPreview />
      <FAQ />
    </div>
  );
}
