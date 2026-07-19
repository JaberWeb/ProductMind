"use client";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { BarChart3, Package, DollarSign, ShoppingBag, TrendingUp, Upload } from "lucide-react";
import Link from "next/link";
import { fetchStats, fetchInsights } from "@/services/analytics";
import type { AnalyticsFilters } from "@/services/analytics";
import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { CategoryChart } from "@/components/charts/category-chart";
import { PricingChart } from "@/components/charts/pricing-chart";
import { InsightsPanel } from "@/components/insights-panel";
import { AnalyticsFilters as Filters } from "@/components/analytics-filters";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();

  const filters: AnalyticsFilters = {
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    category: searchParams.get("category") || undefined,
    platform: searchParams.get("platform") || undefined,
  };

  const {
    data: stats,
    isPending: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["analytics-stats", filters],
    queryFn: () => fetchStats(filters),
  });

  const {
    data: insightsData,
    isPending: insightsLoading,
    isError: insightsError,
    error: insightsErrorObj,
    refetch: refetchInsights,
  } = useQuery({
    queryKey: ["analytics-insights", filters],
    queryFn: () => fetchInsights(filters),
    enabled: !!stats,
    retry: false,
  });

  const handleRefreshInsights = useCallback(() => {
    refetchInsights();
  }, [refetchInsights]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const formatNumber = (value: number) => value.toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">
            Visualize your product data and trends.
          </p>
        </div>
      </div>

      <Filters
        categories={stats?.categories || []}
        platforms={stats?.platforms || []}
      />

      {statsLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 h-9 w-9 animate-shimmer rounded-lg" />
              <div className="h-3 w-20 animate-shimmer rounded" />
              <div className="mt-1.5 h-7 w-16 animate-shimmer rounded" />
            </div>
          ))}
        </div>
      ) : statsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          Failed to load analytics data. Please try again.
        </div>
      ) : stats && stats.totalItems === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BarChart3 className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No data yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload product data to see analytics and insights.
          </p>
          <Link
            href="/add-items"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <Upload size={16} />
            Upload Data
          </Link>
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Items"
              value={formatNumber(stats.totalItems)}
              icon={Package}
              color="bg-indigo-100 text-indigo-600"
            />
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              color="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              label="Avg Price"
              value={formatCurrency(stats.avgPrice)}
              icon={ShoppingBag}
              color="bg-amber-100 text-amber-700"
            />
            <StatCard
              label="Items This Month"
              value={formatNumber(stats.itemsThisMonth)}
              icon={TrendingUp}
              color="bg-slate-100 text-slate-600"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Revenue Over Time</h3>
              <RevenueChart data={stats.revenueOverTime} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Items by Category</h3>
              <CategoryChart data={stats.itemsPerCategory} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Pricing Distribution</h3>
              <PricingChart data={stats.pricingDistribution} />
            </div>

            <InsightsPanel
              insights={insightsData?.insights || []}
              loading={insightsLoading}
              error={insightsError ? (insightsErrorObj as Error)?.message || "Failed to generate insights" : null}
              onRefresh={handleRefreshInsights}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
