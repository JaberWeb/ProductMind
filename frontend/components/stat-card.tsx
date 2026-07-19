"use client";

import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
