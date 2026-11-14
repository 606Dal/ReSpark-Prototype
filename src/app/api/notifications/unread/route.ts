import { ok } from "@/lib/api/response";
import { store } from "@/lib/mock/store";

export async function GET() {
  const chatUnread = store.chats
    .filter((c) => !c.deleted)
    .reduce((s, c) => s + (c.unreadCount || 0), 0);
  const notifUnread = store.notifications.filter((n) => !n.read).length;
  return ok({ count: chatUnread + notifUnread, chatUnread, notifUnread });
}
