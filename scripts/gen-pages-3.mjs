import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join("src/app", rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("wrote", rel);
}

write(
  "(shop)/sell/[id]/edit/page.tsx",
  `"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProduct, updateProduct } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";

export default function SellEditPage() {
  const params = useParams();
  const router = useRouter();
  const [locked, setLocked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [deliveryFee, setDeliveryFee] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    Promise.all([fetchProduct(String(params.id)), fetchCategories()]).then(([p, c]) => {
      const product = p.data;
      if (product.status === "SOLD") { setLocked(true); setMsg("Sold items cannot be edited (v2)."); }
      setTitle(product.title);
      setDescription(product.description);
      setPrice(String(product.price));
      setDeliveryFee(!!product.deliveryFee);
      setCategoryId(String(product.categoryIds?.[0] || ""));
      setCategories(c.data || []);
    }).catch((e) => setError(e.message));
  }, [params.id, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Edit listing</h1><MockBadge /></div>
      {msg && <p className="panel p-3 text-sm text-amber-800">{msg}</p>}
      <form className="panel space-y-3 p-5" onSubmit={async (e) => {
        e.preventDefault();
        if (locked) return;
        const n = Number(price);
        if (n < 0 || n > 100) { setError("Price must be USD 0–100 (requirements v2)."); return; }
        try {
          await updateProduct(Number(params.id), { title, description, price: n, deliveryFee, categoryIds: categoryId ? [Number(categoryId)] : [] });
          router.push("/sell/manage");
        } catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
      }}>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} disabled={locked} required />
        <textarea className="input min-h-28" value={description} onChange={e=>setDescription(e.target.value)} disabled={locked} required />
        <input className="input" type="number" min={0} max={100} step="0.01" value={price} onChange={e=>setPrice(e.target.value)} disabled={locked} />
        <select className="input" value={categoryId} onChange={e=>setCategoryId(e.target.value)} disabled={locked}>
          {categories.map(c => <option key={c.id} value={c.id}>{"— ".repeat(Math.max(c.depth-1,0))}{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={deliveryFee} onChange={e=>setDeliveryFee(e.target.checked)} disabled={locked} /> Delivery fee included</label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <div className="flex gap-2">
          <button className="btn btn-primary" disabled={locked}>Save</button>
          <Link href="/sell/manage" className="btn btn-ghost">Back</Link>
        </div>
      </form>
    </div>
  );
}
`
);

const adminCrud = (title, fetchPath, columnsHint, extraActions = "") => `"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const load = () => fetch("${fetchPath}").then(r=>r.json()).then(j=>setItems(j.data||[]));
  useEffect(() => { load(); }, []);
  const filtered = items.filter(x => JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold text-ink">${title}</h1><MockBadge /></div>
        <input className="input max-w-xs" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <p className="text-xs text-muted">${columnsHint}</p>
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#eef5f1] text-xs uppercase text-muted"><tr><th className="p-3">ID</th><th className="p-3">Summary</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-t border-line align-top">
                <td className="p-3">{item.id}</td>
                <td className="p-3 max-w-md truncate">{item.title || item.question || item.name || item.description || item.templateName || item.boardName || JSON.stringify(item).slice(0,80)}</td>
                <td className="p-3">{item.status || item.reportStatus || item.published || item.active || "—"}</td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Viewed #"+item.id+" (mock)")}>View</button>
                  <button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Saved draft #"+item.id+" (mock)")}>Edit</button>
                  <button className="btn btn-ghost px-2 py-1 text-xs text-rose-700" onClick={()=>setMsg("Soft-deleted #"+item.id+" (mock)")}>Delete</button>
                  ${extraActions}
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
`;

write("admin/faq/page.tsx", adminCrud("FAQ management", "/api/faq", "CRUD FAQ · category · publish (mock)"));
write("admin/notices/page.tsx", adminCrud("Notice management", "/api/notices", "CRUD notices · noticeType · pin (mock)"));
write("admin/inquiries/page.tsx", adminCrud("Inquiry answers", "/api/admin/inquiries", "Answer CRUD · status", `<button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Answered #"+item.id+" (mock)")}>Answer</button>`));
write("admin/reviews/page.tsx", adminCrud("Review management", "/api/reviews", "Hide / delete reviews (mock)"));
write("admin/categories/page.tsx", adminCrud("Category CRUD", "/api/admin/categories", "1st/2nd depth categories · soft delete", `<button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Toggled #"+item.id+" (mock)")}>Toggle</button>`));
write("admin/boards/page.tsx", adminCrud("Boards & board categories", "/api/admin/boards", "Board + category management (P3 stub)"));
write("admin/alarms/page.tsx", adminCrud("Alarm templates & send history", "/api/admin/alarms", "Template CRUD · send log (P2 stub)", `<button className="btn btn-ghost px-2 py-1 text-xs" onClick={()=>setMsg("Send preview #"+item.id+" (mock)")}>Send</button>`));

write(
  "admin/members/[id]/page.tsx",
  `"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function MemberDetailPage() {
  const params = useParams();
  const [item, setItem] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetch("/api/admin/members").then(r=>r.json()).then(j=>setItem((j.data||[]).find(x=>String(x.id)===String(params.id) || x.uuid===params.id)));
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
`
);

write(
  "admin/trades/[id]/page.tsx",
  `"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
export default function TradeDetailPage() {
  const params = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    fetch("/api/admin/trades").then(r=>r.json()).then(j=>setItem((j.data||[]).find(x=>String(x.id)===String(params.id))));
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
`
);

write(
  "(shop)/privacy/retention/page.tsx",
  `"use client";
import { MockBadge } from "@/components/common/MockBadge";
import Link from "next/link";
export default function RetentionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Data retention & deletion</h1><MockBadge /></div>
      <div className="panel space-y-3 p-5 text-sm">
        <p>Stage 1 mock policy summary (requirements v2):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Trade history retained up to 5 years (display policy).</li>
          <li>Chat soft-deleted rooms kept for compliance (mock).</li>
          <li>Product media deleted ~3 months after soft delete (policy notice only).</li>
          <li>Notifications max 50; oldest FIFO hard delete.</li>
          <li>Withdrawn accounts: personal data anonymized after retention window (stub).</li>
        </ul>
        <p className="text-muted">Actual purge jobs run in Stage 2. This page is for design review.</p>
      </div>
      <Link href="/mypage/withdraw" className="btn btn-ghost">Withdrawal</Link>
    </div>
  );
}
`
);

console.log("batch3 done");
