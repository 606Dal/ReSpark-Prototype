"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconHeart } from "@/components/common/Icons";
import { MockBadge } from "@/components/common/MockBadge";
import { SafeImage } from "@/components/common/SafeImage";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/components/providers/LocaleProvider";
import { createChat } from "@/lib/api/chats";
import { fetchProduct } from "@/lib/api/products";
import { toggleWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import { formatDate, formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export function ProductDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { push } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [wished, setWished] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [mediaIdx, setMediaIdx] = useState(0);

  useEffect(() => {
    fetchProduct(params.id)
      .then((res) => setProduct(res.data))
      .catch((e: Error) => setError(e.message));

    const user = readUser();
    if (!user) return;
    fetch(`/api/wishlist?userUuid=${user.uuid}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        const id = Number(params.id);
        setWished((j.data as { productId: number }[]).some((w) => w.productId === id));
      })
      .catch(() => undefined);
  }, [params.id]);

  async function ensureUser() {
    const user = readUser();
    if (!user) {
      router.push("/login");
      return null;
    }
    return user;
  }

  async function onWish() {
    const user = await ensureUser();
    if (!user || !product) return;
    setBusy("wish");
    try {
      const res = await toggleWishlist(user.uuid, product.id);
      const nextWished = Boolean((res.data as { wished?: boolean })?.wished);
      setWished(nextWished);
      const refreshed = await fetchProduct(product.id);
      setProduct(refreshed.data);
      push(t("common.success"), "ok");
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.error"), "err");
    } finally {
      setBusy("");
    }
  }

  async function openChat(withPurchaseRequest = false) {
    const user = await ensureUser();
    if (!user || !product) return;
    setBusy(withPurchaseRequest ? "buy" : "chat");
    try {
      const res = await createChat(product.id);
      // attach buyer uuid via recreate if API supports - patch chat action after
      if (withPurchaseRequest) {
        await fetch(`/api/chats/${res.data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "purchase_request", actorId: user.id }),
        });
      }
      router.push(`/chat/${res.data.id}`);
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.error"), "err");
    } finally {
      setBusy("");
    }
  }

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!product) return <p className="text-muted">{t("common.loading")}</p>;

  const media = product.media[mediaIdx] ?? product.media[0];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="panel overflow-hidden">
          <SafeImage
            src={media?.url}
            alt={product.title}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {product.media.map((m, i) => (
            <button
              key={m.id}
              type="button"
              className={`h-16 w-16 overflow-hidden rounded-lg border ${i === mediaIdx ? "border-brand" : "border-line"}`}
              onClick={() => setMediaIdx(i)}
            >
              <SafeImage src={m.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <ProductStatusBadge status={product.status} />
          <MockBadge label={t("products.priceUsdOnly")} />
        </div>
        <h1 className="display text-3xl font-bold leading-tight">{product.title}</h1>
        <p className="display text-3xl font-extrabold text-brand">{formatUsd(product.price)}</p>
        <p className="text-sm text-muted">
          {product.country} · {product.condition} · {product.viewCount} {t("products.views")} ·{" "}
          {product.likeCount} {t("products.wishes")} · {formatDate(product.createdAt)}
        </p>
        <p className="leading-relaxed text-[#31453c]">{product.description}</p>
        <div className="panel space-y-1 p-4 text-sm">
          <p className="font-semibold">{t("products.seller")}</p>
          <p>{product.sellerNickname}</p>
          <p className="text-muted">
            {t("products.rating")} {product.sellerRatingAvg ?? 4.5} · {t("products.reviewCount")}{" "}
            {product.sellerReviewCount ?? 0} · {t("products.tradeCount")}{" "}
            {product.sellerTradeCount ?? 0}
          </p>
          <p className="text-muted">
            {product.deliveryFee ? t("products.deliveryIncluded") : t("products.deliverySeparate")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className={`btn inline-flex items-center gap-1.5 ${
              wished ? "bg-spark text-white hover:bg-[#d45203]" : "btn-ghost"
            }`}
            onClick={onWish}
            disabled={busy === "wish"}
            aria-pressed={wished}
            aria-label={wished ? t("products.unwish") : t("products.wish")}
          >
            <IconHeart
              className={`h-4 w-4 ${wished ? "fill-white text-white" : ""}`}
              aria-hidden
            />
            {wished ? t("products.unwish") : t("products.wish")}
            <span>· {product.likeCount}</span>
          </button>
          <button className="btn btn-primary" onClick={() => openChat(false)} disabled={!!busy}>
            {t("products.chat")}
          </button>
          {product.status === "ON_SALE" ? (
            <button className="btn btn-spark" onClick={() => openChat(true)} disabled={!!busy}>
              {t("products.buy")}
            </button>
          ) : (
            <span className="btn cursor-not-allowed bg-zinc-200 text-zinc-500">
              {t("products.notAvailable")}
            </span>
          )}
          <Link
            href={`/report?type=PRODUCT&targetUuid=${product.id}&productId=${product.id}`}
            className="btn btn-ghost"
          >
            {t("products.report")}
          </Link>
        </div>
        <p className="text-xs text-muted">{t("common.mockNotice")}</p>
      </div>
    </div>
  );
}
