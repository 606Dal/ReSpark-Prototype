import { fail, ok } from "@/lib/api/response";
import { enrichPurchase, store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const buyerUuid = searchParams.get("buyerUuid");
  const sellerUuid = searchParams.get("sellerUuid");

  let list = store.purchases;
  if (buyerUuid) list = list.filter((p) => p.buyerUuid === buyerUuid);
  if (sellerUuid) list = list.filter((p) => p.sellerUuid === sellerUuid);
  if (!buyerUuid && !sellerUuid) return fail("buyerUuid or sellerUuid required.");

  return ok(list.map(enrichPurchase));
}
