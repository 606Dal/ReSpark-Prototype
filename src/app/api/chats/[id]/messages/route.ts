import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

const recentSends = new Map<number, number[]>();

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const chatId = Number(id);
  const chat = store.chats.find((c) => c.id === chatId && !c.deleted);
  if (!chat) return fail("Chat not found.", 404);

  return ok(
    store.messages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => +new Date(a.sentAt) - +new Date(b.sentAt))
  );
}

export async function POST(request: Request, context: Ctx) {
  const { id } = await context.params;
  const chatId = Number(id);
  const chat = store.chats.find((c) => c.id === chatId && !c.deleted);
  if (!chat) return fail("Chat not found.", 404);

  const body = (await request.json()) as {
    content?: string;
    senderId?: number;
    messageType?: "TEXT" | "IMAGE" | "VIDEO";
  };

  if (!body.content?.trim() || !body.senderId) {
    return fail("content and senderId are required.");
  }

  const now = Date.now();
  const stamps = (recentSends.get(body.senderId) ?? []).filter((t) => now - t < 1000);
  stamps.push(now);
  recentSends.set(body.senderId, stamps);
  if (stamps.length >= 5) {
    return fail("Too many messages. Chat paused for 10 seconds (mock flood control).", 429);
  }

  const lower = body.content.toLowerCase();
  const suspicious =
    lower.includes("bank transfer") ||
    lower.includes("kakao") ||
    lower.includes("외부") ||
    lower.includes("계좌");

  const message = {
    id: store.nextIds.message++,
    chatId,
    senderId: body.senderId,
    content: body.content.trim(),
    sourceLanguage: "en",
    messageType: (body.messageType || "TEXT") as "TEXT" | "IMAGE" | "VIDEO",
    sentAt: new Date().toISOString(),
    warningType: suspicious ? "EXTERNAL_PAYMENT" : null,
    meta: suspicious
      ? { action: "WARNING" as const }
      : undefined,
  };

  store.messages.push(message);
  if (suspicious) {
    store.messages.push({
      id: store.nextIds.message++,
      chatId,
      senderId: 0,
      content: "Warning: external payment or personal data sharing is not allowed.",
      sourceLanguage: "en",
      messageType: "SYSTEM",
      sentAt: new Date().toISOString(),
      warningType: "EXTERNAL_PAYMENT",
      meta: { action: "WARNING" },
    });
  }

  chat.lastMessageAt = message.sentAt;
  chat.lastMessagePreview = message.content ?? "";
  chat.unreadCount += 1;

  return ok(message, "Message sent (mock)", { status: 201 });
}
