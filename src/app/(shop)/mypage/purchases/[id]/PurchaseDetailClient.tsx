"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { SafeImage } from "@/components/common/SafeImage";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { confirmPurchase, fetchPurchase } from "@/lib/api/purchases";
import { formatDate, formatUsd } from "@/lib/format";
import type { Purchase, Review } from "@/types";

export function PurchaseDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const [item, setItem] = useState<Purchase | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchPurchase(params.id)
      .then((res) => {
        setItem(res.data);
        const productId = res.data.productId;
        return fetch(`/api/reviews?productId=${productId}`).then((r) => r.json());
      })
      .then((j) => {
        if (j?.success) setReviews(j.data || []);
      })
      .catch((e: Error) => setError(e.message));
  }, [params.id]);

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!item) return <p className="text-muted">{t("common.loading")}</p>;

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("mypage.purchaseDetail")}</h1>
        <MockBadge />
      </div>

      <div className="panel space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">{item.purchaseUuid}</p>
          <TradeStatusBadge status={item.tradeStatus} />
        </div>
        <div className="flex gap-4">
          <SafeImage
            src={item.product?.media[0]?.url}
            alt={item.product?.title || ""}
            className="h-24 w-24 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">{item.product?.title}</p>
            <p className="font-bold text-brand">{formatUsd(item.amount ?? 0)}</p>
            <p className="text-sm text-muted">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p>
            {t("mypage.payment")}: {item.paymentMethod}
          </p>
          <p>
            {t("mypage.tracking")}: {item.trackingNumber ?? "—"}
          </p>
        </div>
      </div>

      <div className="panel flex flex-wrap gap-3 p-6">
        {item.tradeStatus === "IN_PROGRESS" && (
          <>
            <button
              className="btn btn-primary"
              disabled={confirming}
              onClick={async () => {
                setConfirming(true);
                try {
                  const res = await confirmPurchase(item.id);
                  setItem(res.data);
                } finally {
                  setConfirming(false);
                }
              }}
            >
              {confirming ? t("common.processing") : t("mypage.confirmPurchase")}
            </button>
            <Link
              href={`/mypage/purchases/${item.id}/cancel`}
              className="btn btn-ghost text-rose-700"
            >
              {t("mypage.cancelTrade")}
            </Link>
          </>
        )}

        {item.tradeStatus === "CONFIRMED" && (
          <Link
            href={`/reviews/new?purchaseId=${item.id}&productId=${item.productId}`}
            className="btn btn-primary"
          >
            {t("mypage.writeReview")}
          </Link>
        )}
      </div>

      <section className="panel space-y-3 p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="display text-xl font-bold">{t("mypage.productReviews")}</h2>
          <p className="text-sm text-muted">
            {reviews.length}
            {avg ? ` · ★ ${avg}` : ""}
          </p>
        </div>
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            {t("mypage.emptyProductReviews")}
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <article key={r.id} className="rounded-xl border border-line bg-[#f7fbf9] p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">★ {r.rating}</p>
                  <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                </div>
                <p className="mt-1 text-muted">{r.authorNickname}</p>
                {r.content && <p className="mt-2 whitespace-pre-wrap">{r.content}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <button className="btn btn-ghost" onClick={() => router.push("/mypage/purchases")}>
        {t("common.back")}
      </button>
    </div>
  );
}
