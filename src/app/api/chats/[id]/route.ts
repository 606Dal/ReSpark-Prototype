import { fail, ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Ctx) {
  const { id } = await context.params;
  const chat = store.chats.find((c) => c.id === Number(id) && !c.deleted);
  if (!chat) return fail("Chat not found", 404);
  return ok(chat);
}

export async function PATCH(request: Request, context: Ctx) {
  const { id } = await context.params;
  const chat = store.chats.find((c) => c.id === Number(id));
  if (!chat || chat.deleted) return fail("Chat not found", 404);

  const body = (await request.json()) as {
    action?: "purchase_request" | "accept" | "leave" | "delete" | "read";
    actorId?: number;
  };

  const now = new Date().toISOString();

  if (body.action === "read") {
    chat.unreadCount = 0;
    return ok(chat);
  }

  if (body.action === "leave" || body.action === "delete") {
    chat.deleted = true;
    return ok(chat, "Chat soft-deleted (mock)");
  }

  if (body.action === "purchase_request") {
    chat.purchaseRequested = true;
    const msg = {
      id: store.nextIds.message++,
      chatId: chat.id,
      senderId: body.actorId ?? chat.buyerId,
      content: "Purchase request sent.",
      sourceLanguage: "en",
      messageType: "SYSTEM" as const,
      sentAt: now,
      warningType: null,
      meta: { action: "PURCHASE_REQUEST" as const, productId: chat.productId },
    };
    store.messages.push(msg);
    chat.lastMessageAt = now;
    chat.lastMessagePreview = msg.content;
    chat.unreadCount += 1;
    return ok({ chat, message: msg });
  }

  if (body.action === "accept") {
    if (!chat.purchaseRequested) return fail("No purchase request.");
    chat.purchaseAccepted = true;
    const msg = {
      id: store.nextIds.message++,
      chatId: chat.id,
      senderId: body.actorId ?? chat.sellerId,
      content: "Seller accepted. Complete seller info, then buyer can pay.",
      sourceLanguage: "en",
      messageType: "SYSTEM" as const,
      sentAt: now,
      warningType: null,
      meta: { action: "ACCEPT" as const, productId: chat.productId },
    };
    const pay = {
      id: store.nextIds.message++,
      chatId: chat.id,
      senderId: 0,
      content: "Payment is ready.",
      sourceLanguage: "en",
      messageType: "SYSTEM" as const,
      sentAt: now,
      warningType: null,
      meta: { action: "PAY_LINK" as const, productId: chat.productId },
    };
    store.messages.push(msg, pay);
    chat.lastMessageAt = now;
    chat.lastMessagePreview = pay.content;
    return ok({ chat, message: pay });
  }

  return fail("Unknown action");
}
