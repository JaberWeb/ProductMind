interface PreviewTableProps {
  headers: string[];
  rows: Record<string, string>[];
}

export function PreviewTable({ headers, rows }: PreviewTableProps) {
  if (!rows.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="table table-zebra table-xs">
        <thead>
          <tr className="bg-slate-50">
            {headers.map((h) => (
              <th key={h} className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {headers.map((h) => (
                <td key={h} className="max-w-[200px] truncate text-sm text-slate-700">
                  {row[h] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
