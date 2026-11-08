import { fail, ok } from "@/lib/api/response";
import { findUserByEmail, store } from "@/lib/mock/store";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return fail("Email and password are required.");
  }

  const user = findUserByEmail(email);
  const expected = store.passwords[email.toLowerCase()] ?? store.passwords[email];

  if (!user || !expected || expected !== password) {
    return fail("Invalid email or password.", 401);
  }

  if (user.status === "SUSPENDED" || user.status === "BANNED") {
    return fail("This account is suspended.", 403);
  }

  return ok(
    {
      user,
      token: `mock-token-${user.uuid}`,
      mock: true as const,
    },
    "Mock login succeeded"
  );
}
