import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 px-4 py-24 sm:py-32">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
      }} />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/20 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur-sm">
          <Sparkles size={14} />
          AI-powered product management
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Manage products with
          <span className="block text-indigo-200">the power of AI</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-200/80">
          ProductMind combines smart inventory management with AI-driven insights
          to help you make better product decisions, faster.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50"
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-indigo-400/40 px-6 text-sm font-semibold text-white transition-all hover:bg-indigo-600/50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
