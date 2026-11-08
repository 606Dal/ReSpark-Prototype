"use client";

import { useEffect, useState } from "react";
import { ProductStatusBadge } from "@/components/common/StatusBadge";
import { fetchAdminProducts } from "@/lib/api/admin";
import { deleteProduct } from "@/lib/api/products";
import { formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const res = await fetchAdminProducts();
    setProducts(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="display text-3xl font-bold">Product management</h1>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="panel flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                #{p.id} {p.title} {p.deleted ? "(deleted)" : ""}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <ProductStatusBadge status={p.status} />
                <span>{formatUsd(p.price)}</span>
                <span className="text-muted">{p.sellerNickname}</span>
              </div>
            </div>
            {!p.deleted && (
              <button
                className="btn btn-ghost text-rose-700"
                onClick={async () => {
                  if (!confirm("Soft-delete this product?")) return;
                  try {
                    await deleteProduct(p.id);
                    await load();
                  } catch (e) {
                    alert(e instanceof Error ? e.message : "Failed");
                  }
                }}
              >
                Soft delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
