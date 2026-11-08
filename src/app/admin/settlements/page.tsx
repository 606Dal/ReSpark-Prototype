"use client";

import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchAdminSettlements } from "@/lib/api/admin";
import { formatDate, formatUsd } from "@/lib/format";
import type { Settlement } from "@/types";

export default function AdminSettlementsPage() {
  const [items, setItems] = useState<Settlement[]>([]);

  useEffect(() => {
    fetchAdminSettlements().then((res) => setItems(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">Settlements</h1>
        <MockBadge label="NO PG" />
      </div>
      <p className="text-sm text-muted">
        Escrow / bank transfer integration is not connected. Displaying mock settlement rows only.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#eef6f2] text-muted">
            <tr>
              <th className="px-3 py-2">Seller</th>
              <th className="px-3 py-2">Gross</th>
              <th className="px-3 py-2">Fee</th>
              <th className="px-3 py-2">Net</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Requested</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-line">
                <td className="px-3 py-2">{s.sellerEmail}</td>
                <td className="px-3 py-2">{formatUsd(s.grossAmount)}</td>
                <td className="px-3 py-2">{formatUsd(s.feeAmount)}</td>
                <td className="px-3 py-2">{formatUsd(s.netAmount)}</td>
                <td className="px-3 py-2">{s.status}</td>
                <td className="px-3 py-2">{formatDate(s.requestedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
