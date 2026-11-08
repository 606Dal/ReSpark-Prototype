"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { createChat } from "@/lib/api/chats";
import { fetchProduct } from "@/lib/api/products";
import { toggleWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import { formatDate, formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export function ProductDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    fetchProduct(params.id)
      .then((res) => setProduct(res.data))
      .catch((e: Error) => setError(e.message));
  }, [params.id]);

  async function onWish() {
    const user = readUser();
    if (!user || !product) {
      router.push("/login");
      return;
    }
    setBusy("wish");
    try {
      await toggleWishlist(user.uuid, product.id);
      alert("Wishlist updated (mock)");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy("");
    }
  }

  async function onChat() {
    if (!product) return;
    const user = readUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setBusy("chat");
    try {
      const res = await createChat(product.id);
      router.push(`/chat/${res.data.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy("");
    }
  }

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!product) return <p className="text-muted">Loading product...</p>;

  const thumb = product.media[0];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="panel overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb?.url} alt={product.title} className="aspect-square w-full object-cover" />
      </div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <ProductStatusBadge status={product.status} />
          <MockBadge label="USD ONLY" />
        </div>
        <h1 className="display text-3xl font-bold leading-tight">{product.title}</h1>
        <p className="display text-3xl font-extrabold text-brand">{formatUsd(product.price)}</p>
        <p className="text-sm text-muted">
          {product.country} · {product.condition} · {product.viewCount} views · listed{" "}
          {formatDate(product.createdAt)}
        </p>
        <p className="leading-relaxed text-[#31453c]">{product.description}</p>
        <div className="panel p-4 text-sm">
          <p className="font-semibold">Seller</p>
          <p>{product.sellerNickname}</p>
          <p className="text-muted">
            Delivery fee: {product.deliveryFee ? "Included" : "Separate"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-ghost" onClick={onWish} disabled={busy === "wish"}>
            Like / Wishlist
          </button>
          <button className="btn btn-primary" onClick={onChat} disabled={busy === "chat"}>
            Chat
          </button>
          {product.status === "ON_SALE" ? (
            <Link href={`/payment/${product.id}`} className="btn btn-spark">
              Buy now
            </Link>
          ) : (
            <span className="btn cursor-not-allowed bg-zinc-200 text-zinc-500">
              Not available
            </span>
          )}
        </div>
        <p className="text-xs text-muted">
          Price chart / translation APIs are not implemented in stage 1.
        </p>
      </div>
    </div>
  );
}
