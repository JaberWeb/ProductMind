"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import type { Item } from "@/services/items";

interface ItemEditFormProps {
  item: Item;
  onSave: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}

const EDITABLE_FIELDS = [
  { key: "productName", label: "Product Name", required: true },
  { key: "category", label: "Category", required: false },
  { key: "price", label: "Price", required: false },
  { key: "revenue", label: "Revenue", required: false },
  { key: "quantity", label: "Quantity", required: false },
  { key: "orderId", label: "Order ID", required: false },
  { key: "customerEmail", label: "Customer Email", required: false },
  { key: "sourcePlatform", label: "Source Platform", required: false },
  { key: "date", label: "Date", required: false },
];

export function ItemEditForm({ item, onSave, onCancel }: ItemEditFormProps) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      initial[field.key] = (item as any)[field.key] || "";
    }
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      if (field.required && !form[field.key].trim()) {
        next[field.key] = `${field.label} is required`;
      }
    }
    if (form.price && (isNaN(Number(form.price)) || Number(form.price) < 0)) {
      next.price = "Price must be a positive number";
    }
    if (form.revenue && (isNaN(Number(form.revenue)) || Number(form.revenue) < 0)) {
      next.revenue = "Revenue must be a positive number";
    }
    if (form.quantity && (isNaN(Number(form.quantity)) || Number(form.quantity) < 0)) {
      next.quantity = "Quantity must be a positive number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {EDITABLE_FIELDS.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-xs font-medium text-slate-600">
            {field.label}
            {field.required && <span className="ml-0.5 text-red-400">*</span>}
          </label>
          <input
            type="text"
            value={form[field.key]}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, [field.key]: e.target.value }));
              if (errors[field.key]) setErrors((prev) => ({ ...prev, [field.key]: "" }));
            }}
            className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
              errors[field.key]
                ? "border-red-300 focus:border-red-400"
                : "border-slate-200 focus:border-indigo-300"
            }`}
          />
          {errors[field.key] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.key]}</p>
          )}
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={16} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
