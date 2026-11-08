import { fail, ok } from "@/lib/api/response";
import { enrichPurchase, store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const purchase = store.purchases.find((p) => p.id === Number(id));
  if (!purchase) return fail("Purchase not found.", 404);
  return ok(enrichPurchase(purchase));
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const purchase = store.purchases.find((p) => p.id === Number(id));
  if (!purchase) return fail("Purchase not found.", 404);

  const body = (await request.json()) as {
    action?: "confirm" | "cancel";
    cancelReason?: string;
  };

  if (body.action === "confirm") {
    purchase.tradeStatus = "CONFIRMED";
    return ok(enrichPurchase(purchase), "Purchase confirmed (mock)");
  }

  if (body.action === "cancel") {
    const reason = body.cancelReason?.trim() ?? "";
    if (reason.length < 10) {
      return fail("Cancel reason must be at least 10 characters.");
    }
    purchase.tradeStatus = "CANCELED";
    purchase.cancelReason = reason;
    purchase.canceledBy = "BUYER";
    return ok(enrichPurchase(purchase), "Cancel requested (mock)");
  }

  return fail("Unknown action.");
}
