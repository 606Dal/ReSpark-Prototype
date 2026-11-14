"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("buyer@respark.test");
  const [password, setPassword] = useState("buyer1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      saveSession(res.data);
      router.push(res.data.user.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">{t("auth.loginTitle")}</h1>
          <MockBadge />
        </div>
        <p className="text-sm text-muted">{t("auth.afterLoginHome")}</p>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("auth.email")}</span>
          <input
            className="input h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="buyer@respark.test"
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">{t("auth.password")}</span>
          <input
            className="input h-11"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary h-11 w-full" disabled={loading}>
          {loading ? t("common.processing") : t("nav.login")}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href="/password/forgot" className="font-semibold text-brand">
          {t("auth.forgotPassword")}
        </Link>
        <p>
          {t("auth.noAccount")}{" "}
          <Link href="/signup" className="font-semibold text-brand">
            {t("nav.signup")}
          </Link>
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-line" />
        OR
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="panel space-y-3 p-4">
        <p className="text-sm font-semibold text-muted">{t("auth.socialLogin")}</p>
        <div className="grid grid-cols-2 gap-2">
          {["LINE", "Google", "X", "Apple"].map((p) => (
            <button
              key={p}
              type="button"
              className="btn btn-ghost h-11 text-sm"
              onClick={() => alert(`${p} OAuth is mock-only.`)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="panel space-y-1 p-4 text-sm text-muted">
        <p className="font-semibold text-ink">{t("auth.demoAccounts")}</p>
        <p>buyer@respark.test / buyer1234</p>
        <p>seller@respark.test / seller1234</p>
        <p>admin@respark.test / admin1234</p>
      </div>
    </div>
  );
}
