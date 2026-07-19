const PROXY = "/api/backend-proxy";

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  platform?: string;
}

export interface StatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface CategoryItem {
  category: string;
  count: number;
}

export interface ProductItem {
  productName: string;
  revenue: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface PricingBucket {
  range: string;
  count: number;
}

export interface StatsResponse {
  totalItems: number;
  totalRevenue: number;
  avgPrice: number;
  itemsThisMonth: number;
  topCategories: CategoryItem[];
  topProducts: ProductItem[];
  revenueOverTime: RevenuePoint[];
  itemsPerCategory: CategoryItem[];
  pricingDistribution: PricingBucket[];
  categories: string[];
  platforms: string[];
}

export interface InsightMetric {
  label: string;
  value: string;
}

export interface Insight {
  type: "opportunity" | "risk" | "trend" | "recommendation";
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  metric?: InsightMetric | null;
}

export interface InsightsResponse {
  insights: Insight[];
}

export async function fetchStats(filters: AnalyticsFilters): Promise<StatsResponse> {
  const res = await fetch(`${PROXY}/analytics/stats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch analytics stats");
  }
  return res.json();
}

export async function fetchInsights(filters: AnalyticsFilters): Promise<InsightsResponse> {
  const res = await fetch(`${PROXY}/analytics/insights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to generate insights");
  }
  return res.json();
}
