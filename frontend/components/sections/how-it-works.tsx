import { Upload, Wand2, BarChart3, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Import your data",
    desc: "Upload CSV or Excel files from Shopify, Amazon, or any platform. Our smart mapper auto-detects columns.",
  },
  {
    icon: Wand2,
    title: "Let AI enhance it",
    step: "02",
    desc: "Generate product titles, descriptions, and SEO content with one click. AI optimizes for conversions.",
  },
  {
    icon: BarChart3,
    title: "Analyze performance",
    step: "03",
    desc: "Track revenue trends, category breakdowns, and pricing distribution with rich visual dashboards.",
  },
  {
    icon: Share2,
    title: "Export & share",
    step: "04",
    desc: "Export your enriched catalog or share insights with your team. Seamless integration with your workflow.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Four simple steps to transform your product management.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="absolute left-1/2 top-7 hidden -translate-y-1/2 md:block" style={{ left: "calc(50% + 2.5rem)" }}>
                  {step.step !== "04" && (
                    <svg width="40" height="2" viewBox="0 0 40 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 1H40" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                  )}
                </div>
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {step.step}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
