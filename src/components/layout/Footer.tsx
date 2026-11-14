"use client";

import Link from "next/link";
import { useI18n } from "@/components/providers/LocaleProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-line bg-[#0f2a21] text-[#d7e8df]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="display text-2xl font-bold text-white">
            Re<span className="text-spark">Spark</span>
          </p>
          <p className="mt-2 text-sm text-[#a9c3b7]">{t("footer.blurb")}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{t("footer.company")}</p>
          <p className="mt-2">ReSpark Demo Co.</p>
          <p>support@respark.test</p>
          <p>+82-2-0000-0000</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">{t("footer.links")}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <Link href="/terms" className="hover:text-white">
              {t("nav.terms")}
            </Link>
            <Link href="/support" className="hover:text-white">
              {t("nav.support")}
            </Link>
            <Link href="/support/faq" className="hover:text-white">
              {t("nav.faq")}
            </Link>
            <Link href="/support/notices" className="hover:text-white">
              {t("nav.notices")}
            </Link>
            <Link href="/support/inquiries" className="hover:text-white">
              {t("nav.inquiries")}
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
