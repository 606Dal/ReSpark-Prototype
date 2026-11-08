"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { fetchWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import type { WishItem } from "@/types";

export default function WishlistPage() {
  const router = useRouter();
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
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Wishlist</h1>
      {error && <p className="text-rose-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) =>
          item.product ? (
            <Link key={item.id} href={`/products/${item.product.id}`} className="panel overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product.media[0]?.url}
                alt=""
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-1 p-4">
                <ProductStatusBadge status={item.product.status} />
                <p className="font-semibold">{item.product.title}</p>
                <p className="text-brand font-bold">{formatUsd(item.product.price)}</p>
              </div>
            </Link>
          ) : null
        )}
      </div>
      {items.length === 0 && !error && (
        <p className="panel p-8 text-center text-muted">No wishlisted products yet.</p>
      )}
    </div>
  );
}
