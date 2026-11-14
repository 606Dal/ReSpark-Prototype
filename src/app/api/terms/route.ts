import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.terms);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.content || !body.version) {
    return fail("title, version, content required");
  }
  const item = {
    id: store.nextIds.terms++,
    title: body.title,
    version: body.version,
    content: body.content,
    required: body.required !== false,
  };
  store.terms.push(item);
  return ok(item, "Terms can only be added (not edited/deleted)", { status: 201 });
}
