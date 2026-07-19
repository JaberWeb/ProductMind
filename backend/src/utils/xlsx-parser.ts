import * as XLSX from "xlsx";

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseXlsx(buffer: Buffer): ParsedSheet {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Excel file has no sheets");

  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
    defval: "",
    raw: false,
  });

  if (!json.length) throw new Error("Excel sheet is empty");

  const headers = Object.keys(json[0]);
  return { headers, rows: json };
}
