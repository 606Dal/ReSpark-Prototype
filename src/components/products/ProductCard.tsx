"use client";

import Link from "next/link";
import { IconHeart } from "@/components/common/Icons";
import { SafeImage } from "@/components/common/SafeImage";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({
  product,
  index = 0,
  onWish,
  wished = false,
}: {
  product: Product;
  index?: number;
  onWish?: (productId: number) => void;
  wished?: boolean;
}) {
  const { t } = useI18n();
  const thumb = product.media.find((m) => m.thumbnailed) ?? product.media[0];

  return (
    <div
      className="panel group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-brand/30"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-[#dfeae4]"
      >
        <SafeImage
          src={thumb?.url}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <ProductStatusBadge status={product.status} />
        </div>
      </Link>

      {onWish && (
        <button
          type="button"
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold shadow-sm transition ${
            wished
              ? "bg-spark text-white"
              : "bg-white/95 text-muted hover:text-spark"
          }`}
          aria-label={wished ? t("products.unwish") : t("products.wish")}
          aria-pressed={wished}
          title={wished ? t("products.unwish") : t("products.wish")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWish(product.id);
          }}
        >
          <IconHeart
            className={`h-4 w-4 ${wished ? "fill-white text-white" : "text-muted"}`}
            aria-hidden
          />
          <span>{product.likeCount}</span>
        </button>
      )}

      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col space-y-1.5 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">
          {product.country} · {product.condition}
        </p>
        <h3 className="line-clamp-2 min-h-[2.6em] text-[15px] font-semibold leading-snug">
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="display text-lg font-bold text-brand">{formatUsd(product.price)}</p>
          <p
            className={`inline-flex items-center gap-1 text-xs ${
              wished ? "font-semibold text-spark" : "text-muted"
            }`}
            aria-label={`${t("products.wishes")} ${product.likeCount}`}
          >
            <IconHeart
              className={`h-3.5 w-3.5 ${wished ? "fill-spark text-spark" : "text-spark"}`}
              aria-hidden
            />
            {product.likeCount}
          </p>
        </div>
      </Link>
    </div>
  );
}
