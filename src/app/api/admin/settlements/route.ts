import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(
    [...store.settlements].sort(
      (a, b) => +new Date(b.requestedAt) - +new Date(a.requestedAt)
    )
  );
}
