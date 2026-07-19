import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    desc: "For small teams just getting started.",
    features: ["Up to 500 products", "AI content generation (100/mo)", "Basic analytics", "CSV import", "Email support"],
    cta: "Get started",
    href: "/register",
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    desc: "For growing businesses that need more power.",
    popular: true,
    features: ["Up to 5,000 products", "AI content generation (1,000/mo)", "Advanced analytics & insights", "AI assistant", "All import formats", "Priority support"],
    cta: "Start free trial",
    href: "/register",
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    desc: "For large teams with advanced needs.",
    features: ["Unlimited products", "Unlimited AI generation", "Custom analytics", "Dedicated AI assistant", "API access", "Custom integrations", "24/7 phone support"],
    cta: "Contact sales",
    href: "/contact",
  },
];

export function PricingPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          No hidden fees. No surprises. Scale as you grow.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md ${
              plan.popular ? "border-indigo-400 ring-1 ring-indigo-400" : "border-slate-200"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                Most popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{plan.desc}</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-400">{plan.period}</span>
            </div>
            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={16} className="mt-0.5 shrink-0 text-indigo-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                plan.popular
                  ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
