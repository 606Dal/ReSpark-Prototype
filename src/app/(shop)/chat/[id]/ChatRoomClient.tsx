"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconBack } from "@/components/common/Icons";
import { MockBadge } from "@/components/common/MockBadge";
import { Modal } from "@/components/common/Modal";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/components/providers/LocaleProvider";
import { fetchMessages, patchChat, sendMessage } from "@/lib/api/chats";
import { readUser } from "@/lib/auth/session";
import type { ChatMessage, ChatRoom, User } from "@/types";

export function ChatRoomClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { push } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [chat, setChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [showTranslated, setShowTranslated] = useState<Record<number, boolean>>({});
  const [translating, setTranslating] = useState<number | null>(null);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const sync = () => setUser(readUser());
    sync();
    window.addEventListener("respark-auth", sync);
    return () => window.removeEventListener("respark-auth", sync);
  }, []);

  const load = useCallback(async () => {
    const [msgs, room] = await Promise.all([
      fetchMessages(params.id),
      fetch(`/api/chats/${params.id}`).then((r) => r.json()),
    ]);
    setMessages(msgs.data);
    if (room.success) setChat(room.data);
    await patchChat(params.id, "read");
  }, [params.id]);

  useEffect(() => {
    load().catch((e: Error) => setError(e.message));
  }, [load]);

  async function translateMsg(m: ChatMessage) {
    if (!m.content) return;
    setTranslating(m.id);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: m.content,
          targetLanguage: locale === "ko" ? "ko" : "en",
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setTranslations((prev) => ({ ...prev, [m.id]: json.data.translatedText }));
      setShowTranslated((prev) => ({ ...prev, [m.id]: true }));
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.translateFailed"), "err");
    } finally {
      setTranslating(null);
    }
  }

  async function confirmLeave() {
    setLeaving(true);
    try {
      await patchChat(params.id, "leave");
      setLeaveOpen(false);
      router.push("/chat");
    } catch (e) {
      push(e instanceof Error ? e.message : t("common.error"), "err");
    } finally {
      setLeaving(false);
    }
  }

  const myId = user?.id != null ? Number(user.id) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="display text-2xl font-bold">
            {t("chat.roomTitle")} #{params.id}
          </h1>
          <MockBadge />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-ghost h-10 text-sm"
            onClick={() => setLeaveOpen(true)}
          >
            {t("chat.leave")}
          </button>
          <Link
            href="/chat"
            className="btn btn-ghost h-10 w-10 px-0"
            aria-label={t("common.back")}
            title={t("common.back")}
          >
            <IconBack className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>

      {chat && (
        <div className="panel flex flex-wrap items-center gap-2 p-3 text-sm">
          <span className="font-semibold">{chat.productTitle}</span>
          {chat.purchaseRequested && !chat.purchaseAccepted && myId === Number(chat.sellerId) && (
            <button
              className="btn btn-primary text-sm"
              onClick={async () => {
                await patchChat(params.id, "accept", myId);
                router.push(`/trade/${params.id}/seller-info`);
              }}
            >
              {t("chat.accept")}
            </button>
          )}
          {chat.purchaseAccepted && (
            <Link href={`/payment/${chat.productId}`} className="btn btn-spark text-sm">
              {t("chat.payNow")}
            </Link>
          )}
          {myId === Number(chat.buyerId) && !chat.purchaseRequested && (
            <button
              className="btn btn-ghost text-sm"
              onClick={async () => {
                await patchChat(params.id, "purchase_request", myId);
                await load();
                push(t("chat.purchaseRequest"), "ok");
              }}
            >
              {t("chat.purchaseRequest")}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-rose-700">{error}</p>}
      {!user && (
        <p className="panel p-3 text-sm text-amber-800">{t("common.loginRequired")}</p>
      )}

      <div className="panel flex max-h-[28rem] flex-col gap-3 overflow-y-auto p-4">
        {messages.map((m) => {
          const isSystem = m.messageType === "SYSTEM" || Number(m.senderId) === 0;
          const mine = !isSystem && myId != null && Number(m.senderId) === myId;
          const text =
            showTranslated[m.id] && translations[m.id] ? translations[m.id] : m.content;

          return (
            <div
              key={m.id}
              className={`flex w-full ${
                isSystem ? "justify-center" : mine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`w-fit max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm ${
                  isSystem
                    ? "bg-amber-50 text-center text-amber-900"
                    : mine
                      ? "bg-brand text-white"
                      : "bg-[#e8f2ed] text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap">{text}</p>
                {m.warningType && (
                  <p className={`mt-1 text-[11px] font-semibold ${mine ? "text-rose-100" : "text-rose-700"}`}>
                    {t("chat.warningExternal")}
                  </p>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>
                    {new Date(m.sentAt).toLocaleTimeString()}
                  </span>
                  {m.messageType === "TEXT" && m.content && (
                    <button
                      type="button"
                      className={`text-[10px] underline ${mine ? "text-white/90" : "text-brand"}`}
                      onClick={() => {
                        if (showTranslated[m.id]) {
                          setShowTranslated((p) => ({ ...p, [m.id]: false }));
                        } else if (translations[m.id]) {
                          setShowTranslated((p) => ({ ...p, [m.id]: true }));
                        } else {
                          translateMsg(m);
                        }
                      }}
                    >
                      {translating === m.id
                        ? t("common.translating")
                        : showTranslated[m.id]
                          ? t("common.showOriginal")
                          : t("common.translate")}
                    </button>
                  )}
                  {m.meta?.action === "PAY_LINK" && chat && (
                    <Link
                      href={`/payment/${chat.productId}`}
                      className="text-[10px] font-bold underline"
                    >
                      {t("chat.payNow")}
                    </Link>
                  )}
                  {m.meta?.action === "ACCEPT" && (
                    <Link
                      href={`/trade/${params.id}/seller-info`}
                      className="text-[10px] font-bold underline"
                    >
                      {t("chat.sellerInfo")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        className="flex flex-wrap gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) {
            push(t("common.loginRequired"), "err");
            return;
          }
          if (!content.trim()) return;
          try {
            await sendMessage(params.id, content, Number(user.id));
            setContent("");
            await load();
          } catch (err) {
            push(err instanceof Error ? err.message : t("common.error"), "err");
          }
        }}
      >
        <input
          className="input h-11 flex-1"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("chat.placeholder")}
        />
        <button
          type="button"
          className="btn btn-ghost h-11"
          onClick={() => push(t("chat.attach") + " — " + t("common.mockNotice"), "info")}
        >
          {t("chat.attach")}
        </button>
        <button className="btn btn-primary h-11" type="submit">
          {t("chat.send")}
        </button>
      </form>
      <p className="text-xs text-muted">{t("chat.hint")}</p>

      <Modal open={leaveOpen} title={t("chat.leaveConfirmTitle")} onClose={() => setLeaveOpen(false)}>
        <p className="mb-4 text-sm text-muted">{t("chat.leaveConfirmBody")}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => setLeaveOpen(false)}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={leaving}
            onClick={confirmLeave}
          >
            {leaving ? t("common.processing") : t("chat.leave")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
