"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchPurchase } from "@/lib/api/purchases";
import { formatUsd } from "@/lib/format";
import type { Purchase } from "@/types";

export default function Client() {
  const params = useParams();
  const { t } = useI18n();
  const [item, setItem] = useState<Purchase | null>(null);

  useEffect(() => {
    fetchPurchase(String(params.id))
      .then((r) => setItem(r.data))
      .catch(() => undefined);
  }, [params.id]);

  if (!item) return <p className="text-muted">{t("common.loading")}</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("mypage.saleDetail")}</h1>
        <MockBadge />
      </div>
      <div className="panel space-y-3 p-5">
        <div className="flex justify-between gap-2">
          <p className="font-semibold">{item.purchaseUuid}</p>
          <TradeStatusBadge status={item.tradeStatus} />
        </div>
        <p>{item.product?.title}</p>
        <p className="font-bold text-brand">{formatUsd(item.amount || 0)}</p>
        <div className="grid gap-1 text-sm md:grid-cols-2">
          <p>
            {t("mypage.buyer")}: {item.buyerUuid}
          </p>
          <p>
            {t("mypage.tracking")}: {item.trackingNumber || "—"}
          </p>
          <p>
            {t("mypage.payment")}: {item.paymentMethod}
          </p>
          <p>{t("mypage.settlementNote")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/reviews/new" className="btn btn-ghost">
            {t("mypage.writeReview")}
          </Link>
          <Link href={`/mypage/purchases/${item.id}/cancel`} className="btn btn-ghost text-rose-700">
            {t("mypage.cancelTrade")}
          </Link>
        </div>
      </div>
    </div>
  );
}
