"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
export default function Client() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  useEffect(() => {
    fetch("/api/admin/trades").then(r=>r.json()).then(j=>setItem((j.data||[]).find((x: any)=>String(x.id)===String(params.id))));
  }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold text-ink">Trade detail</h1><MockBadge /></div>
      <div className="panel space-y-2 p-5 text-sm text-ink">
        <div className="flex justify-between"><span>{item.purchaseUuid}</span><TradeStatusBadge status={item.tradeStatus} /></div>
        <p>Buyer {item.buyerUuid} · Seller {item.sellerUuid}</p>
        <p>Amount {item.amount} · Payment {item.paymentMethod}</p>
        <pre className="overflow-auto rounded bg-white p-3 text-xs">{JSON.stringify(item,null,2)}</pre>
      </div>
      <Link href="/admin/trades" className="btn btn-primary">Back</Link>
    </div>
  );
}
