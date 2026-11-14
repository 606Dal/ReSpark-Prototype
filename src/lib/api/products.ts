import type { Product } from "@/types";
import { apiFetch } from "./client";

export type ProductListParams = {
  q?: string;
  country?: string;
  status?: string;
  categoryId?: string;
  sort?: "latest" | "popular" | "price_asc" | "price_desc";
  sellerUuid?: string;
  minPrice?: string;
  maxPrice?: string;
};

export async function fetchProducts(params: ProductListParams = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  const query = qs.toString();
  return apiFetch<Product[]>(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProduct(id: number | string) {
  return apiFetch<Product>(`/api/products/${id}`);
}

export async function createProduct(input: {
  title: string;
  description: string;
  price: number;
  categoryIds: number[];
  country: string;
  condition: Product["condition"];
  deliveryFee: boolean;
  sellerUuid: string;
}) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProductStatus(
  id: number,
  status: Product["status"]
) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateProduct(
  id: number,
  input: Partial<{
    title: string;
    description: string;
    price: number;
    deliveryFee: boolean;
    categoryIds: number[];
    status: Product["status"];
  }>
) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: number) {
  return apiFetch<{ id: number }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}
