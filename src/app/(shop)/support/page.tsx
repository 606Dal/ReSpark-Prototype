"use client";

import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { createInquiry, fetchFaq, fetchNotices } from "@/lib/api/support";
import { readUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import type { FaqItem, Notice } from "@/types";

export default function SupportPage() {
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetchFaq(), fetchNotices()]).then(([f, n]) => {
      setFaq(f.data);
      setNotices(n.data);
    });
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">Customer center</h1>
          <MockBadge />
        </div>
        <p className="text-sm text-muted">FAQ, notices, and inquiry intake for the prototype.</p>
      </div>

      <section className="space-y-3">
        <h2 className="display text-xl font-bold">Notices</h2>
        {notices.map((n) => (
          <article key={n.id} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-muted">{n.noticeType}</p>
            <h3 className="font-semibold">{n.title}</h3>
            <p className="mt-1 text-sm text-[#355045]">{n.content}</p>
            <p className="mt-2 text-xs text-muted">{formatDate(n.createdAt)}</p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="display text-xl font-bold">FAQ</h2>
        {faq.map((item) => (
          <details key={item.id} className="panel p-4">
            <summary className="cursor-pointer font-semibold">{item.question}</summary>
            <p className="mt-2 text-sm text-[#355045]">{item.answer}</p>
          </details>
        ))}
      </section>

      <section className="panel space-y-3 p-6">
        <h2 className="display text-xl font-bold">Send inquiry</h2>
        <textarea
          className="input min-h-28"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue..."
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            const user = readUser();
            if (!user) {
              setMessage("Login required to submit an inquiry.");
              return;
            }
            try {
              await createInquiry({ userId: user.id, description });
              setDescription("");
              setMessage("Inquiry submitted (mock).");
            } catch (e) {
              setMessage(e instanceof Error ? e.message : "Failed");
            }
          }}
        >
          Submit
        </button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </section>
    </div>
  );
}
