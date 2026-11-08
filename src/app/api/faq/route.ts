import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  return ok(
    store.faq
      .filter((f) => f.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
}
