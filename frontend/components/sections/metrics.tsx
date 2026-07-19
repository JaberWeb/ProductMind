"use client";

import { useEffect, useState } from "react";
import { Package, TrendingUp, Users, Globe } from "lucide-react";

const stats = [
  { icon: Package, value: 50, suffix: "K+", label: "Products Managed" },
  { icon: TrendingUp, value: 99, suffix: "%", label: "Uptime" },
  { icon: Users, value: 10, suffix: "K+", label: "Active Users" },
  { icon: Globe, value: 140, suffix: "+", label: "Countries" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function Metrics() {
  return (
    <section className="bg-indigo-600 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Trusted by teams worldwide
          </h2>
          <p className="mt-3 text-sm text-indigo-200">
            ProductMind in numbers.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/40 backdrop-blur-sm">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold tracking-tight text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-sm text-indigo-200">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
