"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconUser } from "@/components/common/Icons";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser } from "@/lib/auth/session";
import type { User } from "@/types";

const linkDefs = [
  { href: "/mypage/profile", labelKey: "mypage.profile", descKey: "mypage.profileDesc" },
  { href: "/mypage/wishlist", labelKey: "mypage.wishlist", descKey: "mypage.wishlistDesc" },
  { href: "/mypage/purchases", labelKey: "mypage.purchases", descKey: "mypage.purchasesDesc" },
  { href: "/mypage/sales", labelKey: "mypage.sales", descKey: "mypage.salesDesc" },
  { href: "/mypage/reviews", labelKey: "mypage.reviews", descKey: "mypage.reviewsDesc" },
  { href: "/mypage/accounts", labelKey: "mypage.accounts", descKey: "mypage.accountsDesc" },
  { href: "/mypage/destinations", labelKey: "mypage.destinations", descKey: "mypage.destinationsDesc" },
  { href: "/mypage/restrictions", labelKey: "mypage.restrictions", descKey: "mypage.restrictionsDesc" },
  { href: "/sell/manage", labelKey: "mypage.salesManage", descKey: "mypage.salesManageDesc" },
  { href: "/notifications", labelKey: "mypage.notifications", descKey: "mypage.notificationsDesc" },
  { href: "/password/change", labelKey: "mypage.changePassword", descKey: "mypage.changePasswordDesc" },
  { href: "/mypage/withdraw", labelKey: "mypage.withdraw", descKey: "mypage.withdrawDesc" },
  { href: "/chat", labelKey: "mypage.chats", descKey: "mypage.chatsDesc" },
  { href: "/support", labelKey: "mypage.support", descKey: "mypage.supportDesc" },
  { href: "/privacy/retention", labelKey: "mypage.retention", descKey: "mypage.retentionDesc" },
  { href: "/demo", labelKey: "mypage.demoReset", descKey: "mypage.demoResetDesc" },
] as const;

export default function MyPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const current = readUser();
    if (!current) {
      router.replace("/login");
      return;
    }
    setUser(current);
  }, [router]);

  if (!user) return <p className="text-muted">{t("mypage.loadingProfile")}</p>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="panel flex flex-wrap items-center gap-5 p-6">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white">
          <IconUser className="h-8 w-8" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-3xl font-bold">{user.nickname}</h1>
            <MockBadge />
          </div>
          <p className="text-sm text-muted">{user.email}</p>
          <p className="text-sm text-muted">
            {t("mypage.statusLabel")} {t(`status.${user.status}` as "status.ACTIVE")} ·{" "}
            {t("mypage.membership")}{" "}
            {user.membershipTf ? t("mypage.membershipOn") : t("mypage.membershipOff")}
          </p>
        </div>
      </section>

      <p className="text-sm text-muted">{t("mypage.menuHint")}</p>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {linkDefs.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="panel p-5 transition hover:-translate-y-0.5 hover:border-brand/40"
          >
            <p className="font-semibold">{t(link.labelKey)}</p>
            <p className="mt-1 text-sm text-muted">{t(link.descKey)}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
