"use client";

import { Copy, Check, RefreshCw, Save } from "lucide-react";
import { useState } from "react";

interface ContentOutputProps {
  content: string;
  contentType: string;
  onRegenerate: () => void;
  onSave: () => void;
  saving: boolean;
  generating: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  short_description: "Short Description",
  seo: "SEO Copy",
  social: "Social Post",
};

export function ContentOutput({ content, contentType, onRegenerate, onSave, saving, generating }: ContentOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {TYPE_LABELS[contentType] || contentType}
        </span>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
          Generated
        </span>
      </div>

      <div className="mb-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-sm">
        {content}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
          {generating ? "Regenerating..." : "Regenerate"}
        </button>
        <button
          onClick={onSave}
          disabled={saving || !content}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
