"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchChats } from "@/lib/api/chats";
import { formatDate } from "@/lib/format";
import type { ChatRoom } from "@/types";

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChats()
      .then((res) => setChats(res.data))
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">Chats</h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">
        Realtime translation / spam throttling are mocked. Messages persist in memory only.
      </p>
      {error && <p className="text-rose-700">{error}</p>}
      <div className="space-y-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="panel block p-4 transition hover:border-brand/40"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{chat.productTitle}</p>
              <span className="text-xs text-muted">
                {chat.lastMessageAt ? formatDate(chat.lastMessageAt) : ""}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {chat.counterpartNickname}: {chat.lastMessagePreview}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
