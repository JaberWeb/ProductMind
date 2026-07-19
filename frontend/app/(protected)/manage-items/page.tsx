"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, AlertCircle, RefreshCw, Upload } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";
import { ViewToggle } from "@/components/view-toggle";
import { ItemsTable } from "@/components/items-table";
import { ItemsGrid } from "@/components/items-grid";
import { Pagination } from "@/components/pagination";
import { DeleteModal } from "@/components/delete-modal";
import {
  fetchItems,
  deleteItem,
  type Item,
} from "@/services/items";

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex gap-6">
          {[200, 120, 80, 100, 100, 80].map((w, i) => (
            <div key={i} className="h-3 animate-shimmer rounded" style={{ width: w }} />
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b border-slate-100 p-4">
          {[180, 100, 60, 80, 80, 40].map((w, j) => (
            <div key={j} className="h-3 animate-shimmer rounded" style={{ width: w }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 h-4 w-3/4 animate-shimmer rounded" />
          <div className="mb-2 h-3 w-1/2 animate-shimmer rounded" />
          <div className="h-3 w-1/3 animate-shimmer rounded" />
        </div>
      ))}
    </div>
  );
}

export default function ManageItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "grid">("table");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchItems({ page, limit: 12, search });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteItem(deleteTarget._id);
      setDeleteTarget(null);
      loadItems();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <Package className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Items</h1>
          <p className="text-sm text-slate-500">
            {total} {total === 1 ? "item" : "items"} total
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-sm">
          <SearchInput value={search} onChange={handleSearchChange} />
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Failed to load items</p>
              <p className="mt-0.5 text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={loadItems}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        </div>
      )}

      {loading ? (
        view === "table" ? <TableSkeleton /> : <GridSkeleton />
      ) : !error && items.length === 0 && !search ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <Package className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No items yet</h3>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first CSV or Excel file to get started.
          </p>
          <Link
            href="/add-items"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <Upload size={16} />
            Upload Data
          </Link>
        </div>
      ) : view === "table" ? (
        <ItemsTable items={items} onDelete={setDeleteTarget} />
      ) : (
        <ItemsGrid items={items} onDelete={setDeleteTarget} />
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <DeleteModal
        open={!!deleteTarget}
        itemName={deleteTarget?.productName || "this item"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
