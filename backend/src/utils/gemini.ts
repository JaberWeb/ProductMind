import { callLLM } from "./llm";

const SYSTEM_PROMPT = `You map CSV/Excel column headers to target fields.
Return JSON object with key "mappings" containing array of {sourceColumn, targetField}.
If no match, set targetField to null.

Target fields: orderId, productName, quantity, price, revenue, date, category, customerEmail, sourcePlatform

Example input: ["Order ID", "Product", "Qty", "Price", "Total", "Date", "Category", "Email", "Platform"]
Example output: {"mappings": [
  {"sourceColumn": "Order ID", "targetField": "orderId"},
  {"sourceColumn": "Product", "targetField": "productName"},
  {"sourceColumn": "Qty", "targetField": "quantity"},
  {"sourceColumn": "Price", "targetField": "price"},
  {"sourceColumn": "Total", "targetField": "revenue"},
  {"sourceColumn": "Date", "targetField": "date"},
  {"sourceColumn": "Category", "targetField": "category"},
  {"sourceColumn": "Email", "targetField": "customerEmail"},
  {"sourceColumn": "Platform", "targetField": "sourcePlatform"}
]}`;

export interface AiMapping {
  sourceColumn: string;
  targetField: string | null;
}

export async function inferColumnsWithAI(headers: string[]): Promise<AiMapping[]> {
  const text = await callLLM(
    SYSTEM_PROMPT,
    `Input: ${JSON.stringify(headers)}`,
    { json: true, model: "llama-3.3-70b-versatile", maxTokens: 1024 }
  );

  const parsed = JSON.parse(text);
  return parsed.mappings as AiMapping[];
}
