import { ok } from "@/lib/api/response";
import { resetStore } from "@/lib/mock/store";

export async function POST() {
  resetStore();
  return ok({ reset: true }, "Demo mock store reset");
}
