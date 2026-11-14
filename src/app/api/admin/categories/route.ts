import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.categories.filter((c) => !c.deleted));
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name) return fail("name required");
  const parentId = body.categoryParentId ?? null;
  let depth = 1;
  if (parentId != null) {
    const parent = store.categories.find((c) => c.id === parentId && !c.deleted);
    if (!parent) return fail("Parent category not found");
    depth = parent.depth + 1;
  }
  const dup = store.categories.find(
    (c) =>
      !c.deleted &&
      c.categoryParentId === parentId &&
      c.name.toLowerCase() === String(body.name).toLowerCase()
  );
  if (dup) return fail("Duplicate name under same parent");
  const item = {
    id: store.nextIds.category++,
    categoryParentId: parentId,
    depth,
    name: String(body.name).trim(),
    deleted: false,
  };
  // Newest first within same parent (admin UI shows create-at-top)
  store.categories.unshift(item);
  return ok(item, undefined, { status: 201 });
}
