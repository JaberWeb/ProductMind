import { parse } from "csv-parse/sync";

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsv(buffer: Buffer): ParsedSheet {
  const raw = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  if (!raw.length) throw new Error("CSV file is empty");

  const headers = Object.keys(raw[0]);
  return { headers, rows: raw };
}
