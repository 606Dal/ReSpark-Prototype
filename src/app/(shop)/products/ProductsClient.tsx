"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import type { Category, Product } from "@/types";

export function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") ?? "";
  const country = searchParams.get("country") ?? "";
  const status = searchParams.get("status") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const sort =
    (searchParams.get("sort") as "latest" | "popular" | "price_asc" | "price_desc") ||
    "latest";

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ q, country, status, categoryId, sort })
      .then((res) => setProducts(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, country, status, categoryId, sort]);

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-bold">Product catalog</h1>
        <p className="text-sm text-muted">
          Filter by country, category, and sale status. Sold items can be hidden.
        </p>
      </div>

      <div className="panel grid gap-3 p-4 md:grid-cols-5">
        <select
          className="input"
          value={country}
          onChange={(e) => update("country", e.target.value)}
        >
          <option value="">All countries</option>
          {["KR", "JP", "US", "FR"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {"— ".repeat(c.depth - 1)}
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="">Sale status</option>
          <option value="ON_SALE">On sale</option>
          <option value="RESERVED">Reserved</option>
        </select>
        <select className="input" value={sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
        </select>
        <input
          className="input"
          defaultValue={q}
          placeholder="Keyword"
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      {error && <p className="text-sm text-rose-700">{error}</p>}
      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="panel p-8 text-center text-muted">No products match these filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
