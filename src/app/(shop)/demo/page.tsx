"use client";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { useToast } from "@/components/common/Toast";
import { clearSession } from "@/lib/auth/session";
export default function DemoPage() {
  const { push } = useToast();
  const router = useRouter();
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Reset demo data</h1><MockBadge /></div>
      <p className="text-sm text-muted">Resets in-memory mock store and clears session.</p>
      <button className="btn btn-spark" onClick={async () => {
        await fetch("/api/demo/reset", { method: "POST" });
        clearSession();
        push("Demo data reset", "ok");
        router.push("/");
      }}>Reset demo data</button>
    </div>
  );
}
