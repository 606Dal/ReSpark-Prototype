import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join("src/app", rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("wrote", rel);
}

write(
  "(shop)/terms/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function TermsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch("/api/terms").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Terms</h1><MockBadge /></div>
      {items.map(item => (
        <article key={item.id} className="panel space-y-2 p-5">
          <h2 className="font-semibold">{item.title} <span className="text-xs text-muted">v{item.version}</span></h2>
          <p className="text-sm whitespace-pre-wrap">{item.content}</p>
        </article>
      ))}
    </div>
  );
}
`
);

write(
  "(shop)/sell/prohibited/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function ProhibitedPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch("/api/prohibited").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Prohibited items</h1><MockBadge /></div>
      <ul className="panel space-y-2 p-5 text-sm">{items.map((x,i)=><li key={i}>• {x}</li>)}</ul>
      <Link href="/sell" className="btn btn-primary">Back</Link>
    </div>
  );
}
`
);

write(
  "(shop)/notifications/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
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
      {items.map(n => (
        <article key={n.id} className={"panel p-4 " + (n.read ? "opacity-70" : "")}>
          <p className="text-xs uppercase text-muted">{n.type}</p>
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm">{n.body}</p>
        </article>
      ))}
    </div>
  );
}
`
);

write(
  "(shop)/report/page.tsx",
  `"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { readUser } from "@/lib/auth/session";

function ReportForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const { push } = useToast();
  const [category, setCategory] = useState("EXTERNAL_PAYMENT");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState(sp.get("type") || "PRODUCT");
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Report</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={async (e) => {
        e.preventDefault();
        const u = readUser();
        if (!u) { router.push("/login"); return; }
        const res = await fetch("/api/reports", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({
          reporterId: u.id, targetType, targetUuid: sp.get("targetUuid") || "", productId: sp.get("productId"), reportCategory: category, description
        })});
        const j = await res.json();
        if (!j.success) { push(j.message, "err"); return; }
        push("Report submitted. Cannot edit/view again (mock).", "ok");
        router.back();
      }}>
        <select className="input" value={targetType} onChange={e=>setTargetType(e.target.value)}>
          <option value="PRODUCT">Product</option>
          <option value="CHAT">Chat</option>
          <option value="REVIEW">Review</option>
          <option value="USER">User</option>
        </select>
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="EXTERNAL_PAYMENT">External payment</option>
          <option value="POLICY">Policy violation</option>
          <option value="ABUSE">Abuse</option>
          <option value="PROHIBITED_ITEM">Prohibited item</option>
          <option value="OTHER">Other</option>
        </select>
        <textarea className="input min-h-28" value={description} onChange={e=>setDescription(e.target.value)} required />
        <p className="text-xs text-muted">Photo attach UI (max 5) — mock only</p>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
export default function Page() { return <Suspense><ReportForm /></Suspense>; }
`
);

write(
  "(shop)/trade/[id]/seller-info/page.tsx",
  `"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
export default function SellerInfoPage() {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState(null);
  const [dest, setDest] = useState(null);
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    Promise.all([
      fetch("/api/accounts?userId="+u.id).then(r=>r.json()),
      fetch("/api/destinations?userId="+u.id).then(r=>r.json()),
    ]).then(([a,d]) => {
      setAccount((a.data||[]).find(x=>x.basicAccount) || (a.data||[])[0] || null);
      setDest((d.data||[]).find(x=>x.defaultAddress) || (d.data||[])[0] || null);
    });
  }, [router]);
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Seller info</h1><MockBadge /></div>
      <p className="text-sm text-muted">Chat #{String(params.id)} · after purchase accept</p>
      <div className="panel space-y-2 p-5 text-sm">
        <p className="font-semibold">Settlement account (auto-fill)</p>
        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(account,null,2)}</pre>
        <p className="font-semibold">Seller address (auto-fill)</p>
        <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(dest,null,2)}</pre>
        <p>Gross $100 · Fee 10% (SQL note) · Net $90 (mock display)</p>
      </div>
      <button className="btn btn-primary" onClick={()=> { alert("Seller info saved (mock). Buyer can pay from chat."); router.push("/chat/"+params.id); }}>Save & notify buyer</button>
    </div>
  );
}
`
);

write(
  "(shop)/mypage/purchases/[id]/cancel/page.tsx",
  `"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { cancelPurchase } from "@/lib/api/purchases";
export default function CancelPage() {
  const params = useParams();
  const router = useRouter();
  const [reason, setReason] = useState("CHANGED_MIND");
  const [detail, setDetail] = useState("");
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Cancel trade</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={async (e)=>{
        e.preventDefault();
        const text = reason + ": " + detail;
        if (detail.trim().length < 10) { alert("Detail must be at least 10 characters"); return; }
        await cancelPurchase(Number(params.id), text);
        alert("Cancel requested. Auto-cancel after 3 days without seller response (mock policy).");
        router.push("/mypage/purchases/"+params.id);
      }}>
        <select className="input" value={reason} onChange={e=>setReason(e.target.value)}>
          <option value="CHANGED_MIND">Changed mind</option>
          <option value="ITEM_ISSUE">Item issue</option>
          <option value="SHIPPING_DELAY">Shipping delay</option>
          <option value="OTHER">Other</option>
        </select>
        <textarea className="input min-h-28" value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Detail (min 10 characters)" />
        <button className="btn btn-ghost text-rose-700">Request cancel</button>
      </form>
    </div>
  );
}
`
);

write(
  "(shop)/mypage/sales/[id]/page.tsx",
  `"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { TradeStatusBadge } from "@/components/common/StatusBadge";
import { fetchPurchase } from "@/lib/api/purchases";
import { formatUsd } from "@/lib/format";
export default function SalesDetailPage() {
  const params = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => { fetchPurchase(String(params.id)).then(r=>setItem(r.data)).catch(()=>undefined); }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Sale detail</h1><MockBadge /></div>
      <div className="panel space-y-3 p-5">
        <div className="flex justify-between gap-2"><p className="font-semibold">{item.purchaseUuid}</p><TradeStatusBadge status={item.tradeStatus} /></div>
        <p>{item.product?.title}</p>
        <p className="text-brand font-bold">{formatUsd(item.amount||0)}</p>
        <div className="grid gap-1 text-sm md:grid-cols-2">
          <p>Buyer: {item.buyerUuid}</p>
          <p>Tracking: {item.trackingNumber || "Pending"}</p>
          <p>Payment: {item.paymentMethod}</p>
          <p>Settlement: fee mock 10% · net display only</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={"/reviews/new"} className="btn btn-ghost">Write review</Link>
          <Link href={"/mypage/purchases/"+item.id+"/cancel"} className="btn btn-ghost text-rose-700">Cancel trade</Link>
        </div>
      </div>
    </div>
  );
}
`
);

const supportList = (kind, title) => `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch("/api/${kind}").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">${title}</h1><MockBadge /></div>
      <p className="text-sm text-muted">Infinite scroll simulated as full list (20/page policy mock)</p>
      {items.map(item => (
        <Link key={item.id} href={"/support/${kind}/"+item.id} className="panel block p-4 hover:border-brand/40">
          <p className="text-xs text-muted">{item.noticeType || item.category || item.status || ""}</p>
          <p className="font-semibold">{item.title || item.question || item.description}</p>
        </Link>
      ))}
      <Link href="/support" className="text-sm text-brand">Customer center</Link>
    </div>
  );
}
`;

write("(shop)/support/faq/page.tsx", supportList("faq", "FAQ"));
write("(shop)/support/notices/page.tsx", supportList("notices", "Notices"));

write(
  "(shop)/support/faq/[id]/page.tsx",
  `"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const params = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => { fetch("/api/faq").then(r=>r.json()).then(j=>setItem((j.data||[]).find(x=>String(x.id)===String(params.id)))); }, [params.id]);
  if (!item) return <p className="text-muted">Loading...</p>;
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-2xl font-bold">{item.question}</h1><MockBadge /></div>
      <p className="text-xs text-muted">{item.category}</p>
      <div className="panel p-5 text-sm whitespace-pre-wrap">{item.answer}</div>
      <Link href="/support/faq" className="text-sm text-brand">Back</Link>
    </div>
  );
}
`
);

write(
  "(shop)/support/notices/[id]/page.tsx",
  `"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const params = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => { fetch("/api/notices").then(r=>r.json()).then(j=>setItem((j.data||[]).find(x=>String(x.id)===String(params.id)))); }, [params.id]);
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
`
);

write(
  "(shop)/support/inquiries/page.tsx",
  `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    fetch("/api/admin/inquiries").then(r=>r.json()).then(j=>setItems((j.data||[]).filter(x=>x.userId===u.id)));
  }, [router]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">My inquiries</h1><MockBadge /></div>
        <Link href="/support/inquiries/new" className="btn btn-primary">New</Link>
      </div>
      {items.map(i => (
        <Link key={i.id} href={"/support/inquiries/"+i.id} className="panel block p-4">
          <p className="text-xs text-muted">{i.status} · {i.inquiredAt}</p>
          <p className="font-semibold">{i.title || i.description}</p>
        </Link>
      ))}
      {items.length===0 && <p className="panel p-6 text-center text-muted">No inquiries</p>}
    </div>
  );
}
`
);

write(
  "(shop)/support/inquiries/new/page.tsx",
  `"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { createInquiry } from "@/lib/api/support";
import { readUser } from "@/lib/auth/session";
export default function Page() {
  const router = useRouter();
  const [category, setCategory] = useState("Shipping");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">New inquiry</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={async (e)=>{
        e.preventDefault();
        const u = readUser();
        if (!u) { router.push("/login"); return; }
        await createInquiry({ userId: u.id, description: "["+category+"] "+title+"\\n"+description });
        router.push("/support/inquiries");
      }}>
        <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
          <option>Shipping</option><option>Payment</option><option>Trade</option><option>Account</option><option>Other</option>
        </select>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <textarea className="input min-h-28" value={description} onChange={e=>setDescription(e.target.value)} required />
        <p className="text-xs text-muted">Photo attach max 5 (mock)</p>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
`
);

write(
  "(shop)/support/inquiries/[id]/page.tsx",
  `"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const params = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => { fetch("/api/admin/inquiries").then(r=>r.json()).then(j=>setItem((j.data||[]).find(x=>String(x.id)===String(params.id)))); }, [params.id]);
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
`
);

console.log("batch2 done");
