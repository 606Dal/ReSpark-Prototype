import type { WishItem } from "@/types";
import { apiFetch } from "./client";

export async function fetchWishlist(userUuid: string) {
  return apiFetch<WishItem[]>(`/api/wishlist?userUuid=${encodeURIComponent(userUuid)}`);
}

export async function toggleWishlist(userUuid: string, productId: number) {
  return apiFetch<{ wished: boolean; item: WishItem | null }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ userUuid, productId }),
  });
}
