import Link from "next/link";

export default function NotFound() {
  return (
    <div className="noise flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold tracking-tight text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
