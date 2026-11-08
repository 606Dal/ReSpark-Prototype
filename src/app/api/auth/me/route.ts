import { fail, ok } from "@/lib/api/response";
import { findUserByUuid } from "@/lib/mock/store";

export async function GET(request: Request) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  const uuid = token.replace(/^mock-token-/, "");

  if (!uuid) {
    return fail("Unauthorized", 401);
  }

  const user = findUserByUuid(uuid);
  if (!user) {
    return fail("Unauthorized", 401);
  }

  return ok(user);
}
