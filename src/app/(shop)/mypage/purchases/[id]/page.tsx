import { Suspense } from "react";
import { PurchaseDetailClient } from "./PurchaseDetailClient";

export default function PurchaseDetailPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading order...</p>}>
      <PurchaseDetailClient />
    </Suspense>
  );
}
