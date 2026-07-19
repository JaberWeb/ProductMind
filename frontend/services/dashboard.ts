const PROXY = "/api/backend-proxy";

export interface DashboardStats {
  totalItems: number;
  activeItems: number;
  itemsThisMonth: number;
  aiSuggestionsCount: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${PROXY}/dashboard/stats`, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch dashboard stats");
  }
  return res.json();
}
