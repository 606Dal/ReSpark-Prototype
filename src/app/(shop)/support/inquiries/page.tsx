"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    fetch("/api/admin/inquiries").then(r=>r.json()).then(j=>setItems((j.data||[]).filter((x: any)=>x.userId===u.id)));
  }, [router]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">My inquiries</h1><MockBadge /></div>
        <Link href="/support/inquiries/new" className="btn btn-primary">New</Link>
      </div>
      {items.map((i: any) => (
        <Link key={i.id} href={"/support/inquiries/"+i.id} className="panel block p-4">
          <p className="text-xs text-muted">{i.status} · {i.inquiredAt}</p>
          <p className="font-semibold">{i.title || i.description}</p>
        </Link>
      ))}
      {items.length===0 && <p className="panel p-6 text-center text-muted">No inquiries</p>}
    </div>
  );
}
