import { Router } from "express";
import type { AuthRequest } from "../types";
import { callLLM } from "../utils/llm";

const router = Router();

router.post("/analytics/stats", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const { dateFrom, dateTo, category, platform } = req.body;

    const match: any = { ownerId: req.user.id };
    if (dateFrom || dateTo) {
      match.date = {};
      if (dateFrom) match.date.$gte = dateFrom;
      if (dateTo) match.date.$lte = dateTo;
    }
    if (category) match.category = category;
    if (platform) match.sourcePlatform = platform;

    const today = new Date();
    const currentYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const [
      totalItems,
      revenueAgg,
      priceAgg,
      itemsThisMonth,
      topCategories,
      topProducts,
      itemsPerCategory,
      pricingData,
      categories,
      platforms,
    ] = await Promise.all([
      db.collection("items").countDocuments(match),

      db.collection("items")
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $convert: { input: "$revenue", to: "double", onError: 0, onNull: 0 },
                },
              },
            },
          },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              avg: {
                $avg: {
                  $convert: { input: "$price", to: "double", onError: 0, onNull: 0 },
                },
              },
            },
          },
        ])
        .toArray(),

      db.collection("items").countDocuments({ ...match, date: { $regex: `^${currentYm}` } }),

      db.collection("items")
        .aggregate([
          { $match: { ...match, category: { $nin: ["", null] } } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: { ...match, productName: { $nin: ["", null] } } },
          {
            $group: {
              _id: "$productName",
              revenue: {
                $sum: {
                  $convert: { input: "$revenue", to: "double", onError: 0, onNull: 0 },
                },
              },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: { ...match, category: { $nin: ["", null] } } },
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: { ...match, price: { $nin: ["", null] } } },
          {
            $project: {
              price: { $convert: { input: "$price", to: "double", onError: null, onNull: null } },
            },
          },
          { $match: { price: { $ne: null } } },
        ])
        .toArray(),

      db.collection("items").distinct("category", { ...match, category: { $nin: ["", null] } }),
      db.collection("items").distinct("sourcePlatform", { ...match, sourcePlatform: { $nin: ["", null] } }),
    ]);

    const totalRevenue = Math.round((revenueAgg[0]?.total || 0) * 100) / 100;
    const avgPrice = Math.round((priceAgg[0]?.avg || 0) * 100) / 100;

    const buckets = [0, 10, 25, 50, 100, 250, 500, 1000, Infinity];
    const bucketLabels = ["$0–$10", "$10–$25", "$25–$50", "$50–$100", "$100–$250", "$250–$500", "$500–$1K", "$1K+"];
    const pricingDistribution = bucketLabels.map((range, i) => ({
      range,
      count: pricingData.filter((p: any) => {
        const v = p.price;
        return v >= buckets[i] && v < buckets[i + 1];
      }).length,
    }));

    const rawItems = await db.collection("items")
      .find(match, { projection: { date: 1, revenue: 1 } })
      .toArray();

    const monthlyRevenue: Record<string, number> = {};
    for (const item of rawItems) {
      const d = new Date(item.date as string);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (parseFloat(item.revenue as string) || 0);
      }
    }

    const revenueOverTime = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, revenue]) => ({ month, revenue: Math.round(revenue * 100) / 100 }));

    res.json({
      totalItems,
      totalRevenue,
      avgPrice,
      itemsThisMonth,
      topCategories: topCategories.map((c: any) => ({ category: c._id, count: c.count })),
      topProducts: topProducts.map((p: any) => ({ productName: p._id, revenue: Math.round(p.revenue * 100) / 100 })),
      revenueOverTime,
      itemsPerCategory: itemsPerCategory.map((c: any) => ({ category: c._id, count: c.count })),
      pricingDistribution,
      categories,
      platforms,
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

    const match: any = { ownerId: req.user.id };
    if (dateFrom || dateTo) {
      match.date = {};
      if (dateFrom) match.date.$gte = dateFrom;
      if (dateTo) match.date.$lte = dateTo;
    }
    if (category) match.category = category;
    if (platform) match.sourcePlatform = platform;

    const nonEmptyCategory = { ...match, category: { $nin: ["", null] } };
    const nonEmptyProduct = { ...match, productName: { $nin: ["", null] } };
    const nonEmptyPlatform = { ...match, sourcePlatform: { $nin: ["", null] } };

    const convert = (field: string) => ({
      $convert: { input: `$${field}`, to: "double" as const, onError: 0, onNull: 0 },
    });

    const [
      totalItems,
      totalRevenueAgg,
      avgPriceAgg,
      itemsThisMonth,
      categoryBreakdown,
      topProductsRevenue,
      topProductsVolume,
      lowPerformers,
      platformRevenue,
    ] = await Promise.all([
      db.collection("items").countDocuments(match),

      db.collection("items")
        .aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: convert("revenue") } } }])
        .toArray(),

      db.collection("items")
        .aggregate([{ $match: match }, { $group: { _id: null, avg: { $avg: convert("price") } } }])
        .toArray(),

      (() => {
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        return db.collection("items").countDocuments({ ...match, date: { $regex: `^${ym}` } });
      })(),

      db.collection("items")
        .aggregate([
          { $match: nonEmptyCategory },
          { $group: { _id: "$category", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: nonEmptyProduct },
          { $group: { _id: "$productName", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: 1 } },
          { $limit: 5 },
        ])
        .toArray(),

      db.collection("items")
        .aggregate([
          { $match: nonEmptyPlatform },
          { $group: { _id: "$sourcePlatform", count: { $sum: 1 }, revenue: { $sum: convert("revenue") } } },
          { $sort: { revenue: -1 } },
        ])
        .toArray(),

    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    const avgPrice = avgPriceAgg[0]?.avg || 0;

    const rawItems = await db.collection("items")
      .find(match, { projection: { date: 1, revenue: 1 } })
      .toArray();

    const monthlyRevenue: Record<string, number> = {};
    for (const item of rawItems) {
      const d = new Date(item.date as string);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (parseFloat(item.revenue as string) || 0);
      }
    }

    const sortedMonths = Object.entries(monthlyRevenue).sort(([a], [b]) => a.localeCompare(b));

    let momGrowth: number | null = null;
    if (sortedMonths.length >= 2) {
      const last = sortedMonths[sortedMonths.length - 1][1];
      const prev = sortedMonths[sortedMonths.length - 2][1];
      if (prev > 0) momGrowth = Math.round(((last - prev) / prev) * 10000) / 100;
    }

    const rounds = (n: number) => Math.round(n * 100) / 100;

    const dataPayload = {
      overview: { totalItems, totalRevenue: rounds(totalRevenue), avgPrice: rounds(avgPrice), itemsThisMonth },
      categories: categoryBreakdown.map((c: any) => ({ n: c._id, c: c.count, r: rounds(c.revenue) })),
      topByRevenue: topProductsRevenue.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      topByQty: topProductsVolume.map((p: any) => ({ n: p._id, q: p.count, r: rounds(p.revenue) })),
      lowPerformers: lowPerformers.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      platforms: platformRevenue.map((p: any) => ({ n: p._id, r: rounds(p.revenue), q: p.count })),
      revenueByMonth: sortedMonths.slice(-12).map(([m, r]) => ({ m, r: rounds(r) })),
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
