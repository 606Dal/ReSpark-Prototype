"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchCategories } from "@/lib/api/categories";
import { createProduct } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";
import type { Category, Product } from "@/types";

export default function SellPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("100");
  const [country, setCountry] = useState("KR");
  const [condition, setCondition] = useState<Product["condition"]>("USED_A");
  const [categoryId, setCategoryId] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = readUser();
    if (!user) router.replace("/login");
    fetchCategories().then((res) => {
      setCategories(res.data);
      const leaf = res.data.find((c) => c.depth === 2);
      if (leaf) setCategoryId(String(leaf.id));
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = readUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createProduct({
        title,
        description,
        price: Number(price),
        categoryIds: categoryId ? [Number(categoryId)] : [],
        country,
        condition,
        deliveryFee,
        sellerUuid: user.uuid,
      });
      router.push(`/products/${res.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="display text-3xl font-bold">List an item</h1>
            <MockBadge />
          </div>
          <p className="text-sm text-muted">
            Media upload is mocked with a placeholder image. Max 10 files rule is UI-only.
          </p>
        </div>
        <Link href="/sell/manage" className="btn btn-ghost">
          Manage listings
        </Link>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Title</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Description (min 10 chars)</span>
          <textarea
            className="input min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Price (USD)</span>
            <input
              className="input"
              type="number"
              min={0}
              max={1_000_000_000}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Country</span>
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
              {["KR", "JP", "US", "FR"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Category</span>
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {"— ".repeat(Math.max(c.depth - 1, 0))}
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Condition</span>
            <select
              className="input"
              value={condition}
              onChange={(e) => setCondition(e.target.value as Product["condition"])}
            >
              <option value="NEW">New</option>
              <option value="USED_S">Used S</option>
              <option value="USED_A">Used A</option>
              <option value="USED_B">Used B</option>
            </select>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={deliveryFee}
            onChange={(e) => setDeliveryFee(e.target.checked)}
          />
          Delivery fee included
        </label>
        <div className="rounded-xl border border-dashed border-line bg-[#f7fbf9] p-4 text-sm text-muted">
          Photo/video picker is mocked. A placeholder image will be attached.
        </div>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
