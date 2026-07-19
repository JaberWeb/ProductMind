"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { LayoutDashboard, Package, BarChart3, Bot, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { fetchDashboardStats, type DashboardStats } from "@/services/dashboard";

const statConfig = [
  { label: "Total Products", key: "totalItems" as const, icon: Package, color: "bg-indigo-100 text-indigo-600", format: (v: number) => v.toLocaleString() },
  { label: "Active Items", key: "activeItems" as const, icon: LayoutDashboard, color: "bg-emerald-100 text-emerald-600", format: (v: number) => v.toLocaleString() },
  { label: "This Month", key: "itemsThisMonth" as const, icon: BarChart3, color: "bg-amber-100 text-amber-700", format: (v: number) => v.toLocaleString() },
  { label: "AI Suggestions", key: "aiSuggestionsCount" as const, icon: Bot, color: "bg-purple-100 text-purple-600", format: (v: number) => v.toLocaleString() },
];

const quickActions = [
  { href: "/add-items", label: "Add Products", desc: "Add new items to your catalog" },
  { href: "/manage-items", label: "Manage Inventory", desc: "Update or remove existing products" },
  { href: "/analytics", label: "View Analytics", desc: "Explore trends and insights" },
  { href: "/ai-assistant", label: "AI Assistant", desc: "Get AI-powered recommendations" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 shadow-sm lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome{session?.user?.name ? `, ${session.user.name}` : ""}!
        </h1>
        <p className="mt-1.5 text-sm text-indigo-200/80">
          Here&apos;s what&apos;s happening with your products today.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Failed to load stats</p>
              <p className="mt-0.5 text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={loadStats}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = stats ? stat.format(stats[stat.key]) : null;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              {loading ? (
                <div className="mt-1 h-7 w-16 animate-shimmer rounded" />
              ) : (
                <p className="mt-0.5 text-2xl font-semibold text-slate-900">{value}</p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {action.label}
                </h3>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="mt-1 text-xs text-slate-500">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
