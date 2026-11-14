"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { useI18n } from "@/components/providers/LocaleProvider";
import { readUser } from "@/lib/auth/session";

type Account = {
  id: number;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  basicAccount: boolean;
};

type Destination = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  postcode: string;
  defaultAddress: boolean;
};

export default function Client() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useI18n();
  const [account, setAccount] = useState<Account | null>(null);
  const [dest, setDest] = useState<Destination | null>(null);

  useEffect(() => {
    const u = readUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    Promise.all([
      fetch("/api/accounts?userId=" + u.id).then((r) => r.json()),
      fetch("/api/destinations?userId=" + u.id).then((r) => r.json()),
    ]).then(([a, d]) => {
      setAccount(
        (a.data || []).find((x: Account) => x.basicAccount) || (a.data || [])[0] || null
      );
      setDest(
        (d.data || []).find((x: Destination) => x.defaultAddress) ||
          (d.data || [])[0] ||
          null
      );
    });
  }, [router]);

  const isKo = locale === "ko";

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">
          {isKo ? "판매자 정보" : "Seller info"}
        </h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">
        Chat #{String(params.id)} ·{" "}
        {isKo ? "구매 수락 후 자동 입력" : "auto-filled after purchase accept"}
      </p>

      <div className="panel space-y-4 p-5 text-sm">
        <div>
          <p className="mb-2 font-semibold">
            {isKo ? "정산 계좌 (자동 입력)" : "Settlement account (auto-fill)"}
          </p>
          {account ? (
            <dl className="grid gap-2 rounded-xl border border-line bg-[#f7fbf9] p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">{isKo ? "예금주" : "Account holder"}</dt>
                <dd className="font-medium">{account.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{isKo ? "은행" : "Bank"}</dt>
                <dd className="font-medium">{account.bankName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{isKo ? "계좌번호" : "Account number"}</dt>
                <dd className="font-medium">{account.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{isKo ? "은행 코드" : "Bank code"}</dt>
                <dd className="font-medium">{account.bankCode}</dd>
              </div>
              {account.basicAccount && (
                <p className="sm:col-span-2 text-xs font-semibold text-brand">
                  {t("mypage.defaultAccount")}
                </p>
              )}
            </dl>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-4 text-muted">
              {isKo ? "등록된 계좌가 없습니다." : "No settlement account on file."}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 font-semibold">
            {isKo ? "판매자 주소 (자동 입력)" : "Seller address (auto-fill)"}
          </p>
          {dest ? (
            <dl className="grid gap-2 rounded-xl border border-line bg-[#f7fbf9] p-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">{isKo ? "수령인" : "Name"}</dt>
                <dd className="font-medium">{dest.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{isKo ? "연락처" : "Phone"}</dt>
                <dd className="font-medium">{dest.phoneNumber}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">{isKo ? "주소" : "Address"}</dt>
                <dd className="font-medium">
                  ({dest.postcode}) {dest.address} {dest.detailedAddress}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-4 text-muted">
              {isKo ? "등록된 주소가 없습니다." : "No address on file."}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-line p-4">
          <p className="font-semibold">{isKo ? "정산 미리보기" : "Settlement preview"}</p>
          <div className="mt-2 grid gap-1 text-muted sm:grid-cols-3">
            <p>{isKo ? "판매금" : "Gross"} $100</p>
            <p>{isKo ? "수수료 10%" : "Fee 10%"} $10</p>
            <p className="font-semibold text-brand">{isKo ? "정산액" : "Net"} $90</p>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={() => {
          alert(
            isKo
              ? "판매자 정보가 저장되었습니다(Mock). 구매자가 결제할 수 있습니다."
              : "Seller info saved (mock). Buyer can pay from chat."
          );
          router.push("/chat/" + params.id);
        }}
      >
        {isKo ? "저장하고 구매자에게 알리기" : "Save & notify buyer"}
      </button>
    </div>
  );
}
