"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Client() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  useEffect(() => { fetch("/api/notices").then(r=>r.json()).then(j=>setItem((j.data||[]).find((x: any)=>String(x.id)===String(params.id)))); }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold">{item.title}</h1><MockBadge /></div>
      <p className="text-xs text-muted">{item.noticeType} · {item.createdAt}</p>
      <div className="panel p-5 text-sm whitespace-pre-wrap">{item.content}</div>
      <Link href="/support/notices" className="text-sm text-brand">Back</Link>
    </div>
  );
}
