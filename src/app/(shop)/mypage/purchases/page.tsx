"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { fetchPurchases } from "@/lib/api/purchases";
import { readUser } from "@/lib/auth/session";
import { formatDate, formatUsd } from "@/lib/format";
import type { Purchase } from "@/types";

export default function PurchasesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Purchase[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = readUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchPurchases(user.uuid)
      .then((res) => setItems(res.data))
      .catch((e: Error) => setError(e.message));
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="display text-3xl font-bold">Purchase history</h1>
      {error && <p className="text-rose-700">{error}</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/mypage/purchases/${item.id}`}
            className="panel flex flex-wrap items-center gap-4 p-4 transition hover:border-brand/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.product?.media[0]?.url}
              alt=""
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.product?.title ?? "Product"}</p>
              <p className="text-sm text-muted">
                {item.purchaseUuid} · {formatDate(item.createdAt)}
              </p>
            </div>
            <TradeStatusBadge status={item.tradeStatus} />
            <p className="font-bold text-brand">{formatUsd(item.amount ?? 0)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
