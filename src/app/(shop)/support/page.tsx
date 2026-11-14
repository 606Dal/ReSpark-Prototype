"use client";

import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";

const hubs = [
  { href: "/support/faq", title: "FAQ", desc: "Common questions by category" },
  { href: "/support/notices", title: "Notices", desc: "Service announcements" },
  { href: "/support/inquiries", title: "My inquiries", desc: "Ask & track answers" },
  { href: "/support/inquiries/new", title: "New inquiry", desc: "Category · title · photos (mock)" },
  { href: "/terms", title: "Terms", desc: "Service terms versions" },
  { href: "/report", title: "Report", desc: "Product / chat / review / user" },
];

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">Customer center</h1>
          <MockBadge />
        </div>
        <p className="text-sm text-muted">Split entry points for design review (FAQ · notices · inquiries).</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hubs.map((h) => (
          <Link key={h.href} href={h.href} className="panel p-5 transition hover:border-brand/40">
            <p className="font-semibold">{h.title}</p>
            <p className="mt-1 text-sm text-muted">{h.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
