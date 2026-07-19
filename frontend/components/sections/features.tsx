import { Sparkles, Layers, BarChart3, Bot } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Let AI analyze your product data and surface actionable recommendations in real time.",
  },
  {
    icon: Layers,
    title: "Smart Inventory",
    desc: "Track, categorize, and manage your product catalog with intelligent sorting and bulk operations.",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    desc: "Visualize trends, forecast demand, and make data-driven decisions with interactive charts.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    desc: "Chat with your data. Ask questions, get answers, and automate repetitive workflows instantly.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Everything you need to manage products
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Powerful tools that work together to streamline your workflow.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 transition-colors group-hover:bg-indigo-200">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{feature.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
