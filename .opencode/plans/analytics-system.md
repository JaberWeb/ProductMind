# Analytics System

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   Frontend                       │
│  app/(protected)/analytics/page.tsx              │
│    └─ AnalyticsFilters (URL-synced params)       │
│    └─ StatCard x4                                │
│    └─ RevenueChart (Recharts LineChart)          │
│    └─ CategoryChart (Recharts BarChart)          │
│    └─ PricingChart (Recharts BarChart)           │
│    └─ InsightsPanel                              │
│         └─ InsightCard x5                        │
│                                                  │
│  services/analytics.ts                           │
│    fetchStats(filters) → POST /analytics/stats   │
│    fetchInsights(filters) → POST /analytics/insights│
└──────────────┬───────────────────────────────────┘
               │ POST /api/backend-proxy/analytics/*
               │ (proxy forwards Auth header)
┌──────────────▼───────────────────────────────────┐
│                Backend                           │
│  src/routes/analytics.ts                         │
│    POST /analytics/stats                         │
│    POST /analytics/insights                      │
│                                                  │
│  Both endpoints:                                 │
│    - Authenticated via req.user.id (ownerId)     │
│    - Filterable by dateFrom, dateTo, category,   │
│      platform                                    │
│    - MongoDB aggregation pipelines               │
└──────────────────────────────────────────────────┘
```

## Stats Endpoint — `POST /analytics/stats`

### Queries (parallel `Promise.all`)

| # | Query | Purpose |
|---|-------|---------|
| 1 | `countDocuments(match)` | Total items |
| 2 | `$sum` revenue with `$convert` | Total revenue |
| 3 | `$avg` price with `$convert` | Avg price |
| 4 | `countDocuments` with date regex | Items this month |
| 5 | `$group` by category (count desc) | Top categories |
| 6 | `$group` by productName (revenue desc) | Top products |
| 7 | `$group` by category (count desc) | Items per category |
| 8 | `$project` price as double | Pricing distribution |
| 9 | `distinct("category")` | Filter dropdown values |
| 10 | `distinct("sourcePlatform")` | Filter dropdown values |
| — | Raw items (date + revenue) → JS processing | Revenue over time (last 12 months) |

### Response shape

```ts
interface StatsResponse {
  totalItems: number;
  totalRevenue: number;
  avgPrice: number;
  itemsThisMonth: number;
  topCategories: { category: string; count: number }[];
  topProducts: { productName: string; revenue: number }[];
  revenueOverTime: { month: string; revenue: number }[];
  itemsPerCategory: { category: string; count: number }[];
  pricingDistribution: { range: string; count: number }[];
  categories: string[];
  platforms: string[];
}
```

### Price → number conversion

Uses MongoDB `$convert` with `onError: 0, onNull: 0` to safely parse string prices/revenues from CSV uploads. Invalid/missing values default to 0.

### Revenue over time

Fetches all matching items (projection: `date`, `revenue`), parses date strings in JS via `new Date()`, groups by `YYYY-MM`. Last 12 months returned.

---

## Insights Endpoint — `POST /analytics/insights`

### Richer data sent to Gemini (vs stats)

| Data section | Fields | Source |
|-------------|--------|--------|
| `overview` | totalItems, totalRevenue, avgPrice, itemsThisMonth | countDocuments + aggregation |
| `categoryBreakdown` | name, count, revenue per category | $group by category |
| `topProductsRevenue` | name, revenue, count (top 5) | $group by productName, sort revenue desc |
| `topProductsVolume` | name, count, revenue (top 5) | $group by productName, sort count desc |
| `lowPerformers` | name, revenue, count (bottom 5) | $group by productName, sort revenue asc |
| `platformBreakdown` | platform, revenue, count | $group by sourcePlatform |
| `pricingDistribution` | range, count (8 buckets) | $project + bucket counting in JS |
| `revenueTrend` | monthlyData[], momGrowth %, last/prev month revenue | Raw items → JS date parsing |
| `recentItems` | productName, price, category, platform, revenue, date (up to 20) | find().sort(createdAt desc).limit(20) |

### Gemini prompt structure

The prompt has 4 sections:

1. **Role** — "senior data analyst at a product analytics company"
2. **Data description** — what each section in the payload means
3. **6 required analysis dimensions** (cover ≥4):
   - Revenue health (MoM comparison)
   - Pricing (distribution gaps)
   - Product performance (top + bottom)
   - Category insights (revenue vs count ratio)
   - Seasonality (monthly patterns)
   - Platform performance
4. **Quality rules with anti-examples**:
   - BAD: "Revenue is increasing" → GOOD: "Revenue grew $4,200 (23%) MoM"
   - BAD: "Some products underperform" → GOOD: "5 items generated $0"
   - BAD: "Improve pricing" → GOOD: "68% of products under $25"
5. **Structured output schema** (5 objects, strict JSON)

### Output shape

```ts
interface Insight {
  type: "opportunity" | "risk" | "trend" | "recommendation";
  title: string;         // ≤8 words
  description: string;   // 1-2 sentences with ≥1 number
  confidence: "high" | "medium" | "low";
  metric?: {             // optional — shown as badge in card
    label: string;       // e.g. "MoM change"
    value: string;       // e.g. "+23%"
  } | null;
}
```

### Confidence rules

| Level | Criteria |
|-------|----------|
| **high** | Clear numerical trend with strong evidence |
| **medium** | Some data support, reasonable inference |
| **low** | Speculative, thin data, weak signal |

---

## Filter System

URL-synced search params via `useSearchParams`:

```
/analytics?category=Electronics&platform=Shopify&dateFrom=2025-01-01&dateTo=2025-12-31
```

| Param | Type | Component |
|-------|------|-----------|
| `dateFrom` | ISO date string | `<input type="date">` |
| `dateTo` | ISO date string | `<input type="date">` |
| `category` | string | `<select>` populated from `stats.categories` |
| `platform` | string | `<select>` populated from `stats.platforms` |

Filter change → `router.replace()` updates URL → both `useQuery` keys change → refetch stats + insights.

---

## Frontend Component Tree

```
AnalyticsPage
├── AnalyticsFilters
│   └── date inputs + category/platform <select>
├── StatCard (x4)           — Package, DollarSign, ShoppingBag, TrendingUp
├── RevenueChart            — Recharts LineChart, indigo-500 line
├── CategoryChart           — Recharts BarChart, emerald-500 bars
├── PricingChart            — Recharts BarChart, violet-500 bars
└── InsightsPanel
    ├── Refresh button + Bot icon
    ├── Shimmer skeleton (while loading)
    ├── Error banner (if API fails)
    └── InsightCard (x5)
         ├── Left colored border (type-based: green/red/blue/amber)
         ├── Icon + title + description
         ├── Metric badge (indigo, optional)
         └── Confidence badge (emerald/amber/red)
```

## Key design decisions

- **Both endpoints are POST** — proxy only supports POST. Filters sent in request body.
- **String→number via `$convert`** — items are stored with string fields from CSV. `$convert` with `onError/onNull` handles edge cases.
- **Date processing in JS** — date strings vary in format per CSV. MongoDB date ops unreliable. Fetch → `new Date()` → group in JS.
- **Insights auto-fetch after stats** — `enabled: !!stats` ensures insights only run when stats data is ready.
- **No insight caching by default** — each filter change triggers fresh insight generation (Gemini API call).

## Future improvements

- Normalize date strings on insert for MongoDB-level date aggregation
- Cache insight results per filter combo (TTL: 1 hour)
- Paginate large item sets for insight data payload
- Add export (PNG/CSV) for charts
- Parallel platform/category insight drill-down
