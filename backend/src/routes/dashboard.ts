import { Router } from "express";
import type { AuthRequest } from "../types";

const router = Router();

router.get("/dashboard/stats", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const ownerId = req.user.id;

    const today = new Date();
    const currentYm = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const [totalItems, itemsThisMonth, aiAgg] = await Promise.all([
      db.collection("items").countDocuments({ ownerId }),
      db.collection("items").countDocuments({ ownerId, date: { $regex: `^${currentYm}` } }),
      db.collection("items")
        .aggregate([
          { $match: { ownerId } },
          { $project: { count: { $size: { $ifNull: ["$generatedContent.history", []] } } } },
          { $group: { _id: null, total: { $sum: "$count" } } },
        ])
        .toArray(),
    ]);

    res.json({
      totalItems,
      activeItems: totalItems,
      itemsThisMonth,
      aiSuggestionsCount: aiAgg[0]?.total || 0,
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch dashboard stats" });
  }
});

export default router;
