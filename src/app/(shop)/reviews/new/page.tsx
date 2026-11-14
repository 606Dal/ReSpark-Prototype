"use client";
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
