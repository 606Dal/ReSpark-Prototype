import { fail, ok } from "@/lib/api/response";
import { findUserByUuid, getProductById, store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId") || 0);
  let list = store.chats.filter((c) => !c.deleted);
  if (userId) {
    list = list.filter((c) => c.buyerId === userId || c.sellerId === userId);
  }
  return ok(list);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    productId?: number;
    buyerUuid?: string;
  };
  if (!body.productId) return fail("productId is required.");

  const product = getProductById(body.productId);
  if (!product) return fail("Product not found.", 404);

  const buyer = body.buyerUuid ? findUserByUuid(body.buyerUuid) : store.users[0];
  const seller = findUserByUuid(product.sellerUuid);
  if (seller?.status === "SUSPENDED" || seller?.status === "BANNED") {
    return fail("Suspended users cannot create chats.", 403);
  }

  const existing = store.chats.find(
    (c) => c.productId === body.productId && !c.deleted && c.buyerId === (buyer?.id ?? 1)
  );
  if (existing) return ok(existing, "Existing chat returned");

  const chat = {
    id: store.nextIds.chat++,
    productId: product.id,
    buyerId: buyer?.id ?? 1,
    sellerId: seller?.id ?? 2,
    lastMessageAt: new Date().toISOString(),
    productTitle: product.title,
    counterpartNickname: product.sellerNickname,
    lastMessagePreview: "Chat started",
    unreadCount: 0,
    purchaseRequested: false,
    purchaseAccepted: false,
    deleted: false,
  };
  store.chats.unshift(chat);
  return ok(chat, "Chat created (mock)", { status: 201 });
}
