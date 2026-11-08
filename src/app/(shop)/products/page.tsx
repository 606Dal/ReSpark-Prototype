import { Suspense } from "react";
import { ProductsClient } from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading catalog...</p>}>
      <ProductsClient />
    </Suspense>
  );
}
