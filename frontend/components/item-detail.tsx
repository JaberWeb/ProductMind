"use client";

import { Pencil, Package } from "lucide-react";
import type { Item } from "@/services/items";

interface ItemDetailProps {
  item: Item;
  onEdit: () => void;
}

const DETAIL_FIELDS = [
  { key: "productName", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", prefix: "$" },
  { key: "revenue", label: "Revenue", prefix: "$" },
  { key: "quantity", label: "Quantity" },
  { key: "orderId", label: "Order ID" },
  { key: "customerEmail", label: "Customer Email" },
  { key: "sourcePlatform", label: "Source Platform" },
  { key: "date", label: "Date" },
  { key: "sourceFile", label: "Source File" },
];

export function ItemDetail({ item, onEdit }: ItemDetailProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
            <Package className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {item.productName || "Unnamed Product"}
            </h2>
            <p className="text-xs text-slate-500">ID: {item._id}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
        >
          <Pencil size={15} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {DETAIL_FIELDS.map((field) => {
          const value = (item as any)[field.key];
          return (
            <div key={field.key}>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{field.label}</p>
              <p className="mt-1 text-sm text-slate-800">
                {value ? `${field.prefix || ""}${value}` : <span className="text-slate-300">&mdash;</span>}
              </p>
            </div>
          );
        })}
      </div>

      {item.generatedContent && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Generated Content</h3>
          <div className="space-y-3">
            {(["title", "description", "short_description", "seo", "social"] as const).map((type) => {
              const content = item.generatedContent?.[type];
              if (!content) return null;
              return (
                <div key={type} className="rounded-lg bg-slate-50 p-3">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                    {type.replace("_", " ")}
                  </p>
                  <p className="text-sm text-slate-700">{content}</p>
                </div>
              );
            })}
          </div>
          {item.generatedContent?.updatedAt && (
            <p className="mt-3 text-xs text-slate-400">
              Last updated: {new Date(item.generatedContent.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
