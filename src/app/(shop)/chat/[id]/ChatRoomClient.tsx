"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchMessages, sendMessage } from "@/lib/api/chats";
import { readUser } from "@/lib/auth/session";
import type { ChatMessage } from "@/types";

export function ChatRoomClient() {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await fetchMessages(params.id);
    setMessages(res.data);
  }

  useEffect(() => {
    load().catch((e: Error) => setError(e.message));
  }, [params.id]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="display text-2xl font-bold">Chat #{params.id}</h1>
          <MockBadge label="NO TRANSLATION" />
        </div>
        <Link href="/chat" className="text-sm font-semibold text-brand">
          Back
        </Link>
      </div>

      {error && <p className="text-rose-700">{error}</p>}

      <div className="panel flex max-h-[28rem] flex-col gap-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const mine = readUser()?.id === m.senderId;
          return (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                mine ? "ml-auto bg-brand text-white" : "bg-[#e8f2ed] text-ink"
              }`}
            >
              <p>{m.content}</p>
              <p className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>
                {new Date(m.sentAt).toLocaleTimeString()}
              </p>
            </div>
          );
        })}
      </div>

      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const user = readUser();
          if (!user) {
            alert("Login required");
            return;
          }
          if (!content.trim()) return;
          try {
            await sendMessage(params.id, content, user.id);
            setContent("");
            await load();
          } catch (err) {
            alert(err instanceof Error ? err.message : "Failed");
          }
        }}
      >
        <input
          className="input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}
