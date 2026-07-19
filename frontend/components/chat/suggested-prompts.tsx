"use client";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  "What are my top-selling products?",
  "How is my revenue trending this month?",
  "Which categories perform best?",
  "Show me my recent orders",
  "What products need better pricing?",
  "Compare my sales across platforms",
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
