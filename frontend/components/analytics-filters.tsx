"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Filter, X } from "lucide-react";

interface AnalyticsFiltersProps {
  categories: string[];
  platforms: string[];
}

export function AnalyticsFilters({ categories, platforms }: AnalyticsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const category = searchParams.get("category") || "";
  const platform = searchParams.get("platform") || "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const hasFilters = dateFrom || dateTo || category || platform;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Filters</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setParam("dateFrom", e.target.value)}
            className="input input-bordered input-sm w-full text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setParam("dateTo", e.target.value)}
            className="input input-bordered input-sm w-full text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
          <select
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
            className="select select-bordered select-sm w-full text-sm"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Platform</label>
          <select
            value={platform}
            onChange={(e) => setParam("platform", e.target.value)}
            className="select select-bordered select-sm w-full text-sm"
          >
            <option value="">All</option>
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
