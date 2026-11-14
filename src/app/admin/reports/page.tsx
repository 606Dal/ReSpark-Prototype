"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { fetchAdminReports } from "@/lib/api/admin";
import { formatDate } from "@/lib/format";
import type { Report } from "@/types";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const r = await fetchAdminReports();
    setReports(r.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: number, action: "accept" | "reject" | "review") {
    await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setMsg(`Report #${id} → ${action} (mock). Policy: 3+ accepts may auto-restrict (Stage 2).`);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="display text-3xl font-bold">Reports</h1>
        <MockBadge />
      </div>
      <p className="text-sm text-muted">
        Status flow: RECEIVED → REVIEWING → RESOLVED / REJECTED. Dedicated inquiries UI:{" "}
        <Link href="/admin/inquiries" className="text-brand underline">
          /admin/inquiries
        </Link>
      </p>
      {msg && <p className="text-sm text-emerald-700">{msg}</p>}
      <div className="space-y-3">
        {reports.map((r) => (
          <article key={r.id} className="panel space-y-2 p-4 text-sm">
            <p className="font-semibold">
              #{r.id} {r.reportCategory} · {r.status} · {r.targetType || "TARGET"}
            </p>
            <p>{r.description}</p>
            <p className="text-muted">
              reporter {r.reporterId} → target {r.targetUserId} · {formatDate(r.reportedAt)}
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-ghost text-xs" onClick={() => act(r.id, "review")}>
                Review
              </button>
              <button className="btn btn-primary text-xs" onClick={() => act(r.id, "accept")}>
                Accept
              </button>
              <button className="btn btn-ghost text-xs text-rose-700" onClick={() => act(r.id, "reject")}>
                Reject
              </button>
            </div>
          </article>
        ))}
        {reports.length === 0 && <p className="panel p-6 text-center text-muted">No reports</p>}
      </div>
    </div>
  );
}
