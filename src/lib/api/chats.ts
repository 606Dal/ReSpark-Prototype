import type { ChatMessage, ChatRoom } from "@/types";
import { apiFetch } from "./client";

export async function fetchChats() {
  return apiFetch<ChatRoom[]>("/api/chats");
}

export async function createChat(productId: number) {
  return apiFetch<ChatRoom>("/api/chats", {
    method: "POST",
    body: JSON.stringify({ productId }),
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
