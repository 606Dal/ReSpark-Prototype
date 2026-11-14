import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.destinations.find((d) => d.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  if (item.defaultAddress) return fail("Default address cannot be deleted.");
  item.deleted = true;
  return ok({ id: item.id });
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const item = store.destinations.find((d) => d.id === Number(id));
  if (!item || item.deleted) return fail("Not found", 404);
  const body = await request.json();
  if (body.defaultAddress) {
    store.destinations.forEach((d) => {
      if (d.userId === item.userId) d.defaultAddress = false;
    });
  }
  Object.assign(item, {
    name: body.name ?? item.name,
    phoneNumber: body.phoneNumber ?? item.phoneNumber,
    address: body.address ?? item.address,
    detailedAddress: body.detailedAddress ?? item.detailedAddress,
    postcode: body.postcode ?? item.postcode,
    defaultAddress: body.defaultAddress ?? item.defaultAddress,
  });
  return ok(item);
}
