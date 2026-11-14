"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function TermsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/terms").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Terms</h1><MockBadge /></div>
      {items.map((item: any) => (
        <article key={item.id} className="panel space-y-2 p-5">
          <h2 className="font-semibold">{item.title} <span className="text-xs text-muted">v{item.version}</span></h2>
          <p className="text-sm whitespace-pre-wrap">{item.content}</p>
        </article>
      ))}
    </div>
  );
}
