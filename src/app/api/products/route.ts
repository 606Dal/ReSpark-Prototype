import { fail, ok } from "@/lib/api/response";
import { findUserByUuid, store } from "@/lib/mock/store";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const country = searchParams.get("country") ?? "";
  const status = searchParams.get("status") ?? "";
  const categoryId = searchParams.get("categoryId");
  const sellerUuid = searchParams.get("sellerUuid") ?? "";
  const sort = searchParams.get("sort") ?? "latest";

  let list = store.products.filter((p) => !p.deleted);

  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (country) list = list.filter((p) => p.country === country);
  if (status) list = list.filter((p) => p.status === status);
  if (categoryId) {
    const id = Number(categoryId);
    list = list.filter((p) => p.categoryIds.includes(id));
  }
  if (sellerUuid) list = list.filter((p) => p.userUuid === sellerUuid);

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "popular":
        return b.likeCount - a.likeCount;
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "latest":
      default:
        return +new Date(b.createdAt) - +new Date(a.createdAt);
    }
  });

  return ok(list);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Product> & {
    sellerUuid?: string;
  };

  if (!body.title?.trim()) return fail("Title is required.");
  if (!body.description || body.description.trim().length < 10) {
    return fail("Description must be at least 10 characters.");
  }
  if (body.price == null || body.price < 0 || body.price > 1_000_000_000) {
    return fail("Price must be between 0 and 1,000,000,000.");
  }
  if (!body.sellerUuid) return fail("sellerUuid is required.");

  const seller = findUserByUuid(body.sellerUuid);
  if (!seller) return fail("Seller not found.", 404);

  const id = store.nextIds.product++;
  const product: Product = {
    id,
    userUuid: body.sellerUuid,
    title: body.title.trim(),
    description: body.description.trim(),
    price: Number(body.price),
    status: "ON_SALE",
    deliveryFee: Boolean(body.deliveryFee),
    deleted: false,
    categoryIds: body.categoryIds ?? [],
    country: body.country ?? "KR",
    condition: body.condition ?? "USED_A",
    viewCount: 0,
    likeCount: 0,
    createdAt: new Date().toISOString(),
    media: [
      {
        id: id * 10,
        productId: id,
        thumbnailed: true,
        displayOrder: 0,
        expiredAt: "2027-02-07T00:00:00Z",
        fileType: "IMAGE",
        fileName: `/mock/new-${id}.jpg`,
        fileSize: 120_000,
        url: `https://picsum.photos/seed/respark-new-${id}/640/640`,
      },
    ],
    sellerNickname: seller.nickname,
    sellerUuid: seller.uuid,
  };

  store.products.unshift(product);
  return ok(product, "Product created (mock)", { status: 201 });
}
