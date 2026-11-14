import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.reports.find((r) => r.id === Number(id));
  if (!item) return fail("Not found", 404);
  return ok(item);
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.reports.find((r) => r.id === Number(id));
  if (!item) return fail("Not found", 404);
  const body = (await request.json()) as { action?: "accept" | "reject" | "review" };
  if (body.action === "accept") item.status = "RESOLVED";
  else if (body.action === "reject") item.status = "REJECTED";
  else if (body.action === "review") item.status = "REVIEWING";
  else return fail("Unknown action");
  return ok(item, `Report ${body.action} (mock)`);
}
