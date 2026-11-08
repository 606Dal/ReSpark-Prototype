import { fail, ok } from "@/lib/api/response";
import { enrichPurchase, findUserByUuid, getProductById, store } from "@/lib/mock/store";
import type { Payment, Purchase } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    productId?: number;
    buyerUuid?: string;
    paymentMethod?: string;
  };

  if (!body.productId || !body.buyerUuid || !body.paymentMethod) {
    return fail("productId, buyerUuid, and paymentMethod are required.");
  }

  const product = getProductById(body.productId);
  if (!product) return fail("Product not found.", 404);
  if (product.status !== "ON_SALE") return fail("Product is not available.");

  const buyer = findUserByUuid(body.buyerUuid);
  if (!buyer) return fail("Buyer not found.", 404);

  const purchase: Purchase = {
    id: store.nextIds.purchase++,
    purchaseUuid: `ORD-2026-${String(store.nextIds.purchase).padStart(5, "0")}`,
    sellerUuid: product.sellerUuid,
    buyerUuid: buyer.uuid,
    productId: product.id,
    tradeStatus: "IN_PROGRESS",
    cancelReason: null,
    canceledBy: null,
    createdAt: new Date().toISOString(),
    paymentMethod: body.paymentMethod,
    amount: product.price,
  };

  product.status = "RESERVED";
  store.purchases.unshift(purchase);

  const fee = Number((product.price * 0.05).toFixed(2));
  const payment: Payment = {
    id: store.nextIds.payment++,
    buyerId: buyer.id,
    amount: product.price,
    paymentMethod: body.paymentMethod,
    platformFee: fee,
    status: "APPROVED",
    productNameSnapshot: product.title,
    productPriceSnapshot: product.price,
    tradeId: purchase.id,
    approvedAt: new Date().toISOString(),
    mock: true,
  };

  return ok(
    { payment, purchase: enrichPurchase(purchase) },
    "Mock payment approved. Stripe/PayPal not connected."
  );
}
