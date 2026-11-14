import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.categories.find((c) => c.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  const body = await request.json();
  if (body.name) item.name = body.name;
  return ok(item);
}

export async function DELETE(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.categories.find((c) => c.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  const hasChild = store.categories.some(
    (c) => !c.deleted && c.categoryParentId === item.id
  );
  if (hasChild) return fail("Cannot delete category with children");
  const hasProduct = store.products.some(
    (p) => !p.deleted && p.categoryIds.includes(item.id)
  );
  if (hasProduct) return fail("Cannot delete category with products");
  item.deleted = true;
  return ok({ id: item.id }, "Soft-deleted");
}
