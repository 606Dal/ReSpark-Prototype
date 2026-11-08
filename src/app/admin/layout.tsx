import { AdminShell } from "@/components/layout/AdminShell";

/** Auth-gated client shell; opt out of instant-nav validation for stage-1. */
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
