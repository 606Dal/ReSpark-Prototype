import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userUuid = new URL(request.url).searchParams.get("userUuid");
  let list = store.restrictions;
  if (userUuid) list = list.filter((r) => r.userUuid === userUuid);
  return ok(list);
}
