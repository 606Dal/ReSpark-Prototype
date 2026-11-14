"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { cancelPurchase } from "@/lib/api/purchases";
export default function Client() {
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
