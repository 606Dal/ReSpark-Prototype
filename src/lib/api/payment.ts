import type { Payment, Purchase } from "@/types";
import { apiFetch } from "./client";

export async function createMockPayment(input: {
  productId: number;
  buyerUuid: string;
  paymentMethod: string;
}) {
  return apiFetch<{ payment: Payment; purchase: Purchase }>("/api/payment", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
