import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Manager",
    company: "StyleHub",
    avatar: "SC",
    quote: "ProductMind cut our product listing time by 60%. The AI content generation is eerily good — it understands our brand voice perfectly.",
  },
  {
    name: "Marcus Rivera",
    role: "Operations Lead",
    company: "TechGear",
    avatar: "MR",
    quote: "We manage 15,000+ SKUs across 4 platforms. ProductMind's analytics saved us from overstocking slow movers — saved $50K in Q3 alone.",
  },
  {
    name: "Priya Patel",
    role: "Founder",
    company: "ArtisanMarket",
    avatar: "PP",
    quote: "Finally, a tool that speaks small business. The AI assistant feels like having a data analyst on staff without the six-figure salary.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Loved by product teams
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            See what our users say about ProductMind.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Quote className="mb-3 h-6 w-6 text-indigo-200" />
              <blockquote className="text-sm leading-relaxed text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
