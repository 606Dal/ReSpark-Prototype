import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");
  let list = store.reviews;
  if (userId) list = list.filter((r) => r.userId === Number(userId));
  if (productId) list = list.filter((r) => r.productId === Number(productId));
  return ok(list);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.userId || !body.rating || !body.productTitle) {
    return fail("userId, rating, productTitle required");
  }
  const user = store.users.find((u) => u.id === body.userId);
  const item = {
    id: store.nextIds.review++,
    tradeId: body.tradeId ?? 0,
    userId: body.userId,
    productId: Number(body.productId) || 0,
    rating: Number(body.rating),
    content: body.content ?? null,
    createdAt: new Date().toISOString(),
    productTitle: body.productTitle,
    authorNickname: user?.nickname ?? "User",
  };
  store.reviews.unshift(item);
  return ok(item, undefined, { status: 201 });
}
