# Step Plan 04 — AI Analysis Dashboard

## Goal

Build the Analytics page with overview stats, Recharts visualizations, AI-powered insights from Gemini, and filters.

## Depends on

- Step Plan 03 (items in MongoDB with normalized schema)

## Backend tasks

- [ ] Create `src/routes/analytics.ts` — GET `/api/analytics/stats`
- [ ] Stats endpoint: total items, total revenue, avg price, top categories, top products, revenue over time
- [ ] Create `src/routes/analytics.ts` — POST `/api/analytics/insights`
- [ ] Insights endpoint: send items data to Gemini with structured prompt, return actionable insights with confidence scores
- [ ] Gemini prompt: analyze pricing trends, stock risk, best/worst performers, seasonality

## Frontend tasks

- [ ] Create `app/(protected)/analytics/page.tsx` — analytics dashboard layout
- [ ] Overview stat cards: Total Items, Total Revenue, Avg Price, Items This Month
- [ ] Revenue line chart (Recharts `LineChart`) — last 12 months
- [ ] Category bar chart (Recharts `BarChart`) — items per category
- [ ] Pricing distribution scatter or bar chart
- [ ] AI insights panel: loading skeleton → cards with insight text + confidence badge
- [ ] Filters: date range picker, category dropdown, platform dropdown
- [ ] Filter state synced with URL query params for shareable links

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/analytics/stats` | Aggregated stats (counts, sums, top items) |
| POST | `/api/analytics/insights` | AI-generated insights from data |

## Files to create (backend)
- `src/routes/analytics.ts`

## Files to create (frontend)
- `components/stat-card.tsx`
- `components/charts/revenue-chart.tsx`
- `components/charts/category-chart.tsx`
- `components/charts/pricing-chart.tsx`
- `components/insights-panel.tsx`
- `components/insight-card.tsx`
- `components/analytics-filters.tsx`
- `services/analytics.ts`

## Design
- Load `productmind-design` skill
- Stat cards: icon + label + value, each with subtle color accent (indigo, emerald, amber, slate)
- Charts: `ResponsiveContainer`, indigo-500 line, emerald-500 bars
- Insight card: left colored border, confidence badge top-right
- Confidence badge: high=`bg-emerald-100 text-emerald-700`, medium=`bg-amber-100 text-amber-700`, low=`bg-red-100 text-red-700`

## Verify
- `npm run build` passes both sides
- `/analytics` loads stats from backend
- Charts render with mock/test data
- AI insights return with confidence scores
- Filters update charts and insights
