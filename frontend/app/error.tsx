"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="noise flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold tracking-tight text-red-500">500</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
