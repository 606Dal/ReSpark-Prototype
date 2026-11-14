"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser, saveSession, readSession } from "@/lib/auth/session";

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const u = readUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setNickname(u.nickname);
  }, [router]);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("mypage.editProfile")}</h1>
        <MockBadge />
      </div>
      <form
        className="panel space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const s = readSession();
          if (!s) return;
          s.user.nickname = nickname;
          saveSession(s);
          alert(t("common.success"));
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand text-2xl font-bold text-white">
          {nickname.slice(0, 1) || "?"}
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("mypage.nickname")}</span>
          <input
            className="input h-11"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <button className="btn btn-primary h-11 w-full">{t("mypage.saveProfile")}</button>
      </form>
      <Link href="/password/change" className="text-sm font-semibold text-brand">
        {t("mypage.changePassword")}
      </Link>
    </div>
  );
}
