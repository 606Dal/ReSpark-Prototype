import type { Purchase } from "@/types";
import { apiFetch } from "./client";

export async function fetchPurchases(buyerUuid: string) {
  return apiFetch<Purchase[]>(
    `/api/purchases?buyerUuid=${encodeURIComponent(buyerUuid)}`
  );
}

export async function fetchSales(sellerUuid: string) {
  return apiFetch<Purchase[]>(
    `/api/purchases?sellerUuid=${encodeURIComponent(sellerUuid)}`
  );
}

export async function fetchPurchase(id: number | string) {
  return apiFetch<Purchase>(`/api/purchases/${id}`);
}

export async function confirmPurchase(id: number) {
  return apiFetch<Purchase>(`/api/purchases/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action: "confirm" }),
  });
}

export async function cancelPurchase(id: number, cancelReason: string) {
  return apiFetch<Purchase>(`/api/purchases/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action: "cancel", cancelReason }),
  });
}
