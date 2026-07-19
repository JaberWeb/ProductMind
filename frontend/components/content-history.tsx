"use client";

import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

interface HistoryEntry {
  type: string;
  content: string;
  createdAt: string;
}

interface ContentHistoryProps {
  history: HistoryEntry[];
  loading: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  short_description: "Short Description",
  seo: "SEO Copy",
  social: "Social Post",
};

export function ContentHistory({ history, loading }: ContentHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  if (history.length === 0) return null;

  const grouped = history.reduce<Record<string, HistoryEntry[]>>((acc, entry) => {
    if (!acc[entry.type]) acc[entry.type] = [];
    acc[entry.type].push(entry);
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Clock size={16} className="text-slate-400" />
          History ({history.length})
        </div>
        {expanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 py-3">
          {Object.entries(grouped).map(([type, entries]) => (
            <div key={type} className="mb-4 last:mb-0">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {TYPE_LABELS[type] || type}
              </h4>
              <div className="space-y-2">
                {entries.map((entry, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="mb-1 line-clamp-2 text-sm text-slate-700">{entry.content}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
