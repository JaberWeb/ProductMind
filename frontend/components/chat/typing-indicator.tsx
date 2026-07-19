"use client";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
        <span className="text-xs text-slate-500">AI</span>
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
