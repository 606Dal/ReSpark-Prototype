"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { ProductCard } from "@/components/products/ProductCard";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/types";

export default function HomePage() {
  const [latest, setLatest] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetchProducts({ sort: "latest" }),
      fetchProducts({ sort: "popular" }),
    ])
      .then(([a, b]) => {
        setLatest(a.data.slice(0, 4));
        setPopular(b.data.slice(0, 4));
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[1.6rem] border border-line bg-[linear-gradient(135deg,#0f6b4c_0%,#0a4734_48%,#16382c_100%)] px-6 py-10 text-white md:px-10 md:py-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-spark/30 blur-2xl pulse-dot" />
        <div className="relative max-w-2xl space-y-4 rise">
          <div className="flex items-center gap-2">
            <p className="display text-4xl font-extrabold tracking-tight md:text-5xl">
              Re<span className="text-[#ffb347]">Spark</span>
            </p>
            <MockBadge />
          </div>
          <h1 className="display text-2xl font-bold leading-tight md:text-3xl">
            Cross-border secondhand, sparked again.
          </h1>
          <p className="max-w-xl text-[#d5ebe1]">
            Browse, chat, and checkout with mock APIs. Stage 1 prototype for the
            future MSA stack.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className="btn btn-spark">
              Browse products
            </Link>
            <Link
              href="/sell"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              List an item
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="display text-2xl font-bold">New arrivals</h2>
            <p className="text-sm text-muted">Fresh listings from mock sellers</p>
          </div>
          <Link href="/products?sort=latest" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="display text-2xl font-bold">Popular now</h2>
            <p className="text-sm text-muted">Sorted by wishlist heat</p>
          </div>
          <Link href="/products?sort=popular" className="text-sm font-semibold text-brand">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
