import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.toLowerCase() ?? "";
  let list = store.users;
  if (q) {
    list = list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }
  return ok([...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)));
}
