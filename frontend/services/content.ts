const PROXY = "/api/backend-proxy";

export interface Item {
  _id: string;
  productName: string;
  category: string;
  price: string;
  createdAt: string;
}

export interface ItemsResponse {
  items: Item[];
}

export interface ContentResponse {
  content: string;
  contentType: string;
  length: string;
  tone: string;
  generatedAt: string;
}

export interface SaveResponse {
  success: boolean;
}

export type ContentType = "title" | "description" | "short_description" | "seo" | "social";
export type Length = "short" | "medium" | "long";
export type Tone = "professional" | "casual" | "persuasive";

export async function fetchItems(): Promise<ItemsResponse> {
  const res = await fetch(`${PROXY}/items`, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch items");
  }
  return res.json();
}

export async function generateContent(params: {
  itemId: string;
  contentType: ContentType;
  length: Length;
  tone: Tone;
}): Promise<ContentResponse> {
  const res = await fetch(`${PROXY}/content/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to generate content");
  }
  return res.json();
}

export async function saveContent(itemId: string, contentType: string, content: string): Promise<SaveResponse> {
  const res = await fetch(`${PROXY}/content/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, contentType, content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to save content");
  }
  return res.json();
}

export interface ItemContentResponse {
  generatedContent: {
    title?: string;
    description?: string;
    short_description?: string;
    seo?: string;
    social?: string;
    updatedAt?: string;
    history?: Array<{
      type: string;
      content: string;
      createdAt: string;
    }>;
  } | null;
}

export async function fetchItemContent(itemId: string): Promise<ItemContentResponse> {
  const res = await fetch(`${PROXY}/items/${itemId}`, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch item content");
  }
  const item = await res.json();
  return { generatedContent: item.generatedContent || null };
}
