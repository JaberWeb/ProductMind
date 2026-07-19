import { Router } from "express";
import type { AuthRequest } from "../types";
import { fetchFileBuffer } from "../utils/fetch-file";
import { parseCsv } from "../utils/csv-parser";
import { parseXlsx } from "../utils/xlsx-parser";
import { detectSchema } from "../utils/schema-detector";
import { inferColumnsWithAI } from "../utils/gemini";

const router = Router();

const NORMALIZED_FIELDS = [
  "orderId", "productName", "quantity", "price",
  "revenue", "date", "category", "customerEmail", "sourcePlatform",
] as const;

function normalizeRow(row: Record<string, string>, mapping: { sourceColumn: string; targetField: string | null }[]): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const m of mapping) {
    if (m.targetField && row[m.sourceColumn] !== undefined) {
      normalized[m.targetField] = row[m.sourceColumn];
    }
  }
  return normalized;
}

router.post("/upload/preview", async (req: AuthRequest, res: any) => {
  try {
    const { fileUrl, fileName } = req.body;
    if (!fileUrl) return res.status(400).json({ error: "fileUrl is required" });

    const buffer = await fetchFileBuffer(fileUrl);
    const ext = (fileName || fileUrl).toLowerCase();
    const isCsv = ext.endsWith(".csv");
    const isXlsx = ext.endsWith(".xlsx") || ext.endsWith(".xls");

    if (!isCsv && !isXlsx) {
      return res.status(400).json({ error: "Unsupported file type. Upload CSV or Excel files only." });
    }

    const parsed = isCsv ? parseCsv(buffer) : parseXlsx(buffer);
    const { headers, rows } = parsed;

    let mapping = detectSchema(headers);
    let usedAi = false;

    if (mapping.unmappedColumns.length > 0) {
      try {
        const aiMapping = await inferColumnsWithAI(headers);
        mapping = {
          mapping: aiMapping,
          confidence: Math.round((aiMapping.filter((m) => m.targetField).length / headers.length) * 100),
          unmappedColumns: aiMapping.filter((m) => !m.targetField).map((m) => m.sourceColumn),
        };
        usedAi = true;
      } catch {
        // fall back to rule-based mapping
      }
    }

    const preview = rows.slice(0, 5).map((row) => normalizeRow(row, mapping.mapping));

    const mappedFields = mapping.mapping.filter((m) => m.targetField).map((m) => m.targetField!);
    const missingFields = NORMALIZED_FIELDS.filter((f) => !mappedFields.includes(f));

    res.json({
      fileName,
      totalRows: rows.length,
      headers,
      mapping: mapping.mapping,
      confidence: mapping.confidence,
      unmappedColumns: mapping.unmappedColumns,
      missingFields,
      preview,
      usedAi,
    });
  } catch (err: any) {
    console.error("Upload preview error:", err);
    res.status(500).json({ error: err.message || "Failed to process file" });
  }
});

router.post("/upload/confirm", async (req: AuthRequest, res: any) => {
  try {
    const { fileUrl, fileName, mapping } = req.body;
    if (!fileUrl || !mapping) {
      return res.status(400).json({ error: "fileUrl and mapping are required" });
    }

    const buffer = await fetchFileBuffer(fileUrl);
    const ext = (fileName || fileUrl).toLowerCase();
    const isCsv = ext.endsWith(".csv");
    const isXlsx = ext.endsWith(".xlsx") || ext.endsWith(".xls");

    if (!isCsv && !isXlsx) {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    const parsed = isCsv ? parseCsv(buffer) : parseXlsx(buffer);
    const db = req.app.locals.db;
    const ownerId = req.user.id;

    const documents = parsed.rows.map((row: Record<string, string>) => ({
      ownerId,
      sourceFile: fileName || fileUrl,
      ...normalizeRow(row, mapping),
      confidenceScore: null,
      createdAt: new Date(),
    }));

    const result = await db.collection("items").insertMany(documents);

    res.json({ insertedCount: result.insertedCount });
  } catch (err: any) {
    console.error("Upload confirm error:", err);
    res.status(500).json({ error: err.message || "Failed to save data" });
  }
});

export default router;
