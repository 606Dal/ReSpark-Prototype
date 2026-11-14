"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SafeImage } from "@/components/common/SafeImage";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchSales } from "@/lib/api/purchases";
import { readUser } from "@/lib/auth/session";
import { formatDate, formatUsd } from "@/lib/format";
import type { Purchase } from "@/types";

export default function SalesPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [items, setItems] = useState<Purchase[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = readUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchSales(user.uuid)
      .then((res) => setItems(res.data))
      .catch((e: Error) => setError(e.message));
  }, [router]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="display text-3xl font-bold">{t("mypage.sales")}</h1>
      {error && <p className="text-rose-700">{error}</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/mypage/sales/${item.id}`}
            className="panel flex flex-wrap items-center gap-4 p-4 transition hover:border-brand/40"
          >
            <SafeImage
              src={item.product?.media[0]?.url}
              alt={item.product?.title || ""}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.product?.title}</p>
              <p className="text-sm text-muted">
                {item.purchaseUuid} · {formatDate(item.createdAt)}
              </p>
            </div>
            <TradeStatusBadge status={item.tradeStatus} />
            <p className="font-bold text-brand">{formatUsd(item.amount ?? 0)}</p>
          </Link>
        ))}
        {items.length === 0 && !error && (
          <p className="panel p-8 text-center text-muted">{t("mypage.emptySales")}</p>
        )}
      </div>
    </div>
  );
}
