import { Router } from "express";
import { ObjectId } from "mongodb";
import type { AuthRequest } from "../types";
import { callLLM } from "../utils/llm";

const router = Router();

const SYSTEM_PROMPTS: Record<string, string> = {
  title: "You are an e-commerce copywriter. Generate a compelling product title.",
  description: "You are an e-commerce copywriter. Write a detailed product description that highlights features, benefits, and use cases.",
  short_description: "You are an e-commerce copywriter. Write a concise product summary (1-2 sentences) that captures the key selling point.",
  seo: "You are an SEO specialist. Generate an SEO meta description (max 160 chars) and 5 relevant keywords for the product.",
  social: "You are a social media content creator. Write an engaging social media post promoting the product.",
};

const LENGTH_GUIDES: Record<string, Record<string, string>> = {
  title: { short: "2-4 words", medium: "5-8 words", long: "9-15 words" },
  description: { short: "30-50 words", medium: "50-150 words", long: "150-300 words" },
  short_description: { short: "10-20 words", medium: "20-40 words", long: "40-60 words" },
  seo: { short: "80-100 chars", medium: "100-130 chars", long: "130-160 chars" },
  social: { short: "50-80 chars", medium: "80-200 chars", long: "200-400 chars" },
};

router.post("/content/generate", async (req: AuthRequest, res: any) => {
  try {
    const { itemId, contentType, length, tone } = req.body as {
      itemId: string;
      contentType: "title" | "description" | "short_description" | "seo" | "social";
      length: "short" | "medium" | "long";
      tone: "professional" | "casual" | "persuasive";
    };

    if (!itemId || !contentType || !length || !tone) {
      return res.status(400).json({ error: "Missing required fields: itemId, contentType, length, tone" });
    }

    const validTypes = ["title", "description", "short_description", "seo", "social"];
    const validLengths = ["short", "medium", "long"];
    const validTones = ["professional", "casual", "persuasive"];

    if (!validTypes.includes(contentType)) return res.status(400).json({ error: "Invalid contentType" });
    if (!validLengths.includes(length)) return res.status(400).json({ error: "Invalid length" });
    if (!validTones.includes(tone)) return res.status(400).json({ error: "Invalid tone" });

    const db = req.app.locals.db;
    let item: any;

    try {
      item = await db.collection("items").findOne({ _id: new ObjectId(itemId), ownerId: req.user.id });
    } catch {
      return res.status(400).json({ error: "Invalid itemId format" });
    }

    if (!item) return res.status(404).json({ error: "Item not found" });

    const productData = [
      `Product: ${item.productName || "N/A"}`,
      item.category ? `Category: ${item.category}` : null,
      item.price ? `Price: $${item.price}` : null,
    ].filter(Boolean).join("\n");

    const lengthGuide = LENGTH_GUIDES[contentType]?.[length] || "medium length";
    const systemPrompt = `${SYSTEM_PROMPTS[contentType]}\nTone: ${tone}. Target length: ${lengthGuide}. Generate only the content, no extra commentary.`;

    const userPrompt = `Generate a ${contentType.replace("_", " ")} for this product:\n\n${productData}`;

    const text = await callLLM(systemPrompt, userPrompt, { maxTokens: 1024 });

    res.json({
      content: text.trim(),
      contentType,
      length,
      tone,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Content generate error:", err);
    res.status(500).json({ error: err.message || "Failed to generate content" });
  }
});

router.post("/content/save", async (req: AuthRequest, res: any) => {
  try {
    const { itemId, contentType, content } = req.body as {
      itemId: string;
      contentType: string;
      content: string;
    };

    if (!itemId || !contentType || !content) {
      return res.status(400).json({ error: "Missing required fields: itemId, contentType, content" });
    }

    const db = req.app.locals.db;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(itemId);
    } catch {
      return res.status(400).json({ error: "Invalid itemId format" });
    }

    const updateField = `generatedContent.${contentType}`;
    const result = await db.collection("items").updateOne(
      { _id: objectId, ownerId: req.user.id },
      {
        $set: { [updateField]: content, "generatedContent.updatedAt": new Date() },
        $push: {
          "generatedContent.history": {
            type: contentType,
            content,
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Item not found" });

    res.json({ success: true });
  } catch (err: any) {
    console.error("Content save error:", err);
    res.status(500).json({ error: err.message || "Failed to save content" });
  }
});

export default router;
