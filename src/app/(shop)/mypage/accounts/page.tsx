"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser } from "@/lib/auth/session";

type AccountRow = {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  basicAccount: boolean;
};

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();
  const { push } = useToast();
  const [items, setItems] = useState<AccountRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
    basicAccount: false,
  });

  async function load(userId: number) {
    const j = await fetch("/api/accounts?userId=" + userId).then((r) => r.json());
    setItems(j.data || []);
  }

  useEffect(() => {
    const u = readUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    load(u.id);
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("mypage.accounts")}</h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">{t("mypage.maxAccounts")}</p>
      <form
        className="panel grid gap-3 p-4 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const u = readUser();
          if (!u) return;
          const res = await fetch("/api/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, userId: u.id }),
          });
          const j = await res.json();
          if (!j.success) {
            push(j.message, "err");
            return;
          }
          push(t("common.success"), "ok");
          setForm({ name: "", accountNumber: "", bankName: "", bankCode: "", basicAccount: false });
          load(u.id);
        }}
      >
        <input
          className="input h-11"
          placeholder={t("mypage.accountHolder")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.accountNumber")}
          value={form.accountNumber}
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.bankName")}
          value={form.bankName}
          onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.bankCode")}
          value={form.bankCode}
          onChange={(e) => setForm({ ...form, bankCode: e.target.value })}
          required
        />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.basicAccount}
            onChange={(e) => setForm({ ...form, basicAccount: e.target.checked })}
          />
          {t("mypage.defaultAccount")}
        </label>
        <button className="btn btn-primary h-11 md:col-span-2">{t("mypage.addAccount")}</button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div>
              <p className="font-semibold">
                {item.name} · {item.bankName}
                {item.basicAccount ? ` · ${t("mypage.defaultAccount")}` : ""}
              </p>
              <p className="text-muted">
                {item.accountNumber} ({item.bankCode})
              </p>
            </div>
            <button
              className="btn btn-ghost text-rose-700"
              onClick={async () => {
                const res = await fetch("/api/accounts/" + item.id, { method: "DELETE" });
                const j = await res.json();
                if (!j.success) push(j.message, "err");
                else {
                  push(t("common.success"), "ok");
                  const u = readUser();
                  if (u) load(u.id);
                }
              }}
            >
              {t("common.delete")}
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="panel p-6 text-center text-muted">{t("mypage.emptyAccounts")}</p>
        )}
      </div>
    </div>
  );
}
