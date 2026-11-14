"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SafeImage } from "@/components/common/SafeImage";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import type { WishItem } from "@/types";

export default function WishlistPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [items, setItems] = useState<WishItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = readUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchWishlist(user.uuid)
      .then((res) => setItems(res.data))
      .catch((e: Error) => setError(e.message));
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="display text-3xl font-bold">{t("mypage.wishlist")}</h1>
      {error && <p className="text-rose-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) =>
          item.product ? (
            <Link key={item.id} href={`/products/${item.product.id}`} className="panel overflow-hidden">
              <SafeImage
                src={item.product.media[0]?.url}
                alt={item.product.title}
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <ProductStatusBadge status={item.product.status} />
                <p className="line-clamp-2 font-semibold">{item.product.title}</p>
                <p className="font-bold text-brand">{formatUsd(item.product.price)}</p>
              </div>
            </Link>
          ) : null
        )}
      </div>
      {items.length === 0 && !error && (
        <p className="panel p-8 text-center text-muted">{t("mypage.emptyWishlist")}</p>
      )}
    </div>
  );
}
