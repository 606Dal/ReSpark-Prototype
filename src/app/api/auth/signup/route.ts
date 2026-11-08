import { fail, ok } from "@/lib/api/response";
import { findUserByEmail, store } from "@/lib/mock/store";
import type { User } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    nickname?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";
  const nickname = body.nickname?.trim() ?? "";

  if (!email || !password || !nickname) {
    return fail("Email, password, and nickname are required.");
  }

  if (findUserByEmail(email)) {
    return fail("Email already registered.", 409);
  }

  const id = store.users.length + 1;
  const user: User = {
    id,
    uuid: crypto.randomUUID(),
    email,
    status: "ACTIVE",
    nickname,
    membershipTf: false,
    reportCount: 0,
    lastLoginAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    role: "USER",
  };

  store.users.push(user);
  store.passwords[email] = password;

  return ok(
    {
      user,
      token: `mock-token-${user.uuid}`,
      mock: true as const,
    },
    "Mock signup succeeded"
  );
}
