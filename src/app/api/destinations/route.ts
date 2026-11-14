import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));
  if (!userId) return fail("userId required");
  return ok(store.destinations.filter((d) => d.userId === userId && !d.deleted));
}

export async function POST(request: Request) {
  const body = await request.json();
  const required = ["name", "phoneNumber", "address", "detailedAddress", "postcode", "userId"];
  for (const k of required) {
    if (!body[k]) return fail(`${k} is required`);
  }
  if (body.defaultAddress) {
    store.destinations.forEach((d) => {
      if (d.userId === body.userId) d.defaultAddress = false;
    });
  }
  const item = {
    id: store.nextIds.destination++,
    userId: body.userId,
    uuid: crypto.randomUUID(),
    name: body.name,
    phoneNumber: body.phoneNumber,
    address: body.address,
    detailedAddress: body.detailedAddress,
    postcode: body.postcode,
    defaultAddress:
      Boolean(body.defaultAddress) ||
      !store.destinations.some((d) => d.userId === body.userId && !d.deleted),
    deleted: false,
  };
  store.destinations.push(item);
  return ok(item, undefined, { status: 201 });
}
