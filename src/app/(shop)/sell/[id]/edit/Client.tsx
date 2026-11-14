"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProduct, updateProduct } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";

export default function Client() {
  const params = useParams();
  const router = useRouter();
  const [locked, setLocked] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [deliveryFee, setDeliveryFee] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
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
          {categories.map((c: any) => <option key={c.id} value={c.id}>{"— ".repeat(Math.max(c.depth-1,0))}{c.name}</option>)}
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
