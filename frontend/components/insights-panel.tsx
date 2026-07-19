"use client";

import type { Insight } from "@/services/analytics";
import { InsightCard } from "@/components/insight-card";
import { Bot, RefreshCw, AlertCircle } from "lucide-react";

interface InsightsPanelProps {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 animate-shimmer rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-shimmer rounded" />
              <div className="h-3 w-full animate-shimmer rounded" />
            </div>
            <div className="h-5 w-16 animate-shimmer rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightsPanel({ insights, loading, error, onRefresh }: InsightsPanelProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">AI Insights</h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="btn btn-ghost btn-sm btn-square text-slate-400 hover:text-indigo-600"
          aria-label="Refresh insights"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <Skeleton />
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Bot size={32} className="mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No insights yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Click refresh to generate AI-powered insights from your data.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
