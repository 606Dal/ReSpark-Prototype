"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Client() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/admin/members").then(r=>r.json()).then(j=>setItem((j.data||[]).find((x: any)=>String(x.id)===String(params.id) || x.uuid===params.id)));
  }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold text-ink">Member detail</h1><MockBadge /></div>
      <div className="panel space-y-2 p-5 text-sm text-ink">
        <p><b>{item.nickname}</b> · {item.email}</p>
        <p>UUID {item.uuid}</p>
        <p>Status {item.status} · Role {item.role} · Membership {String(item.membershipTf)}</p>
        <pre className="overflow-auto rounded bg-white p-3 text-xs">{JSON.stringify(item,null,2)}</pre>
      </div>
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-ghost" onClick={()=>setMsg("Restriction applied (mock)")}>Restrict</button>
        <button className="btn btn-ghost" onClick={()=>setMsg("Membership toggled (mock)")}>Toggle membership</button>
        <Link href="/admin/members" className="btn btn-primary">Back</Link>
      </div>
    </div>
  );
}
