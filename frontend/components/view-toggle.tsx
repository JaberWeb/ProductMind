"use client";

import { Table2, Grid3X3 } from "lucide-react";

interface ViewToggleProps {
  view: "table" | "grid";
  onChange: (view: "table" | "grid") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
      <button
        onClick={() => onChange("table")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          view === "table"
            ? "bg-indigo-100 text-indigo-700"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Table2 size={15} />
        Table
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          view === "grid"
            ? "bg-indigo-100 text-indigo-700"
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <Grid3X3 size={15} />
        Grid
      </button>
    </div>
  );
}
