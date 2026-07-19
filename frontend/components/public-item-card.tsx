import Link from "next/link";
import { Eye } from "lucide-react";

interface PublicItemCardProps {
  _id: string;
  productName?: string;
  category?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
}

export function PublicItemCard({ _id, productName, category, price, description, imageUrl }: PublicItemCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName || "Product image"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Eye className="h-8 w-8 text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {category && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
            {category}
          </span>
        )}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">
          {productName || "Untitled Product"}
        </h3>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {price && (
            <span className="text-sm font-semibold text-slate-900">
              ${parseFloat(price).toFixed(2)}
            </span>
          )}
          <Link
            href={`/items/${_id}`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            View Details
            <Eye size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
