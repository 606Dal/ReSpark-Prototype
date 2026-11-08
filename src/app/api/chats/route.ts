import { fail, ok } from "@/lib/api/response";
import { getProductById, store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.chats);
}

export async function POST(request: Request) {
  const body = (await request.json()) as { productId?: number };
  if (!body.productId) return fail("productId is required.");

  const product = getProductById(body.productId);
  if (!product) return fail("Product not found.", 404);

  const existing = store.chats.find((c) => c.productId === body.productId);
  if (existing) return ok(existing, "Existing chat returned");

  const chat = {
    id: store.nextIds.chat++,
    productId: product.id,
    lastMessageAt: new Date().toISOString(),
    productTitle: product.title,
    counterpartNickname: product.sellerNickname,
    lastMessagePreview: "Chat started",
  };
  store.chats.unshift(chat);
  return ok(chat, "Chat created (mock)", { status: 201 });
}
