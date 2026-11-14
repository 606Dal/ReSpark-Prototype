"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function AdminLoginPage() {
  const router = useRouter();
  const { t, setLocale } = useI18n();
  const [email, setEmail] = useState("admin@respark.test");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocale("ko");
  }, [setLocale]);

  return (
    <div className="grid min-h-screen place-items-center bg-[#10241c] px-4">
      <form
        className="w-full max-w-md space-y-4 rounded-2xl bg-[#f4f8f6] p-6 text-ink"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            const res = await login(email, password);
            if (res.data.user.role !== "ADMIN") {
              setError("관리자 권한이 필요합니다.");
              return;
            }
            saveSession(res.data);
            router.push("/admin");
          } catch (err) {
            setError(err instanceof Error ? err.message : t("common.error"));
          }
        }}
      >
        <div className="flex items-center gap-2">
          <h1 className="display text-2xl font-bold">{t("admin.title")} 로그인</h1>
          <MockBadge />
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("auth.email")}</span>
          <input className="input h-11" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("auth.password")}</span>
          <input
            className="input h-11"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary h-11 w-full" type="submit">
          {t("nav.login")}
        </button>
        <p className="text-xs text-muted">admin@respark.test / admin1234</p>
      </form>
    </div>
  );
}
