"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser } from "@/lib/auth/session";

type Restriction = {
  id: number;
  reason: string;
  restrictedAt: string;
  releasedAt: string | null;
  durationLabel: string;
};

export default function Page() {
  const router = useRouter();
  const { t } = useI18n();
  const [items, setItems] = useState<Restriction[]>([]);

  useEffect(() => {
    const u = readUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    fetch("/api/restrictions?userUuid=" + u.uuid)
      .then((r) => r.json())
      .then((j) => setItems(j.data || []));
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">{t("mypage.restrictions")}</h1>
        <MockBadge />
      </div>
      {items.length === 0 && (
        <p className="panel p-6 text-center text-muted">{t("mypage.emptyRestrictions")}</p>
      )}
      {items.map((i) => (
        <article key={i.id} className="panel p-4 text-sm">
          <p className="font-semibold">{i.reason}</p>
          <p className="text-muted">
            {i.restrictedAt} → {i.releasedAt || "—"} · {i.durationLabel}
          </p>
        </article>
      ))}
    </div>
  );
}
