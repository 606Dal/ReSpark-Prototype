"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IconChat } from "@/components/common/Icons";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchChats } from "@/lib/api/chats";
import { readUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import type { ChatRoom } from "@/types";

export default function ChatListPage() {
  const { t } = useI18n();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = readUser();
    const qs = user ? `?userId=${user.id}` : "";
    fetch(`/api/chats${qs}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) throw new Error(j.message);
        setChats(j.data);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <IconChat className="h-6 w-6 text-brand" aria-hidden />
        <h1 className="display text-3xl font-bold">{t("chat.title")}</h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">{t("chat.hint")}</p>
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
              <div className="flex items-center gap-2">
                {(chat.unreadCount ?? 0) > 0 && (
                  <span className="rounded-full bg-spark px-2 text-[10px] font-bold text-white">
                    {chat.unreadCount}
                  </span>
                )}
                <span className="text-xs text-muted">
                  {chat.lastMessageAt ? formatDate(chat.lastMessageAt) : ""}
                </span>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted">
              {chat.counterpartNickname}: {chat.lastMessagePreview}
            </p>
          </Link>
        ))}
        {chats.length === 0 && !error && (
          <p className="panel p-8 text-center text-muted">{t("chat.empty")}</p>
        )}
      </div>
    </div>
  );
}
