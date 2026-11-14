import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.settlements.find((s) => s.id === Number(id));
  if (!item) return fail("Not found", 404);
  const body = (await request.json()) as { action?: "request" | "cancel" | "complete" };
  if (body.action === "request") {
    item.status = "PROCESSING";
    item.requestedAt = new Date().toISOString();
  } else if (body.action === "complete") {
    item.status = "COMPLETED";
    item.completedAt = new Date().toISOString();
  } else if (body.action === "cancel") {
    item.status = "CANCELED";
  } else return fail("Unknown action");
  return ok(item, `Settlement ${body.action} (mock · no PG)`);
}
