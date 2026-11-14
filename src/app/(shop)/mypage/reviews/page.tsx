"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";

type ReviewRow = {
  id: number;
  productTitle: string;
  rating: number;
  content: string;
  authorNickname: string;
  createdAt: string;
};

export default function Page() {
  const { t } = useI18n();
  const [items, setItems] = useState<ReviewRow[]>([]);
  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((j) => setItems(j.data || []));
  }, []);
  const avg = items.length
    ? (items.reduce((s, i) => s + i.rating, 0) / items.length).toFixed(1)
    : "0.0";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">{t("mypage.reviews")}</h1>
          <MockBadge />
        </div>
        <Link href="/reviews/new" className="btn btn-primary h-10">
          {t("mypage.writeReview")}
        </Link>
      </div>
      <p className="text-sm text-muted">
        {items.length} · ★ {avg}
      </p>
      {items.map((r) => (
        <article key={r.id} className="panel p-4 text-sm">
          <p className="font-semibold">
            {r.productTitle} · ★{r.rating}
          </p>
          <p>{r.content}</p>
          <p className="text-xs text-muted">
            {r.authorNickname} · {r.createdAt}
          </p>
        </article>
      ))}
      {items.length === 0 && (
        <p className="panel p-6 text-center text-muted">{t("mypage.emptyReviews")}</p>
      )}
    </div>
  );
}
