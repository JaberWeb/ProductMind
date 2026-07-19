"use client";

import { Search } from "lucide-react";
import type { Item } from "@/services/content";

interface ItemSelectorProps {
  items: Item[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading: boolean;
}

export function ItemSelector({ items, selectedId, onSelect, loading }: ItemSelectorProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={16} />
      </div>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
      >
        <option value="">{loading ? "Loading items..." : "Select an item..."}</option>
        {items.map((item) => (
          <option key={item._id} value={item._id}>
            {item.productName || "Unnamed product"}
            {item.category ? ` (${item.category})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
