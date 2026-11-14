"use client";
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
        await createInquiry({ userId: u.id, description: "["+category+"] "+title+"\n"+description });
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
