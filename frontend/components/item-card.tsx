"use client";

import { Eye, Trash2, Package } from "lucide-react";
import Link from "next/link";
import type { Item } from "@/services/items";

interface ItemCardProps {
  item: Item;
  onDelete: (item: Item) => void;
}

export function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
          <Package size={18} className="text-indigo-600" />
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/manage-items/${item._id}`}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => onDelete(item)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="mb-2 truncate text-sm font-semibold text-slate-900">
        {item.productName || "Unnamed Product"}
      </h3>

      <div className="space-y-1.5 text-xs text-slate-500">
        {item.category && (
          <div className="flex items-center justify-between">
            <span>Category</span>
            <span className="font-medium text-slate-700">{item.category}</span>
          </div>
        )}
        {item.price && (
          <div className="flex items-center justify-between">
            <span>Price</span>
            <span className="font-medium text-slate-700">${item.price}</span>
          </div>
        )}
        {item.sourcePlatform && (
          <div className="flex items-center justify-between">
            <span>Platform</span>
            <span className="font-medium text-slate-700">{item.sourcePlatform}</span>
          </div>
        )}
        {item.date && (
          <div className="flex items-center justify-between">
            <span>Date</span>
            <span className="font-medium text-slate-700">{item.date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
