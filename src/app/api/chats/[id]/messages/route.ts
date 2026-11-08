import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const chatId = Number(id);
  const chat = store.chats.find((c) => c.id === chatId);
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
  const chat = store.chats.find((c) => c.id === chatId);
  if (!chat) return fail("Chat not found.", 404);

  const body = (await request.json()) as {
    content?: string;
    senderId?: number;
  };

  if (!body.content?.trim() || !body.senderId) {
    return fail("content and senderId are required.");
  }

  const message = {
    id: store.nextIds.message++,
    chatId,
    senderId: body.senderId,
    content: body.content.trim(),
    sourceLanguage: "en",
    messageType: "TEXT" as const,
    sentAt: new Date().toISOString(),
    warningType: null,
  };

  store.messages.push(message);
  chat.lastMessageAt = message.sentAt;
  chat.lastMessagePreview = message.content ?? "";

  return ok(message, "Message sent (mock). Translation APIs not connected.", {
    status: 201,
  });
}
