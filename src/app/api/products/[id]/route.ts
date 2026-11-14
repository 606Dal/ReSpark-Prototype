import { fail, ok } from "@/lib/api/response";
import { getProductById, store } from "@/lib/mock/store";
import type { ProductStatus } from "@/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const product = getProductById(Number(id));
  if (!product) return fail("Product not found.", 404);

  product.viewCount += 1;
  return ok(product);
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const product = getProductById(Number(id));
  if (!product) return fail("Product not found.", 404);

  if (product.status === "SOLD") {
    return fail("Sold products cannot be modified.");
  }

  const body = (await request.json()) as {
    status?: ProductStatus;
    title?: string;
    description?: string;
    price?: number;
    deliveryFee?: boolean;
    categoryIds?: number[];
  };

  if (body.status) {
    product.status = body.status;
  }
  if (typeof body.title === "string") product.title = body.title;
  if (typeof body.description === "string") product.description = body.description;
  if (typeof body.price === "number") {
    if (body.price < 0 || body.price > 100) {
      return fail("Price must be USD 0–100 (requirements v2).");
    }
    product.price = body.price;
  }
  if (typeof body.deliveryFee === "boolean") product.deliveryFee = body.deliveryFee;
  if (Array.isArray(body.categoryIds)) product.categoryIds = body.categoryIds;

  return ok(product, "Product updated (mock)");
}

export async function DELETE(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const product = store.products.find((p) => p.id === Number(id));
  if (!product || product.deleted) return fail("Product not found.", 404);
  if (product.status === "RESERVED") {
    return fail("Reserved products cannot be deleted.");
  }

  product.deleted = true;
  return ok({ id: product.id }, "Soft-deleted (mock). Media kept for 3 months.");
}
