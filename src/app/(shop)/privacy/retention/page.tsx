"use client";
import { MockBadge } from "@/components/common/MockBadge";
import Link from "next/link";
export default function RetentionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Data retention & deletion</h1><MockBadge /></div>
      <div className="panel space-y-3 p-5 text-sm">
        <p>Stage 1 mock policy summary (requirements v2):</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Trade history retained up to 5 years (display policy).</li>
          <li>Chat soft-deleted rooms kept for compliance (mock).</li>
          <li>Product media deleted ~3 months after soft delete (policy notice only).</li>
          <li>Notifications max 50; oldest FIFO hard delete.</li>
          <li>Withdrawn accounts: personal data anonymized after retention window (stub).</li>
        </ul>
        <p className="text-muted">Actual purge jobs run in Stage 2. This page is for design review.</p>
      </div>
      <Link href="/mypage/withdraw" className="btn btn-ghost">Withdrawal</Link>
    </div>
  );
}
