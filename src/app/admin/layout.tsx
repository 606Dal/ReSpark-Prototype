import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";

/** Auth-gated client shell; opt out of instant-nav validation for stage-1. */
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center text-muted">
          Loading...
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
