"use client";

import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { clearSession } from "@/lib/auth/session";

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("auth.withdraw")}</h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">{t("auth.withdrawWarn")}</p>
      <form
        className="panel space-y-3 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          clearSession();
          alert(t("common.success"));
          router.push("/");
        }}
      >
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("auth.currentPassword")}</span>
          <input className="input h-11" type="password" required />
        </label>
        <button className="btn btn-ghost w-full text-rose-700">{t("auth.withdraw")}</button>
      </form>
    </div>
  );
}
