"use client";

import { Eye, Trash2, Package } from "lucide-react";
import Link from "next/link";
import type { Item } from "@/services/items";

interface ItemsTableProps {
  items: Item[];
  onDelete: (item: Item) => void;
}

export function ItemsTable({ items, onDelete }: ItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Package className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700">No items found</p>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or upload some data to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-5 py-3">Product</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Price</th>
            <th className="px-5 py-3">Platform</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item._id} className="transition-colors hover:bg-slate-50">
              <td className="max-w-[200px] truncate px-5 py-3.5 font-medium text-slate-900">
                {item.productName || "Unnamed Product"}
              </td>
              <td className="px-5 py-3.5 text-slate-600">
                {item.category || <span className="text-slate-300">&mdash;</span>}
              </td>
              <td className="px-5 py-3.5 text-slate-600">
                {item.price ? `$${item.price}` : <span className="text-slate-300">&mdash;</span>}
              </td>
              <td className="px-5 py-3.5 text-slate-600">
                {item.sourcePlatform || <span className="text-slate-300">&mdash;</span>}
              </td>
              <td className="px-5 py-3.5 text-slate-600">
                {item.date || <span className="text-slate-300">&mdash;</span>}
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="inline-flex gap-1">
                  <Link
                    href={`/manage-items/${item._id}`}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
