import { Router } from "express";
import type { AuthRequest } from "../types";
import { callLLMChat } from "../utils/llm";
import { ObjectId } from "mongodb";

const router = Router();

router.post("/chat/message", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const { message, conversationId } = req.body;
    const ownerId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let conversation;
    const now = new Date();

    if (conversationId) {
      conversation = await db
        .collection("conversations")
        .findOne({ _id: new ObjectId(conversationId), ownerId });
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      const title = message.length > 60 ? message.slice(0, 57) + "..." : message;
      const result = await db.collection("conversations").insertOne({
        ownerId,
        title,
        messages: [],
        createdAt: now,
        updatedAt: now,
      });
      conversation = { _id: result.insertedId, messages: [], title };
    }

    const [totalItems, totalRevenueAgg, topCategories, topProducts, recentItems] =
      await Promise.all([
        db.collection("items").countDocuments({ ownerId }),
        db
          .collection("items")
          .aggregate([
            { $match: { ownerId } },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $convert: {
                      input: "$revenue",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                },
              },
            },
          ])
          .toArray(),
        db
          .collection("items")
          .aggregate([
            { $match: { ownerId, category: { $nin: ["", null] } } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ])
          .toArray(),
        db
          .collection("items")
          .aggregate([
            { $match: { ownerId, productName: { $nin: ["", null] } } },
            {
              $group: {
                _id: "$productName",
                revenue: {
                  $sum: {
                    $convert: {
                      input: "$revenue",
                      to: "double",
                      onError: 0,
                      onNull: 0,
                    },
                  },
                },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ])
          .toArray(),
        db
          .collection("items")
          .find(
            { ownerId },
            {
              projection: {
                productName: 1,
                category: 1,
                price: 1,
                revenue: 1,
                sourcePlatform: 1,
                date: 1,
              },
              sort: { createdAt: -1 },
              limit: 5,
            }
          )
          .toArray(),
      ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const storeContext = JSON.stringify({
      totalItems,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      topCategories: topCategories.map((c: any) => ({
        name: c._id,
        count: c.count,
      })),
      topProducts: topProducts.map((p: any) => ({
        name: p._id,
        revenue: Math.round(p.revenue * 100) / 100,
      })),
      recentItems: recentItems.map((i: any) => ({
        name: i.productName,
        category: i.category,
        price: i.price,
        revenue: i.revenue,
        platform: i.sourcePlatform,
        date: i.date,
      })),
    });

    const systemPrompt = `You are ProductMind AI, a helpful assistant for store owners managing their product data. You have access to the store's data summary below. Answer questions about products, sales, categories, trends, and performance.

Store Data Context:
${storeContext}

Guidelines:
- Answer concisely and conversationally
- Cite specific numbers when relevant
- Suggest actionable insights based on the data
- If asked about something outside the data, politely explain what you can help with
- Keep responses under 500 words unless asked for detailed analysis`;

    const chatMessages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of conversation.messages) {
      chatMessages.push({ role: msg.role, content: msg.content });
    }
    chatMessages.push({ role: "user", content: message });

    const responseText = await callLLMChat(chatMessages, { maxTokens: 2048 });

    const userMessage = {
      role: "user",
      content: message,
      timestamp: now,
    };
    const assistantMessage = {
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
    };

    await db.collection("conversations").updateOne(
      { _id: conversation._id },
      {
        $push: {
          messages: { $each: [userMessage, assistantMessage] },
        },
        $set: { updatedAt: new Date() },
      }
    );

    res.json({
      response: responseText,
      conversationId: conversation._id,
      title: conversation.title,
    });
  } catch (err: any) {
    console.error("Chat message error:", err);
    res.status(500).json({ error: err.message || "Failed to process message" });
  }
});

router.get("/chat/conversations", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const conversations = await db
      .collection("conversations")
      .aggregate([
        { $match: { ownerId: req.user.id } },
        {
          $project: {
            title: 1,
            updatedAt: 1,
            createdAt: 1,
            messageCount: { $size: "$messages" },
          },
        },
        { $sort: { updatedAt: -1 } },
      ])
      .toArray();

    res.json({ conversations });
  } catch (err: any) {
    console.error("Chat conversations error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch conversations" });
  }
});

router.get("/chat/conversations/:id", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id as string;
    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(id),
      ownerId: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ conversation });
  } catch (err: any) {
    console.error("Chat conversation detail error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch conversation" });
  }
});

router.delete("/chat/conversations/:id", async (req: AuthRequest, res: any) => {
  try {
    const db = req.app.locals.db;
    const id = req.params.id as string;
    const result = await db.collection("conversations").deleteOne({
      _id: new ObjectId(id),
      ownerId: req.user.id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.json({ success: true });
  } catch (err: any) {
    console.error("Chat conversation delete error:", err);
    res.status(500).json({ error: err.message || "Failed to delete conversation" });
  }
});

export default router;
