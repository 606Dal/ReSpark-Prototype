import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.accounts.find((a) => a.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  item.deleted = true;
  return ok({ id: item.id });
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.accounts.find((a) => a.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  const body = await request.json();
  if (body.basicAccount) {
    store.accounts.forEach((a) => {
      if (a.userId === item.userId) a.basicAccount = false;
    });
    item.basicAccount = true;
  }
  Object.assign(item, {
    name: body.name ?? item.name,
    accountNumber: body.accountNumber ?? item.accountNumber,
    bankName: body.bankName ?? item.bankName,
    bankCode: body.bankCode ?? item.bankCode,
  });
  return ok(item);
}
