"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { useI18n } from "@/components/providers/LocaleProvider";
import { useToast } from "@/components/common/Toast";
import { fetchCategories } from "@/lib/api/categories";
import { fetchProducts } from "@/lib/api/products";
import { toggleWishlist } from "@/lib/api/wishlist";
import { readUser } from "@/lib/auth/session";
import type { Category, Product } from "@/types";

const PAGE_SIZE = 25; // 5×5 desktop

export function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useI18n();
  const { push } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishedIds, setWishedIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const q = searchParams.get("q") ?? "";
  const country = searchParams.get("country") ?? "";
  const status = searchParams.get("status") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort =
    (searchParams.get("sort") as "latest" | "popular" | "price_asc" | "price_desc") ||
    "latest";

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => undefined);
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

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchProducts({ q, country, status, categoryId, sort, minPrice, maxPrice } as never)
      .then((res) => setProducts(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, country, status, categoryId, sort, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page]
  );

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/products?${params.toString()}`);
  }

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
      const res = await fetchProducts({ q, country, status, categoryId, sort, minPrice, maxPrice } as never);
      setProducts(res.data);
      push(t("common.success"), "ok");
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.error"), "err");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-bold">{t("products.catalog")}</h1>
        <p className="text-sm text-muted">{t("products.catalogHint")}</p>
      </div>

      <div className="panel grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
        <select className="input" value={country} onChange={(e) => update("country", e.target.value)}>
          <option value="">{t("products.allCountries")}</option>
          {["JP", "CN", "TW", "US", "DK", "CZ", "DE", "KR", "FR"].map((c) => (
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
          <option value="">{t("products.allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {"— ".repeat(c.depth - 1)}
              {c.name}
            </option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => update("status", e.target.value)}>
          <option value="">{t("products.saleStatus")}</option>
          <option value="ON_SALE">ON_SALE</option>
          <option value="RESERVED">RESERVED</option>
        </select>
        <select className="input" value={sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="latest">{t("products.latest")}</option>
          <option value="popular">{t("products.popular")}</option>
          <option value="price_asc">{t("products.priceAsc")}</option>
          <option value="price_desc">{t("products.priceDesc")}</option>
        </select>
        <input
          className="input"
          type="number"
          min={0}
          max={100}
          placeholder={t("products.priceMin")}
          defaultValue={minPrice}
          onBlur={(e) => update("minPrice", e.target.value)}
        />
        <input
          className="input"
          type="number"
          min={0}
          max={100}
          placeholder={t("products.priceMax")}
          defaultValue={maxPrice}
          onBlur={(e) => update("maxPrice", e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-rose-700">{error}</p>}
      {loading ? (
        <p className="text-muted">{t("common.loading")}</p>
      ) : products.length === 0 ? (
        <p className="panel p-8 text-center text-muted">{t("products.noMatch")}</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {pageItems.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onWish={onWish}
                wished={wishedIds.has(p.id)}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("common.prev")}
            </button>
            <span className="text-sm text-muted">
              {t("common.page")} {page} {t("common.of")} {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t("common.next")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
