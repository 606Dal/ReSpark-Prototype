"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { IconBell, IconChat, IconHeart, IconSearch, IconUser } from "@/components/common/Icons";
import { useI18n } from "@/components/providers/LocaleProvider";
import { clearSession, readUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";
import type { User } from "@/types";

function LangSelect({
  locale,
  setLocale,
  label,
  className = "",
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  label: string;
  className?: string;
}) {
  return (
    <select
      className={`h-8 rounded-md border border-line bg-white px-1.5 text-xs font-semibold text-muted ${className}`}
      value={locale}
      aria-label={label}
      title={label}
      onChange={(e) => setLocale(e.target.value as Locale)}
    >
      <option value="en">EN</option>
      <option value="ko">KO</option>
    </select>
  );
}

export function Header() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [q, setQ] = useState("");
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);

  useEffect(() => {
    const sync = () => setUser(readUser());
    sync();
    window.addEventListener("respark-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("respark-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    fetch("/api/notifications/unread")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setUnreadNotif(j.data?.count ?? 0);
      })
      .catch(() => undefined);

    if (!user) {
      setUnreadChat(0);
      return;
    }
    fetch(`/api/chats?userId=${user.id}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) return;
        const count = (j.data as { unreadCount?: number }[]).reduce(
          (sum, c) => sum + (c.unreadCount ?? 0),
          0
        );
        setUnreadChat(count);
      })
      .catch(() => undefined);
  }, [user]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#f7fbf8]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/"
            className="display shrink-0 text-2xl font-extrabold tracking-tight text-brand-deep"
          >
            Re<span className="text-spark">Spark</span>
          </Link>

          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/products?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <div className="relative min-w-0 flex-1">
              <IconSearch
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                className="input h-11 pl-9"
                placeholder={t("products.keyword")}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label={t("common.search")}
              />
            </div>
            <button className="btn btn-primary h-11 shrink-0 px-4" type="submit">
              <IconSearch className="h-4 w-4 md:hidden" aria-hidden />
              <span className="hidden md:inline">{t("common.search")}</span>
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <LangSelect locale={locale} setLocale={setLocale} label={t("common.language")} />
            <MockBadge />
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-semibold md:justify-between">
          <div className="flex flex-wrap items-center gap-1 md:gap-2">
            <Link href="/products" className="rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand">
              {t("nav.browse")}
            </Link>
            <Link href="/sell" className="rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand">
              {t("nav.sell")}
            </Link>
            <Link
              href="/chat"
              className="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand"
              aria-label={t("nav.chat")}
              title={t("nav.chat")}
            >
              <IconChat className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("nav.chat")}</span>
              {unreadChat > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-spark px-1 text-center text-[10px] leading-4 text-white">
                  {unreadChat > 99 ? "99+" : unreadChat}
                </span>
              )}
            </Link>
            <Link
              href="/notifications"
              className="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand"
              aria-label={t("nav.notifications")}
              title={t("nav.notifications")}
            >
              <IconBell className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("nav.notifications")}</span>
              {unreadNotif > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-spark px-1 text-center text-[10px] leading-4 text-white">
                  {unreadNotif > 99 ? "99+" : unreadNotif}
                </span>
              )}
            </Link>
            <Link
              href="/mypage/wishlist"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand"
              aria-label={t("nav.wishlist")}
              title={t("nav.wishlist")}
            >
              <IconHeart className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("nav.wishlist")}</span>
            </Link>
            <Link href="/support" className="rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand">
              {t("nav.support")}
            </Link>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <LangSelect
              locale={locale}
              setLocale={setLocale}
              label={t("common.language")}
              className="hidden md:inline-flex"
            />
            <MockBadge />
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 hover:bg-brand/5 hover:text-brand"
                  aria-label={t("nav.myPage")}
                  title={t("nav.myPage")}
                >
                  <IconUser className="h-4 w-4" aria-hidden />
                  <span className="max-w-[8rem] truncate">{user.nickname}</span>
                </Link>
                <button
                  className="btn btn-ghost h-9 px-3 py-1.5 text-sm"
                  onClick={() => {
                    clearSession();
                    router.push("/");
                  }}
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="btn btn-ghost h-9 px-3 py-1.5 text-sm">
                  {t("nav.signup")}
                </Link>
                <Link href="/login" className="btn btn-primary h-9 px-3 py-1.5 text-sm">
                  {t("nav.login")}
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
