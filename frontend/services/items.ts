const PROXY = "/api/backend-proxy";

export interface Item {
  _id: string;
  productName?: string;
  category?: string;
  price?: string;
  revenue?: string;
  quantity?: string;
  date?: string;
  orderId?: string;
  customerEmail?: string;
  sourcePlatform?: string;
  sourceFile?: string;
  confidenceScore?: number | null;
  createdAt?: string;
  updatedAt?: string;
  generatedContent?: {
    title?: string;
    description?: string;
    short_description?: string;
    seo?: string;
    social?: string;
    updatedAt?: string;
    history?: Array<{ type: string; content: string; createdAt: string }>;
  };
}

export interface ItemsListResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ItemsListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function fetchItems(params?: ItemsListParams): Promise<ItemsListResponse> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  const url = `${PROXY}/items${query ? `?${query}` : ""}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch items");
  }
  return res.json();
}

export async function fetchItem(id: string): Promise<Item> {
  const res = await fetch(`${PROXY}/items/${id}`, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to fetch item");
  }
  return res.json();
}

export async function updateItem(id: string, data: Partial<Item>): Promise<{ success: boolean }> {
  const res = await fetch(`${PROXY}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to update item");
  }
  return res.json();
}

export async function deleteItem(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${PROXY}/items/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to delete item");
  }
  return res.json();
}
