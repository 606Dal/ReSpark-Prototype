import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.alarmTemplates.find((a) => a.id === Number(id));
  if (!item) return fail("Not found", 404);
  const body = await request.json();
  Object.assign(item, {
    type: body.type ?? item.type,
    title: body.title ?? item.title,
    body: body.body ?? item.body,
  });
  return ok(item);
}

export async function DELETE(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const idx = store.alarmTemplates.findIndex((a) => a.id === Number(id));
  if (idx < 0) return fail("Not found", 404);
  store.alarmTemplates.splice(idx, 1);
  return ok({ id: Number(id) });
}
