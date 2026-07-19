"use client";

import type { Insight } from "@/services/analytics";
import { Lightbulb, TrendingUp, AlertTriangle, Zap } from "lucide-react";

const typeConfig = {
  opportunity: { icon: Lightbulb, border: "border-emerald-500" },
  risk: { icon: AlertTriangle, border: "border-red-500" },
  trend: { icon: TrendingUp, border: "border-blue-500" },
  recommendation: { icon: Zap, border: "border-amber-500" },
} as const;

const confidenceStyles = {
  high: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-red-100 text-red-700",
} as const;

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border-l-4 ${config.border} border border-slate-200 bg-white p-5 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <Icon size={16} className="text-slate-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900">{insight.title}</h4>
              {insight.metric && (
                <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                  {insight.metric.label}: {insight.metric.value}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{insight.description}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${confidenceStyles[insight.confidence]}`}
        >
          {insight.confidence}
        </span>
      </div>
    </div>
  );
}
