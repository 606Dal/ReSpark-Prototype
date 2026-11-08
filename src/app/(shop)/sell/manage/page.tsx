"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { deleteProduct, fetchProducts, updateProductStatus } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import type { Product, ProductStatus } from "@/types";

export default function SellManagePage() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"" | ProductStatus>("");
  const [error, setError] = useState("");

  async function load(uuid: string) {
    const res = await fetchProducts({ sellerUuid: uuid });
    setItems(res.data);
  }

  useEffect(() => {
    const user = readUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    load(user.uuid).catch((e: Error) => setError(e.message));
  }, [router]);

  const visible = filter ? items.filter((i) => i.status === filter) : items;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-3xl font-bold">Sales management</h1>
          <p className="text-sm text-muted">Soft delete keeps product rows for audit.</p>
        </div>
        <Link href="/sell" className="btn btn-primary">
          New listing
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["", "ON_SALE", "RESERVED", "SOLD"] as const).map((s) => (
          <button
            key={s || "ALL"}
            className={`btn ${filter === s ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter(s)}
          >
            {s || "ALL"}
          </button>
        ))}
      </div>

      {error && <p className="text-rose-700">{error}</p>}

      <div className="space-y-3">
        {visible.map((item) => (
          <div key={item.id} className="panel flex flex-wrap items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.media[0]?.url}
              alt=""
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.id}`} className="font-semibold hover:text-brand">
                {item.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <ProductStatusBadge status={item.status} />
                <span>{formatUsd(item.price)}</span>
              </div>
            </div>
            <select
              className="input w-auto"
              value={item.status}
              disabled={item.status === "SOLD"}
              onChange={async (e) => {
                const status = e.target.value as ProductStatus;
                try {
                  const res = await updateProductStatus(item.id, status);
                  setItems((prev) => prev.map((p) => (p.id === item.id ? res.data : p)));
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Failed");
                }
              }}
            >
              <option value="ON_SALE">ON_SALE</option>
              <option value="RESERVED">RESERVED</option>
              <option value="SOLD">SOLD</option>
            </select>
            <button
              className="btn btn-ghost text-rose-700"
              onClick={async () => {
                if (!confirm("Soft-delete this product?")) return;
                try {
                  await deleteProduct(item.id);
                  const user = readUser();
                  if (user) await load(user.uuid);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "Failed");
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="panel p-8 text-center text-muted">No listings in this filter.</p>
        )}
      </div>
    </div>
  );
}
