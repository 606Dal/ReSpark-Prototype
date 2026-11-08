import Link from "next/link";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const thumb = product.media.find((m) => m.thumbnailed) ?? product.media[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="panel group overflow-hidden rise transition hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(18,35,28,0.08)]"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#dfeae4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb?.url}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">
          {product.country} · {product.condition}
        </p>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug">
          {product.title}
        </h3>
        <p className="display text-lg font-bold text-brand">{formatUsd(product.price)}</p>
      </div>
    </Link>
  );
}
