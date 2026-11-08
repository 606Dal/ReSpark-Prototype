import { Suspense } from "react";
import { ProductDetailClient } from "./ProductDetailClient";

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading product...</p>}>
      <ProductDetailClient />
    </Suspense>
  );
}
