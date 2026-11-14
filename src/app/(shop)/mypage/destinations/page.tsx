"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser } from "@/lib/auth/session";

type Dest = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  postcode: string;
  defaultAddress: boolean;
};

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();
  const { push } = useToast();
  const [items, setItems] = useState<Dest[]>([]);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    detailedAddress: "",
    postcode: "",
    defaultAddress: false,
  });

  async function load(userId: number) {
    const j = await fetch("/api/destinations?userId=" + userId).then((r) => r.json());
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
        <h1 className="display text-3xl font-bold">{t("mypage.destinations")}</h1>
        <MockBadge />
      </div>
      <form
        className="panel grid gap-3 p-4 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const u = readUser();
          if (!u) return;
          const res = await fetch("/api/destinations", {
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
          load(u.id);
        }}
      >
        <input
          className="input h-11"
          placeholder={t("mypage.recipient")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.phone")}
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          className="input h-11 md:col-span-2"
          placeholder={t("mypage.address")}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.detailAddress")}
          value={form.detailedAddress}
          onChange={(e) => setForm({ ...form, detailedAddress: e.target.value })}
          required
        />
        <input
          className="input h-11"
          placeholder={t("mypage.postcode")}
          value={form.postcode}
          onChange={(e) => setForm({ ...form, postcode: e.target.value })}
          required
        />
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.defaultAddress}
            onChange={(e) => setForm({ ...form, defaultAddress: e.target.checked })}
          />
          {t("mypage.defaultAddress")}
        </label>
        <button className="btn btn-primary h-11 md:col-span-2">{t("mypage.addDestination")}</button>
      </form>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div>
              <p className="font-semibold">
                {item.name}
                {item.defaultAddress ? ` · ${t("mypage.defaultAddress")}` : ""}
              </p>
              <p className="text-muted">
                {item.address} {item.detailedAddress} ({item.postcode})
              </p>
              <p className="text-muted">{item.phoneNumber}</p>
            </div>
            <button
              className="btn btn-ghost text-rose-700"
              onClick={async () => {
                const res = await fetch("/api/destinations/" + item.id, { method: "DELETE" });
                const j = await res.json();
                if (!j.success) push(j.message || t("mypage.cannotDeleteDefault"), "err");
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
          <p className="panel p-6 text-center text-muted">{t("mypage.emptyDestinations")}</p>
        )}
      </div>
    </div>
  );
}
