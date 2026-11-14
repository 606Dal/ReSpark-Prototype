"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchCategories } from "@/lib/api/categories";
import { createProduct } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";
import type { Category, Product } from "@/types";

type LocalMedia = { id: string; name: string; kind: "image" | "video"; preview: string };

export default function SellPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("50");
  const [country, setCountry] = useState("KR");
  const [condition, setCondition] = useState<Product["condition"]>("USED_A");
  const [parentId, setParentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(true);
  const [media, setMedia] = useState<LocalMedia[]>([]);
  const [aiResult, setAiResult] = useState<{ keywords: string[]; priceHint: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const parents = useMemo(() => categories.filter((c) => c.depth === 1), [categories]);
  const children = useMemo(
    () => categories.filter((c) => c.depth === 2 && String(c.categoryParentId) === parentId),
    [categories, parentId]
  );

  useEffect(() => {
    const user = readUser();
    if (!user) router.replace("/login");
    fetchCategories().then((res) => {
      setCategories(res.data);
      const firstParent = res.data.find((c) => c.depth === 1);
      if (firstParent) setParentId(String(firstParent.id));
    });
  }, [router]);

  useEffect(() => {
    const leaf = children[0];
    setCategoryId(leaf ? String(leaf.id) : "");
  }, [children]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = readUser();
    if (!user) {
      router.push("/login");
      return;
    }
    if (media.length < 1) {
      setError("At least 1 photo/video is required (gallery pick, max 10).");
      return;
    }
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters.");
      return;
    }
    const n = Number(price);
    if (Number.isNaN(n) || n < 0 || n > 100) {
      setError("Price must be USD 0–100 (requirements v2). Confirm with stakeholders if this looks low.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createProduct({
        title,
        description,
        price: n,
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
            Gallery-only media (no camera). Files stay in browser preview — no S3 upload.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/sell/prohibited" className="btn btn-ghost">
            Prohibited items
          </Link>
          <Link href="/sell/manage" className="btn btn-ghost">
            Manage listings
          </Link>
        </div>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">Photos / videos (1–10)</p>
          <input
            className="input"
            type="file"
            accept="image/png,image/jpeg,image/jpg,video/mp4,video/quicktime"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const next: LocalMedia[] = [];
              for (const f of files) {
                if (media.length + next.length >= 10) break;
                const kind = f.type.startsWith("video") ? "video" : "image";
                next.push({
                  id: `${f.name}-${f.size}-${Math.random()}`,
                  name: f.name,
                  kind,
                  preview: URL.createObjectURL(f),
                });
              }
              setMedia((prev) => [...prev, ...next].slice(0, 10));
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            {media.map((m) => (
              <div key={m.id} className="relative h-20 w-20 overflow-hidden rounded-lg border border-line">
                {m.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.preview} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <video src={m.preview} className="h-full w-full object-cover" muted />
                )}
                <button
                  type="button"
                  className="absolute right-0.5 top-0.5 rounded bg-black/70 px-1 text-[10px] text-white"
                  onClick={() => setMedia((prev) => prev.filter((x) => x.id !== m.id))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-ghost text-sm"
              disabled={!media.length || aiLoading}
              onClick={async () => {
                setAiLoading(true);
                await new Promise((r) => setTimeout(r, 600));
                setAiResult({
                  keywords: ["figure", "collectible", title || "toy"],
                  priceHint: "$28 – $45 (mock similar listings)",
                });
                setAiLoading(false);
              }}
            >
              {aiLoading ? "Analyzing..." : "AI price hint (mock)"}
            </button>
            {media.length > 0 && (
              <button type="button" className="btn btn-ghost text-sm" onClick={() => setMedia([])}>
                Clear media
              </button>
            )}
          </div>
          {aiResult && (
            <div className="rounded-xl border border-dashed border-brand/40 bg-[#f3faf6] p-3 text-sm">
              <p className="font-semibold">AI keywords (mock)</p>
              <p>{aiResult.keywords.join(", ")}</p>
              <p className="mt-1 text-muted">{aiResult.priceHint}</p>
              <p className="mt-1 text-xs text-muted">Not a live model — Stage 2 will call the real AI service.</p>
            </div>
          )}
        </div>

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
            <span className="font-semibold">Price (USD 0–100)</span>
            <input
              className="input"
              type="number"
              min={0}
              max={100}
              step="0.01"
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
            <span className="font-semibold">1st category</span>
            <select className="input" value={parentId} onChange={(e) => setParentId(e.target.value)}>
              {parents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">2nd category</span>
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm md:col-span-2">
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
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Publishing..." : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
