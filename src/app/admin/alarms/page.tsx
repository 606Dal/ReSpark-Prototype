"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const load = () => fetch("/api/admin/alarms").then(r=>r.json()).then(j=>setItems(j.data||[]));
  useEffect(() => { load(); }, []);
  const filtered = items.filter((x: any) => JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold text-ink">Alarm templates & send history</h1><MockBadge /></div>
        <input className="input max-w-xs" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <p className="text-xs text-muted">Template CRUD · send log (P2 stub)</p>
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#eef5f1] text-xs uppercase text-muted"><tr><th className="p-3">ID</th><th className="p-3">Summary</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map((item: any) => (
              <tr key={item.id} className="border-t border-line align-top">
                <td className="p-3">{item.id}</td>
                <td className="p-3 max-w-md truncate">{item.title || item.question || item.name || item.description || item.templateName || item.boardName || JSON.stringify(item).slice(0,80)}</td>
                <td className="p-3">{item.status || item.reportStatus || item.published || item.active || "—"}</td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Viewed #"+item.id+" (mock)")}>View</button>
                  <button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Saved draft #"+item.id+" (mock)")}>Edit</button>
                  <button className="btn btn-ghost px-2 py-1 text-xs text-rose-700" onClick={()=>setMsg("Soft-deleted #"+item.id+" (mock)")}>Delete</button>
                  <button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Send preview #"+item.id+" (mock)")}>Send</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <p className="p-6 text-center text-muted">No data</p>}
      </div>
      <button className="btn btn-primary" onClick={()=>setMsg("Create form opened (mock stub for design review)")}>Create</button>
    </div>
  );
}
