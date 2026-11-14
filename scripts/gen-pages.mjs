import fs from "fs";
import path from "path";

function write(rel, content) {
  const full = path.join("src/app", rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  console.log("wrote", rel);
}

write(
  "(shop)/password/forgot/page.tsx",
  `"use client";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Forgot password</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={(e)=>{e.preventDefault(); alert("Mock verification flow complete.");}}>
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" placeholder="Verification code" />
        <input className="input" type="password" placeholder="New password" />
        <input className="input" type="password" placeholder="Confirm password" />
        <button className="btn btn-primary">Submit</button>
      </form>
      <Link href="/login" className="text-sm text-brand">Back</Link>
    </div>
  );
}
`
);

write(
  "(shop)/password/change/page.tsx",
  `"use client";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Change password</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={(e)=>{e.preventDefault(); alert("Password changed (mock)");}}>
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Current password" required />
        <input className="input" placeholder="Verification code" />
        <input className="input" type="password" placeholder="New password" />
        <input className="input" type="password" placeholder="Confirm password" />
        <button className="btn btn-primary">Save</button>
      </form>
    </div>
  );
}
`
);

write(
  "(shop)/demo/page.tsx",
  `"use client";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { clearSession } from "@/lib/auth/session";
export default function DemoPage() {
  const { push } = useToast();
  const router = useRouter();
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Reset demo data</h1><MockBadge /></div>
      <p className="text-sm text-muted">Resets in-memory mock store and clears session.</p>
      <button className="btn btn-spark" onClick={async () => {
        await fetch("/api/demo/reset", { method: "POST" });
        clearSession();
        push("Demo data reset", "ok");
        router.push("/");
      }}>Reset demo data</button>
    </div>
  );
}
`
);

const crudList = (title, endpoint, fields) => `"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { readUser } from "@/lib/auth/session";

export default function Page() {
  const router = useRouter();
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(${JSON.stringify(fields)});
  async function load(userId) {
    const j = await fetch("${endpoint}?userId=" + userId).then(r=>r.json());
    setItems(j.data || []);
  }
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    load(u.id);
  }, [router]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">${title}</h1><MockBadge /></div>
      <form className="panel grid gap-2 p-4 md:grid-cols-2" onSubmit={async (e) => {
        e.preventDefault();
        const u = readUser();
        if (!u) return;
        const res = await fetch("${endpoint}", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ ...form, userId: u.id }) });
        const j = await res.json();
        if (!j.success) { push(j.message, "err"); return; }
        push("Saved", "ok");
        load(u.id);
      }}>
        ${Object.keys(fields)
          .map(
            (k) =>
              k === "basicAccount" || k === "defaultAddress"
                ? `<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.${k}} onChange={e=>setForm({...form, ${k}: e.target.checked})} /> ${k}</label>`
                : `<input className="input" placeholder="${k}" value={form.${k}||""} onChange={e=>setForm({...form, ${k}: e.target.value})} required />`
          )
          .join("\n        ")}
        <button className="btn btn-primary md:col-span-2">Add</button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 0)}</pre>
            <button className="btn btn-ghost text-rose-700" onClick={async () => {
              const res = await fetch("${endpoint}/" + item.id, { method: "DELETE" });
              const j = await res.json();
              if (!j.success) push(j.message, "err");
              else { push("Deleted", "ok"); const u=readUser(); if(u) load(u.id); }
            }}>Delete</button>
          </div>
        ))}
        {items.length===0 && <p className="panel p-6 text-center text-muted">No data yet.</p>}
      </div>
    </div>
  );
}
`;

write(
  "(shop)/mypage/accounts/page.tsx",
  crudList("Accounts", "/api/accounts", {
    name: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
    basicAccount: false,
  })
);
write(
  "(shop)/mypage/destinations/page.tsx",
  crudList("Destinations", "/api/destinations", {
    name: "",
    phoneNumber: "",
    address: "",
    detailedAddress: "",
    postcode: "",
    defaultAddress: false,
  })
);

write(
  "(shop)/mypage/withdraw/page.tsx",
  `"use client";
import { MockBadge } from "@/components/common/MockBadge";
import { clearSession } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Withdraw account</h1><MockBadge /></div>
      <p className="text-sm text-muted">Trade records may be kept encrypted up to 5 years (policy mock).</p>
      <form className="panel space-y-3 p-5" onSubmit={(e)=>{e.preventDefault(); clearSession(); alert("Withdrawal requested (mock)"); router.push("/");}}>
        <input className="input" type="password" placeholder="Current password" required />
        <button className="btn btn-ghost text-rose-700 w-full">Withdraw</button>
      </form>
    </div>
  );
}
`
);

write(
  "(shop)/mypage/profile/page.tsx",
  `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser, saveSession, readSession } from "@/lib/auth/session";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    setNickname(u.nickname);
  }, [router]);
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Edit profile</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={(e)=>{
        e.preventDefault();
        const s = readSession();
        if (!s) return;
        s.user.nickname = nickname;
        saveSession(s);
        alert("Profile updated (local mock session)");
      }}>
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand text-2xl font-bold text-white">{nickname.slice(0,1)||"?"}</div>
        <p className="text-xs text-muted">Profile photo upload is mock-only</p>
        <input className="input" value={nickname} onChange={e=>setNickname(e.target.value)} />
        <button className="btn btn-primary">Save</button>
      </form>
      <Link href="/password/change" className="text-sm text-brand">Change password</Link>
    </div>
  );
}
`
);

write(
  "(shop)/mypage/restrictions/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
export default function Page() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const u = readUser();
    if (!u) { router.replace("/login"); return; }
    fetch("/api/restrictions?userUuid=" + u.uuid).then(r=>r.json()).then(j=>setItems(j.data||[]));
  }, [router]);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Restrictions</h1><MockBadge /></div>
      {items.length===0 && <p className="panel p-6 text-center text-muted">No restrictions.</p>}
      {items.map(i => (
        <article key={i.id} className="panel p-4 text-sm">
          <p className="font-semibold">{i.reason}</p>
          <p className="text-muted">{i.restrictedAt} → {i.releasedAt || "ongoing"} · {i.durationLabel}</p>
        </article>
      ))}
    </div>
  );
}
`
);

write(
  "(shop)/mypage/reviews/page.tsx",
  `"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetch("/api/reviews").then(r=>r.json()).then(j=>setItems(j.data||[])); }, []);
  const avg = items.length ? (items.reduce((s,i)=>s+i.rating,0)/items.length).toFixed(1) : "0.0";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Reviews</h1><MockBadge /></div>
        <Link href="/reviews/new" className="btn btn-primary">Write review</Link>
      </div>
      <p className="text-sm text-muted">Count {items.length} · Avg {avg}</p>
      {items.map(r => (
        <article key={r.id} className="panel p-4 text-sm">
          <p className="font-semibold">{r.productTitle} · ★{r.rating}</p>
          <p>{r.content}</p>
          <p className="text-xs text-muted">{r.authorNickname} · {r.createdAt}</p>
        </article>
      ))}
    </div>
  );
}
`
);

write(
  "(shop)/reviews/new/page.tsx",
  `"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
export default function Page() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [productTitle, setProductTitle] = useState("Sample product");
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Write review</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={async (e)=>{
        e.preventDefault();
        const u = readUser();
        if (!u) { router.push("/login"); return; }
        await fetch("/api/reviews", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ userId:u.id, rating, content, productTitle, tradeId:1 })});
        router.push("/mypage/reviews");
      }}>
        <input className="input" value={productTitle} onChange={e=>setProductTitle(e.target.value)} />
        <select className="input" value={rating} onChange={e=>setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}
        </select>
        <textarea className="input min-h-24" value={content} onChange={e=>setContent(e.target.value)} placeholder="Optional review" />
        <p className="text-xs text-muted">Media attach max 2 (mock)</p>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
`
);

console.log("done core pages");
