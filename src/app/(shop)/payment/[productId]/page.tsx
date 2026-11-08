import { Suspense } from "react";
import { PaymentClient } from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading checkout...</p>}>
      <PaymentClient />
    </Suspense>
  );
}
