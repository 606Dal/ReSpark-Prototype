"use client";

import { useEffect, useState } from "react";
import { fetchAdminInquiries, fetchAdminReports } from "@/lib/api/admin";
import { formatDate } from "@/lib/format";
import type { Inquiry, Report } from "@/types";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    Promise.all([fetchAdminReports(), fetchAdminInquiries()]).then(([r, i]) => {
      setReports(r.data);
      setInquiries(i.data);
    });
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="display text-3xl font-bold">Reports</h1>
        {reports.map((r) => (
          <article key={r.id} className="panel p-4 text-sm">
            <p className="font-semibold">
              #{r.id} {r.reportCategory} · {r.status}
            </p>
            <p className="mt-1">{r.description}</p>
            <p className="mt-2 text-muted">
              reporter {r.reporterId} → target {r.targetUserId} · {formatDate(r.reportedAt)}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-2xl font-bold">Inquiries</h2>
        {inquiries.map((i) => (
          <article key={i.id} className="panel p-4 text-sm">
            <p className="font-semibold">
              {i.userEmail} · {i.status}
            </p>
            <p className="mt-1">{i.description}</p>
            <p className="mt-2 text-muted">{formatDate(i.inquiredAt)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
