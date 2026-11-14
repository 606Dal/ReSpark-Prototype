"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Client() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/inquiries").then(r=>r.json()).then(j=>setItem((j.data||[]).find((x: any)=>String(x.id)===String(params.id)))); }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold">Inquiry #{item.id}</h1><MockBadge /></div>
      <div className="panel space-y-2 p-5 text-sm">
        <p className="text-muted">{item.status} · {item.inquiredAt}</p>
        <p className="whitespace-pre-wrap">{item.description}</p>
        <p className="font-semibold">Answer</p>
        <p>{item.answer || "Waiting for answer"}</p>
      </div>
      <Link href="/support/inquiries" className="text-sm text-brand">Back</Link>
    </div>
  );
}
