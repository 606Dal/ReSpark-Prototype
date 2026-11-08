import { fail, ok } from "@/lib/api/response";
import { enrichWish, store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userUuid = new URL(request.url).searchParams.get("userUuid");
  if (!userUuid) return fail("userUuid is required.");

  const list = store.wishlist
    .filter((w) => w.userUuid === userUuid)
    .map(enrichWish);

  return ok(list);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userUuid?: string;
    productId?: number;
  };

  if (!body.userUuid || !body.productId) {
    return fail("userUuid and productId are required.");
  }

  const existing = store.wishlist.find(
    (w) => w.userUuid === body.userUuid && w.productId === body.productId
  );

  if (existing) {
    store.wishlist = store.wishlist.filter((w) => w.id !== existing.id);
    return ok({ wished: false, item: null }, "Removed from wishlist");
  }

  const item = {
    id: store.nextIds.wish++,
    userUuid: body.userUuid,
    productId: body.productId,
  };
  store.wishlist.push(item);
  return ok({ wished: true, item: enrichWish(item) }, "Added to wishlist");
}
