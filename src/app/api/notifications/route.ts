import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const userUuid = new URL(request.url).searchParams.get("userUuid");
  let list = store.notifications;
  if (userUuid) list = list.filter((n) => n.userUuid === userUuid);
  list = [...list]
    .sort((a, b) => +new Date(b.sentAt) - +new Date(a.sentAt))
    .slice(0, 50);
  return ok(list);
}
