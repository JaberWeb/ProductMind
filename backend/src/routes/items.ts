import { Router } from "express";
import { ObjectId } from "mongodb";
import type { AuthRequest } from "../types";

const router = Router();

function serializeItem(item: any) {
  if (!item) return null;
  return {
    ...item,
    _id: item._id.toString(),
  };
}

router.get("/items", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string || "").trim();

    const filter: any = { ownerId: req.user.id };

    if (search) {
      const regex = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
      filter.$or = [
        { productName: regex },
        { category: regex },
        { sourcePlatform: regex },
        { orderId: regex },
        { customerEmail: regex },
      ];
    }

    const [items, total] = await Promise.all([
      db.collection("items")
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      db.collection("items").countDocuments(filter),
    ]);

    res.json({
      items: items.map(serializeItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error("Items list error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch items" });
  }
});

router.get("/items/:id", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(req.params.id as string);
    } catch {
      return res.status(400).json({ error: "Invalid itemId format" });
    }

    const item = await db.collection("items").findOne(
      { _id: objectId, ownerId: req.user.id }
    );

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(serializeItem(item));
  } catch (err: any) {
    console.error("Item detail error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch item" });
  }
});

router.put("/items/:id", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(req.params.id as string);
    } catch {
      return res.status(400).json({ error: "Invalid itemId format" });
    }

    const allowedFields = [
      "productName", "category", "price", "revenue", "quantity",
      "date", "orderId", "customerEmail", "sourcePlatform",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    updates.updatedAt = new Date();

    const result = await db.collection("items").updateOne(
      { _id: objectId, ownerId: req.user.id },
      { $set: updates }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Item not found" });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Item update error:", err);
    res.status(500).json({ error: err.message || "Failed to update item" });
  }
});

router.delete("/items/:id", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(req.params.id as string);
    } catch {
      return res.status(400).json({ error: "Invalid itemId format" });
    }

    const result = await db.collection("items").deleteOne(
      { _id: objectId, ownerId: req.user.id }
    );

    if (result.deletedCount === 0) return res.status(404).json({ error: "Item not found" });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Item delete error:", err);
    res.status(500).json({ error: err.message || "Failed to delete item" });
  }
});

export default router;
