"use client";

import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";

export default function Page() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("auth.changePassword")}</h1>
        <MockBadge />
      </div>

      <form
        className="panel space-y-4 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!verified) return;
          alert(t("common.success"));
        }}
      >
        {/* 1. Email + 인증하기 */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" htmlFor="change-pw-email">
            {t("auth.email")}
          </label>
          <div className="flex gap-2">
            <input
              id="change-pw-email"
              className="input h-11 flex-1"
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setCodeSent(false);
                setVerified(false);
                setCode("");
              }}
              required
              disabled={verified}
            />
            <button
              type="button"
              className="btn btn-ghost h-11 shrink-0 whitespace-nowrap px-4"
              disabled={!email.trim() || verified}
              onClick={() => {
                setCodeSent(true);
                setVerified(false);
                setCode("");
              }}
            >
              {t("auth.verify")}
            </button>
          </div>
        </div>

        {/* 2. 인증 코드 + 옆 인증하기 / 3. 인증 후 인증 완료 */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" htmlFor="change-pw-code">
            {t("auth.verifyCode")}
          </label>
          <div className="flex gap-2">
            <input
              id="change-pw-code"
              className="input h-11 flex-1"
              placeholder={t("auth.codePlaceholder")}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!codeSent || verified}
              required={codeSent}
            />
            <button
              type="button"
              className={`btn h-11 shrink-0 whitespace-nowrap px-4 ${
                verified ? "bg-brand text-white" : "btn-ghost"
              }`}
              disabled={verified || !codeSent || !code.trim()}
              onClick={() => {
                if (code.trim()) setVerified(true);
              }}
            >
              {verified ? t("auth.verifyComplete") : t("auth.verify")}
            </button>
          </div>
        </div>

        <label className="block space-y-1.5 text-sm">
          <span className="font-semibold">{t("auth.currentPassword")}</span>
          <input
            className="input h-11"
            type="password"
            placeholder={t("auth.currentPassword")}
            required
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-semibold">{t("auth.newPassword")}</span>
          <input
            className="input h-11"
            type="password"
            placeholder={t("auth.newPassword")}
            required
          />
        </label>

        <label className="block space-y-1.5 text-sm">
          <span className="font-semibold">{t("auth.confirmPassword")}</span>
          <input
            className="input h-11"
            type="password"
            placeholder={t("auth.confirmPassword")}
            required
          />
        </label>

        <button className="btn btn-primary h-11 w-full" type="submit" disabled={!verified}>
          {t("common.save")}
        </button>
      </form>
    </div>
  );
}
