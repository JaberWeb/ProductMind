import { Sparkles, Layers, BarChart3, Bot, Upload, FileText, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Bulk Import",
    desc: "Upload CSV or XLSX files from any platform. Our smart mapper auto-detects and maps your columns to our product fields with high accuracy.",
  },
  {
    icon: FileText,
    title: "AI Content Generation",
    desc: "Generate product titles, descriptions, short descriptions, SEO metadata, and social media copy in multiple tones and lengths.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Get natural-language business insights about revenue trends, category performance, pricing optimization, and more.",
  },
  {
    icon: Layers,
    title: "Smart Inventory Management",
    desc: "Organize, filter, search, and manage your product catalog with powerful bulk actions and intelligent sorting.",
  },
  {
    icon: BarChart3,
    title: "Interactive Analytics",
    desc: "Visualize revenue trends, category breakdowns, and pricing distribution with interactive charts and customizable date filters.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    desc: "Chat with your data. Ask questions like 'What were my top products last month?' and get instant, accurate answers.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Enterprise-grade encryption, SOC 2 compliant infrastructure, and automatic backups to keep your data safe.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized for speed. Browse thousands of products, generate content, and run analytics in milliseconds.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="noise">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-900 px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All features</h1>
        <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
          Everything you need to manage, enrich, and analyze your product catalog.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
