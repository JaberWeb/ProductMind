import { Target, Eye, Heart, Shield } from "lucide-react";

const values = [
  { icon: Target, title: "Mission", desc: "Empower every product manager with AI tools that transform raw data into actionable insights, saving hours of manual work each week." },
  { icon: Eye, title: "Vision", desc: "A world where every product decision is data-informed, AI-enhanced, and human-centered — making product management effortless and impactful." },
  { icon: Heart, title: "Values", desc: "We believe in transparency, continuous improvement, and putting the user first. Our platform is built with care for the people who use it every day." },
  { icon: Shield, title: "Trust", desc: "Your data is yours. We prioritize security, privacy, and reliability above all else, with enterprise-grade encryption and compliance standards." },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-Founder", avatar: "AR" },
  { name: "Jordan Kim", role: "CTO & Co-Founder", avatar: "JK" },
  { name: "Taylor Reed", role: "Head of Product", avatar: "TR" },
  { name: "Morgan Chen", role: "Lead Engineer", avatar: "MC" },
];

export default function AboutPage() {
  return (
    <div className="noise">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-900 px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About ProductMind</h1>
        <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
          We&apos;re on a mission to make product management smarter, faster, and more human.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Meet the team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
                  {m.avatar}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
