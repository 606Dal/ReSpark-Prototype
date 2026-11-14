import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userId = Number(new URL(request.url).searchParams.get("userId"));
  if (!userId) return fail("userId required");
  return ok(store.accounts.filter((a) => a.userId === userId && !a.deleted));
}

export async function POST(request: Request) {
  const body = await request.json();
  const list = store.accounts.filter((a) => a.userId === body.userId && !a.deleted);
  if (list.length >= 5) return fail("Up to 5 accounts allowed.");
  if (body.basicAccount) {
    store.accounts.forEach((a) => {
      if (a.userId === body.userId) a.basicAccount = false;
    });
  }
  const item = {
    id: store.nextIds.account++,
    userId: body.userId,
    name: body.name,
    accountNumber: body.accountNumber,
    bankName: body.bankName,
    bankCode: body.bankCode || "0000",
    basicAccount: Boolean(body.basicAccount) || list.length === 0,
    deleted: false,
  };
  store.accounts.push(item);
  return ok(item, undefined, { status: 201 });
}
