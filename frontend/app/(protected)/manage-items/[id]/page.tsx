"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ItemDetail } from "@/components/item-detail";
import { ItemEditForm } from "@/components/item-edit-form";
import { DeleteModal } from "@/components/delete-modal";
import {
  fetchItem,
  updateItem,
  deleteItem,
  type Item,
} from "@/services/items";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadItem = () => {
    if (!id) return;
    setLoading(true);
    setError("");
    fetchItem(id)
      .then(setItem)
      .catch((err) => setError(err.message || "Failed to load item"))
      .finally(() => setLoading(false));
  };

  useEffect(loadItem, [id]);

  const handleSave = async (data: Record<string, string>) => {
    await updateItem(id, data);
    const updated = await fetchItem(id);
    setItem(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItem(id);
      router.push("/manage-items");
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-shimmer rounded" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 h-6 w-48 animate-shimmer rounded" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 w-24 animate-shimmer rounded" />
                <div className="h-4 w-48 animate-shimmer rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Failed to load item</p>
            <p className="mt-0.5 text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={loadItem}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/manage-items"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Items
        </Link>
        <button
          onClick={() => setShowDelete(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>

      {editing ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Edit Item</h2>
          <ItemEditForm
            item={item}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <ItemDetail item={item} onEdit={() => setEditing(true)} />
      )}

      <DeleteModal
        open={showDelete}
        itemName={item.productName || "this item"}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
