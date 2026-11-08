import { ok } from "@/lib/api/response";
import { enrichPurchase, store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.purchases.map(enrichPurchase));
}
