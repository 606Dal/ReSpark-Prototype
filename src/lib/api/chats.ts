import type { ChatMessage, ChatRoom } from "@/types";
import { apiFetch } from "./client";

export async function fetchChats() {
  return apiFetch<ChatRoom[]>("/api/chats");
}

export async function createChat(productId: number, buyerUuid?: string) {
  return apiFetch<ChatRoom>("/api/chats", {
    method: "POST",
    body: JSON.stringify({ productId, buyerUuid }),
  });
}

export async function patchChat(
  chatId: number | string,
  action: string,
  actorId?: number
) {
  return apiFetch(`/api/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({ action, actorId }),
  });
}

export async function fetchMessages(chatId: number | string) {
  return apiFetch<ChatMessage[]>(`/api/chats/${chatId}/messages`);
}

export async function sendMessage(
  chatId: number | string,
  content: string,
  senderId: number
) {
  return apiFetch<ChatMessage>(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content, senderId }),
  });
}
