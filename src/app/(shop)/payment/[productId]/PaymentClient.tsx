"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { createMockPayment } from "@/lib/api/payment";
import { fetchProduct } from "@/lib/api/products";
import { readUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import type { Product } from "@/types";

export function PaymentClient() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [method, setMethod] = useState("CARD");
  const [agree, setAgree] = useState(false);
  const [customs, setCustoms] = useState("P123456789012");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = readUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchProduct(params.productId)
      .then((res) => setProduct(res.data))
      .catch((e: Error) => setError(e.message));
  }, [params.productId, router]);

  if (error) return <p className="text-rose-700">{error}</p>;
  if (!product) return <p className="text-muted">Loading checkout...</p>;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">Checkout</h1>
        <MockBadge label="MOCK PAYMENT" />
      </div>
      <p className="text-sm text-muted">
        Stripe / PayPal / Apple Pay / Google Pay are not connected. This only creates mock purchase
        records.
      </p>

      <div className="panel space-y-4 p-6">
        <div>
          <p className="font-semibold">{product.title}</p>
          <p className="display text-2xl font-bold text-brand">{formatUsd(product.price)}</p>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Customs code</span>
          <input className="input" value={customs} onChange={(e) => setCustoms(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Payment method</span>
          <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="CARD">Credit/Debit card</option>
            <option value="PAYPAL">PayPal</option>
            <option value="APPLE_PAY">Apple Pay</option>
            <option value="GOOGLE_PAY">Google Pay</option>
          </select>
        </label>
        <div className="rounded-xl bg-[#f7fbf9] p-3 text-sm text-muted">
          Destination auto-filled from default address (mock). Edit UI is not wired.
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I agree to payment terms (required to enable pay button).</span>
        </label>
        <button
          className="btn btn-spark w-full"
          disabled={!agree || loading}
          onClick={async () => {
            const user = readUser();
            if (!user) return;
            setLoading(true);
            try {
              const res = await createMockPayment({
                productId: product.id,
                buyerUuid: user.uuid,
                paymentMethod: method,
              });
              router.push(`/mypage/purchases/${res.data.purchase.id}`);
            } catch (e) {
              alert(e instanceof Error ? e.message : "Failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Processing..." : "Pay now (mock)"}
        </button>
      </div>
    </div>
  );
}
