"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { cancelPurchase, confirmPurchase, fetchPurchase } from "@/lib/api/purchases";
import { formatDate, formatUsd } from "@/lib/format";
import type { Purchase } from "@/types";

export function PurchaseDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Purchase | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPurchase(params.id)
      .then((res) => setItem(res.data))
      .catch((e: Error) => setError(e.message));
  }, [params.id]);

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!item) return <p className="text-muted">Loading order...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">Order detail</h1>
        <MockBadge />
      </div>

      <div className="panel space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">{item.purchaseUuid}</p>
          <TradeStatusBadge status={item.tradeStatus} />
        </div>
        <div className="flex gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.product?.media[0]?.url}
            alt=""
            className="h-24 w-24 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold">{item.product?.title}</p>
            <p className="text-brand font-bold">{formatUsd(item.amount ?? 0)}</p>
            <p className="text-sm text-muted">{formatDate(item.createdAt)}</p>
          </div>
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p>Payment: {item.paymentMethod}</p>
          <p>Tracking: {item.trackingNumber ?? "Pending"}</p>
        </div>
      </div>

      {item.tradeStatus === "IN_PROGRESS" && (
        <div className="panel space-y-4 p-6">
          <button
            className="btn btn-primary"
            onClick={async () => {
              const res = await confirmPurchase(item.id);
              setItem(res.data);
            }}
          >
            Confirm purchase
          </button>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Cancel trade (min 10 chars)</p>
            <textarea
              className="input min-h-24"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain cancel reason..."
            />
            <button
              className="btn btn-ghost text-rose-700"
              onClick={async () => {
                try {
                  const res = await cancelPurchase(item.id, reason);
                  setItem(res.data);
                } catch (e) {
                  alert(e instanceof Error ? e.message : "Failed");
                }
              }}
            >
              Request cancel
            </button>
          </div>
        </div>
      )}

      <button className="btn btn-ghost" onClick={() => router.push("/mypage/purchases")}>
        Back to list
      </button>
    </div>
  );
}
