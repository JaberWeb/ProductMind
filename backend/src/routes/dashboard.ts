import { Router } from "express";
import type { AuthRequest } from "../types";

const router = Router();

router.get("/dashboard/stats", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const ownerId = req.user.id;

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [result] = await db.collection("items")
      .aggregate([
        { $match: { ownerId } },
        { $addFields: {
          dateNorm: {
            $cond: {
              if: { $eq: [{ $type: "$date" }, "date"] },
              then: "$date",
              else: { $dateFromString: { dateString: { $ifNull: ["$date", ""] }, onError: null } },
            },
          },
        }},
        { $facet: {
          totalItems: [{ $count: "count" }],
          itemsThisMonth: [
            { $match: { dateNorm: { $gte: monthStart, $lt: monthEnd } } },
            { $count: "count" },
          ],
          aiSuggestions: [
            { $project: { count: { $size: { $ifNull: ["$generatedContent.history", []] } } } },
            { $group: { _id: null, total: { $sum: "$count" } } },
          ],
        }},
      ])
      .toArray();

    res.json({
      totalItems: result.totalItems?.[0]?.count || 0,
      activeItems: result.totalItems?.[0]?.count || 0,
      itemsThisMonth: result.itemsThisMonth?.[0]?.count || 0,
      aiSuggestionsCount: result.aiSuggestions?.[0]?.total || 0,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch dashboard stats" });
  }
});

export default router;
