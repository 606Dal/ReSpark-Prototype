"use client";

import { useEffect, useState } from "react";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { fetchAdminTrades } from "@/lib/api/admin";
import { formatDate, formatUsd } from "@/lib/format";
import type { Purchase } from "@/types";

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<Purchase[]>([]);

  useEffect(() => {
    fetchAdminTrades().then((res) => setTrades(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="display text-3xl font-bold">Trade management</h1>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#eef6f2] text-muted">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <td className="px-3 py-2">{t.purchaseUuid}</td>
                <td className="px-3 py-2">{t.product?.title}</td>
                <td className="px-3 py-2">
                  <TradeStatusBadge status={t.tradeStatus} />
                </td>
                <td className="px-3 py-2">{formatUsd(t.amount ?? 0)}</td>
                <td className="px-3 py-2">{formatDate(t.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
