"use client";

const TARGET_FIELDS = [
  { value: "orderId", label: "Order ID" },
  { value: "productName", label: "Product Name" },
  { value: "quantity", label: "Quantity" },
  { value: "price", label: "Price" },
  { value: "revenue", label: "Revenue" },
  { value: "date", label: "Date" },
  { value: "category", label: "Category" },
  { value: "customerEmail", label: "Customer Email" },
  { value: "sourcePlatform", label: "Source Platform" },
];

interface ColumnMapperProps {
  mapping: { sourceColumn: string; targetField: string | null }[];
  onChange: (mapping: { sourceColumn: string; targetField: string | null }[]) => void;
}

export function ColumnMapper({ mapping, onChange }: ColumnMapperProps) {
  const setTarget = (sourceColumn: string, targetField: string | null) => {
    onChange(
      mapping.map((m) => (m.sourceColumn === sourceColumn ? { ...m, targetField } : m))
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">
        Map your columns to the standard schema:
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="table table-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Source Column
              </th>
              <th className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Target Field
              </th>
            </tr>
          </thead>
          <tbody>
            {mapping.map((m) => (
              <tr key={m.sourceColumn}>
                <td className="text-sm font-medium text-slate-700">{m.sourceColumn}</td>
                <td>
                  <select
                    value={m.targetField || ""}
                    onChange={(e) => setTarget(m.sourceColumn, e.target.value || null)}
                    className="select select-bordered select-sm w-full max-w-xs"

                  >
                    <option value="">-- Skip --</option>
                    {TARGET_FIELDS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
