"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { clearSession, readUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";

const links = [
  { href: "/admin", labelKey: "admin.dashboard" },
  { href: "/admin/members", labelKey: "admin.members" },
  { href: "/admin/products", labelKey: "admin.products" },
  { href: "/admin/categories", labelKey: "admin.categories" },
  { href: "/admin/trades", labelKey: "admin.trades" },
  { href: "/admin/settlements", labelKey: "admin.settlements" },
  { href: "/admin/reports", labelKey: "admin.reports" },
  { href: "/admin/faq", labelKey: "admin.faq" },
  { href: "/admin/notices", labelKey: "admin.notices" },
  { href: "/admin/inquiries", labelKey: "admin.inquiries" },
  { href: "/admin/reviews", labelKey: "admin.reviews" },
  { href: "/admin/alarms", labelKey: "admin.alarms" },
  { href: "/admin/boards", labelKey: "admin.boards" },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  // Admin default language: Korean
  useEffect(() => {
    if (locale !== "ko") setLocale("ko");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only force once on admin enter
  }, []);

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    const user = readUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        관리자 세션 확인 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10241c] text-[#e7f2ec]">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-56 shrink-0 space-y-4">
          <div>
            <p className="display text-xl font-bold">
              Re<span className="text-spark">Spark</span> {t("admin.title")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <MockBadge label="MOCK ADMIN" />
              <select
                className="h-8 rounded-md border border-white/20 bg-[#16382c] px-1.5 text-xs text-white"
                value={locale}
                aria-label={t("common.language")}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                <option value="ko">KO</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>
          <nav className="space-y-1 text-sm font-semibold">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 ${
                    active ? "bg-brand text-white" : "hover:bg-white/10"
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-transparent px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            onClick={() => {
              clearSession();
              router.push("/admin/login");
            }}
          >
            {t("nav.logout")}
          </button>
          <Link href="/" className="block text-xs text-[#9fbfb1] hover:text-white">
            ← {t("nav.home")}
          </Link>
        </aside>
        <main className="min-w-0 flex-1 rounded-2xl bg-[#f4f8f6] p-6 text-ink text-muted">
          {children}
        </main>
      </div>
    </div>
  );
}
