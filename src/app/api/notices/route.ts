import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(store.notices.filter((n) => n.published));
}
