import { Router } from "express";
import type { AuthRequest } from "../types";
import { callLLM } from "../utils/llm";

const router = Router();

function toDate(v: string): Date | null {
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

router.post("/analytics/stats", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const { dateFrom, dateTo, category, platform } = req.body;

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const pipeline: any[] = [
      { $match: { ownerId: req.user.id } },
      { $addFields: {
        dateNorm: {
          $cond: {
            if: { $eq: [{ $type: "$date" }, "date"] },
            then: "$date",
            else: { $dateFromString: { dateString: { $ifNull: ["$date", ""] }, onError: null } },
          },
        },
      }},
    ];

    const facetMatch: any = {};
    if (category) facetMatch.category = category;
    if (platform) facetMatch.sourcePlatform = platform;
    if (dateFrom || dateTo) {
      facetMatch.dateNorm = {};
      if (dateFrom) {
        const d = toDate(dateFrom);
        if (d) facetMatch.dateNorm.$gte = d;
      }
      if (dateTo) {
        const d = toDate(dateTo);
        if (d) {
          const end = new Date(d);
          end.setDate(end.getDate() + 1);
          facetMatch.dateNorm.$lt = end;
        }
      }
    }

    if (Object.keys(facetMatch).length > 0) {
      pipeline.push({ $match: facetMatch });
    }

    pipeline.push({
      $facet: {
        stats: [
          { $group: {
            _id: null,
            totalItems: { $sum: 1 },
            totalRevenue: { $sum: { $convert: { input: "$revenue", to: "double", onError: 0, onNull: 0 } } },
            avgPrice: { $avg: { $convert: { input: "$price", to: "double", onError: 0, onNull: 0 } } },
          }},
        ],
        topCategories: [
          { $match: { category: { $nin: ["", null] } } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        topProducts: [
          { $match: { productName: { $nin: ["", null] } } },
          { $group: {
            _id: "$productName",
            revenue: { $sum: { $convert: { input: "$revenue", to: "double", onError: 0, onNull: 0 } } },
          }},
          { $sort: { revenue: -1 } },
          { $limit: 10 },
        ],
        pricingBuckets: [
          { $match: { price: { $nin: ["", null] } } },
          { $project: {
            priceNum: { $convert: { input: "$price", to: "double", onError: null, onNull: null } },
          }},
          { $match: { priceNum: { $ne: null } } },
          { $bucket: {
            groupBy: "$priceNum",
            boundaries: [0, 10, 25, 50, 100, 250, 500, 1000],
            default: "1000+",
            output: { count: { $sum: 1 } },
          }},
        ],
        monthlyRevenue: [
          { $match: { dateNorm: { $ne: null }, revenue: { $nin: ["", null] } } },
          { $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$dateNorm" } },
            revenue: { $sum: { $convert: { input: "$revenue", to: "double", onError: 0, onNull: 0 } } },
          }},
          { $sort: { _id: 1 } },
        ],
        itemsThisMonth: [
          { $match: { dateNorm: { $gte: monthStart, $lt: monthEnd } } },
          { $count: "count" },
        ],
        categories: [
          { $match: { category: { $nin: ["", null] } } },
          { $group: { _id: "$category" } },
        ],
        platforms: [
          { $match: { sourcePlatform: { $nin: ["", null] } } },
          { $group: { _id: "$sourcePlatform" } },
        ],
      },
    });

    const [result] = await db.collection("items").aggregate(pipeline).toArray();

    const stats = result.stats?.[0] || {};
    const totalRevenue = Math.round((stats.totalRevenue || 0) * 100) / 100;
    const avgPrice = Math.round((stats.avgPrice || 0) * 100) / 100;

    const bucketLabels: Record<string, string> = {
      "0": "$0–$10", "10": "$10–$25", "25": "$25–$50", "50": "$50–$100",
      "100": "$100–$250", "250": "$250–$500", "500": "$500–$1K", "1000+": "$1K+",
    };

    const pricingDistribution = (result.pricingBuckets || []).map((b: any) => ({
      range: bucketLabels[String(b._id)] || String(b._id),
      count: b.count,
    }));

    const revenueOverTime = (result.monthlyRevenue || []).slice(-12).map((m: any) => ({
      month: m._id,
      revenue: Math.round(m.revenue * 100) / 100,
    }));

    res.json({
      totalItems: stats.totalItems || 0,
      totalRevenue,
      avgPrice,
      itemsThisMonth: result.itemsThisMonth?.[0]?.count || 0,
      topCategories: (result.topCategories || []).map((c: any) => ({ category: c._id, count: c.count })),
      topProducts: (result.topProducts || []).map((p: any) => ({
        productName: p._id,
        revenue: Math.round(p.revenue * 100) / 100,
      })),
      revenueOverTime,
      itemsPerCategory: (result.topCategories || []).map((c: any) => ({ category: c._id, count: c.count })),
      pricingDistribution,
      categories: (result.categories || []).map((c: any) => c._id),
      platforms: (result.platforms || []).map((p: any) => p._id),
    });
  } catch (err: any) {
    console.error("Analytics stats error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch stats" });
  }
});

router.post("/analytics/insights", async (req: AuthRequest, res: any) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ error: "GROQ_API_KEY not configured" });
    }

    const db = req.app.locals.db;
    const { dateFrom, dateTo, category, platform } = req.body;

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const pipeline: any[] = [
      { $match: { ownerId: req.user.id } },
      { $addFields: {
        dateNorm: {
          $cond: {
            if: { $eq: [{ $type: "$date" }, "date"] },
            then: "$date",
            else: { $dateFromString: { dateString: { $ifNull: ["$date", ""] }, onError: null } },
          },
        },
      }},
    ];

    const facetMatch: any = {};
    if (category) facetMatch.category = category;
    if (platform) facetMatch.sourcePlatform = platform;
    if (dateFrom || dateTo) {
      facetMatch.dateNorm = {};
      if (dateFrom) {
        const d = toDate(dateFrom);
        if (d) facetMatch.dateNorm.$gte = d;
      }
      if (dateTo) {
        const d = toDate(dateTo);
        if (d) {
          const end = new Date(d);
          end.setDate(end.getDate() + 1);
          facetMatch.dateNorm.$lt = end;
        }
      }
    }

    if (Object.keys(facetMatch).length > 0) {
      pipeline.push({ $match: facetMatch });
    }

    const convert = (field: string) => ({
      $convert: { input: `$${field}`, to: "double" as const, onError: 0, onNull: 0 },
    });

    const nonEmptyCategory = { category: { $nin: ["", null] } };
    const nonEmptyProduct = { productName: { $nin: ["", null] } };
    const nonEmptyPlatform = { sourcePlatform: { $nin: ["", null] } };

    const [facetResult, ...rest] = await Promise.all([
      db.collection("items")
        .aggregate([
          ...pipeline,
          { $facet: {
            stats: [
              { $group: {
                _id: null,
                totalItems: { $sum: 1 },
                totalRevenue: { $sum: convert("revenue") },
                avgPrice: { $avg: convert("price") },
              }},
            ],
            monthlyRevenue: [
              { $match: { dateNorm: { $ne: null }, revenue: { $nin: ["", null] } } },
              { $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$dateNorm" } },
                revenue: { $sum: convert("revenue") },
              }},
              { $sort: { _id: 1 } },
            ],
            itemsThisMonth: [
              { $match: { dateNorm: { $gte: monthStart, $lt: monthEnd } } },
              { $count: "count" },
            ],
          }},
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          ...pipeline,
          { $match: nonEmptyCategory },
          { $group: { _id: "$category", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          ...pipeline,
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          ...pipeline,
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          ...pipeline,
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: 1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          ...pipeline,
          { $match: nonEmptyPlatform },
          { $group: { _id: "$sourcePlatform", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
        ])
        .toArray(),
    ]);

    const data = facetResult[0] || {};
    const overviewStats = data.stats?.[0] || {};

    const sortedMonths = (data.monthlyRevenue || []) as Array<{ _id: string; revenue: number }>;

    let momGrowth: number | null = null;
    if (sortedMonths.length >= 2) {
      const last = sortedMonths[sortedMonths.length - 1].revenue;
      const prev = sortedMonths[sortedMonths.length - 2].revenue;
      if (prev > 0) momGrowth = Math.round(((last - prev) / prev) * 10000) / 100;
    }

    const rounds = (n: number) => Math.round(n * 100) / 100;

    const [categoryBreakdown, topProductsRevenue, topProductsVolume, lowPerformers, platformRevenue] = rest;

    const dataPayload = {
      overview: {
        totalItems: overviewStats.totalItems || 0,
        totalRevenue: rounds(overviewStats.totalRevenue || 0),
        avgPrice: rounds(overviewStats.avgPrice || 0),
        itemsThisMonth: data.itemsThisMonth?.[0]?.count || 0,
      },
      categories: categoryBreakdown.map((c: any) => ({ n: c._id, c: c.count, r: rounds(c.revenue) })),
      topByRevenue: topProductsRevenue.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      topByQty: topProductsVolume.map((p: any) => ({ n: p._id, q: p.count, r: rounds(p.revenue) })),
      lowPerformers: lowPerformers.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      platforms: platformRevenue.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      revenueByMonth: sortedMonths.slice(-12).map((m) => ({ m: m._id, r: rounds(m.revenue) })),
      momGrowth: momGrowth !== null ? `${momGrowth > 0 ? "+" : ""}${momGrowth}%` : null,
    };

    const prompt = `Analyze this product data business analytics. Return JSON object with key "insights" containing exactly 5 insights.

Each insight: {type:"opportunity"|"risk"|"trend"|"recommendation", title:string, description:string (cite a number), confidence:"high"|"medium"|"low", metric?:{label:string, value:string}}

Cover >=4 areas: revenue trend, pricing, product performance, categories, seasonality, platforms.

Rules: Every insight cites a number. BAD:"Revenue is growing" GOOD:"Revenue +$4,200 (23%) MoM". high=clear evidence, medium=reasonable, low=speculative.

Data:${JSON.stringify(dataPayload)}`;

    const text = await callLLM(
      "You are a business analytics expert. Return ONLY valid JSON.",
      prompt,
      { json: true, maxTokens: 4096 }
    );

    const parsed = JSON.parse(text);
    res.json({ insights: parsed.insights });
  } catch (err: any) {
    console.error("Analytics insights error:", err);
    res.status(500).json({ error: err.message || "Failed to generate insights" });
  }
});

export default router;
