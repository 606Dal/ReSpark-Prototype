import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.alarmTemplates);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.body) return fail("title and body required");
  const item = {
    id: store.nextIds.alarm++,
    type: body.type || "SYSTEM",
    title: body.title,
    body: body.body,
  };
  store.alarmTemplates.unshift(item);
  return ok(item, undefined, { status: 201 });
}
