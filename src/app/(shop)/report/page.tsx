"use client";
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
