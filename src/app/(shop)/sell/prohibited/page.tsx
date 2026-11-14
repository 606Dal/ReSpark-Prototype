"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function ProhibitedPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { fetch("/api/prohibited").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Prohibited items</h1><MockBadge /></div>
      <ul className="panel space-y-2 p-5 text-sm">{items.map((x,i)=><li key={i}>• {x}</li>)}</ul>
      <Link href="/sell" className="btn btn-primary">Back</Link>
    </div>
  );
}
