import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userId?: number;
    description?: string;
  };

  if (!body.userId || !body.description?.trim()) {
    return fail("userId and description are required.");
  }

  const user = store.users.find((u) => u.id === body.userId);
  if (!user) return fail("User not found.", 404);

  const inquiry = {
    id: store.inquiries.length + 1,
    userId: user.id,
    userEmail: user.email,
    inquiredAt: new Date().toISOString(),
    description: body.description.trim(),
    status: "RECEIVED" as const,
  };

  store.inquiries.unshift(inquiry);
  return ok(inquiry, "Inquiry received (mock)", { status: 201 });
}
