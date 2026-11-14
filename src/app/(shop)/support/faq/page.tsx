"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/faq").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">FAQ</h1><MockBadge /></div>
      <p className="text-sm text-muted">Infinite scroll simulated as full list (20/page policy mock)</p>
      {items.map((item: any) => (
        <Link key={item.id} href={"/support/faq/"+item.id} className="panel block p-4 hover:border-brand/40">
          <p className="text-xs text-muted">{item.noticeType || item.category || item.status || ""}</p>
          <p className="font-semibold">{item.title || item.question || item.description}</p>
        </Link>
      ))}
      <Link href="/support" className="text-sm text-brand">Customer center</Link>
    </div>
  );
}
