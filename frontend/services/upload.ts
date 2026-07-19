const PROXY = "/api/backend-proxy";

export interface PreviewResponse {
  fileName: string;
  totalRows: number;
  headers: string[];
  mapping: { sourceColumn: string; targetField: string | null }[];
  confidence: number;
  unmappedColumns: string[];
  missingFields: string[];
  preview: Record<string, string>[];
  usedAi: boolean;
}

export async function fetchPreview(fileUrl: string, fileName: string): Promise<PreviewResponse> {
  const res = await fetch(`${PROXY}/upload/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl, fileName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to preview file");
  }
  return res.json();
}

export async function confirmUpload(
  fileUrl: string,
  fileName: string,
  mapping: { sourceColumn: string; targetField: string | null }[]
): Promise<{ insertedCount: number }> {
  const res = await fetch(`${PROXY}/upload/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileUrl, fileName, mapping }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Failed to confirm upload");
  }
  return res.json();
}
