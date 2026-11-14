"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    fetch("/api/notifications?userUuid="+u.uuid).then(r=>r.json()).then(j=>setItems(j.data||[]));
  }, [router]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Notifications</h1><MockBadge /></div>
      <p className="text-sm text-muted">Max 50 · FIFO hard delete (policy mock)</p>
      {items.length===0 && <p className="panel p-6 text-center text-muted">No data yet.</p>}
      {items.map((n: any) => (
        <article key={n.id} className={"panel p-4 " + (n.read ? "opacity-70" : "")}>
          <p className="text-xs uppercase text-muted">{n.type}</p>
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm">{n.body}</p>
        </article>
      ))}
    </div>
  );
}
