"use client";

import { ItemCard } from "./item-card";
import { Package } from "lucide-react";
import Link from "next/link";
import type { Item } from "@/services/items";

interface ItemsGridProps {
  items: Item[];
  onDelete: (item: Item) => void;
}

export function ItemsGrid({ items, onDelete }: ItemsGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Package className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700">No items found</p>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or{" "}
          <Link href="/add-items" className="text-indigo-600 hover:underline">upload some data</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
