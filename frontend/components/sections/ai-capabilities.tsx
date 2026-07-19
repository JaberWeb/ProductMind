import { Brain, FileText, Search, MessageSquare } from "lucide-react";

const capabilities = [
  {
    icon: FileText,
    title: "Content Generation",
    desc: "Generate product titles, descriptions, short descriptions, and SEO metadata from raw data.",
    example: "Raw: \"Blue running shoes\" → \"Premium Lightweight Blue Running Shoes for Men — Breathable Mesh, Cushioned Sole\"",
  },
  {
    icon: Search,
    title: "Smart Column Mapping",
    desc: "Upload any CSV or XLSX file. AI automatically maps columns to your product fields.",
    example: "Auto-detects \"Prod Name\" → productName, \"Qty\" → quantity, \"Price\" → price",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    desc: "Get natural-language business insights about your product performance and trends.",
    example: "\"Your Electronics category drives 45% of revenue but only 20% of orders — consider bundling with accessories.\"",
  },
  {
    icon: MessageSquare,
    title: "Conversational Assistant",
    desc: "Ask questions about your data in plain English and get instant answers.",
    example: "\"What were my top 3 products last quarter?\" → Instant answer with revenue breakdown.",
  },
];

export function AICapabilities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI capabilities
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Powered by advanced LLMs to supercharge your product workflow.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div key={cap.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">{cap.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{cap.desc}</p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <p className="text-xs italic leading-relaxed text-slate-400">{cap.example}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
