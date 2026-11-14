"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { ProductCard } from "@/components/products/ProductCard";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchProducts } from "@/lib/api/products";
import { toggleWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import type { Product } from "@/types";

export default function HomePage() {
  const { t } = useI18n();
  const router = useRouter();
  const { push } = useToast();
  const [latest, setLatest] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [wishedIds, setWishedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");

  async function reloadLists() {
    const [a, b] = await Promise.all([
      fetchProducts({ sort: "latest" }),
      fetchProducts({ sort: "popular" }),
    ]);
    setLatest(a.data.slice(0, 4));
    setPopular(b.data.slice(0, 4));
  }

  useEffect(() => {
    reloadLists().catch((e: Error) => setError(e.message));
    const user = readUser();
    if (!user) return;
    fetch(`/api/wishlist?userUuid=${user.uuid}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        setWishedIds(new Set((j.data as { productId: number }[]).map((w) => w.productId)));
      })
      .catch(() => undefined);
  }, []);

  async function onWish(productId: number) {
    const user = readUser();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      await toggleWishlist(user.uuid, productId);
      setWishedIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
      await reloadLists();
      push(t("common.success"), "ok");
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.error"), "err");
    }
  }

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[1.6rem] border border-line bg-[linear-gradient(135deg,#0f6b4c_0%,#0a4734_48%,#16382c_100%)] px-6 py-10 text-white md:px-10 md:py-14">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-spark/30 blur-2xl pulse-dot" />
        <div className="relative max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <p className="display text-4xl font-extrabold tracking-tight md:text-5xl">
              Re<span className="text-[#ffb347]">Spark</span>
            </p>
            <MockBadge />
          </div>
          <h1 className="display text-2xl font-bold leading-tight md:text-3xl">
            {t("home.headline")}
          </h1>
          <p className="max-w-xl text-[#d5ebe1]">{t("home.sub")}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className="btn btn-spark">
              {t("home.browse")}
            </Link>
            <Link
              href="/sell"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              {t("home.listItem")}
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="display text-2xl font-bold">{t("home.newArrivals")}</h2>
          </div>
          <Link href="/products?sort=latest" className="text-sm font-semibold text-brand">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onWish={onWish}
              wished={wishedIds.has(p.id)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="display text-2xl font-bold">{t("home.popular")}</h2>
            <p className="text-sm text-muted">{t("home.popularHint")}</p>
          </div>
          <Link href="/products?sort=popular" className="text-sm font-semibold text-brand">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              onWish={onWish}
              wished={wishedIds.has(p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
