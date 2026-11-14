import { Suspense } from "react";
import Client from "./Client";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <Client />
    </Suspense>
  );
}
