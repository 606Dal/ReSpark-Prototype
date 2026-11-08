"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { readUser } from "@/lib/auth/session";
import type { User } from "@/types";

const links = [
  { href: "/mypage/wishlist", label: "Wishlist", desc: "Saved products" },
  { href: "/mypage/purchases", label: "Purchase history", desc: "Orders & confirmations" },
  { href: "/mypage/sales", label: "Sales history", desc: "Sold trades" },
  { href: "/sell/manage", label: "Sales management", desc: "Edit your listings" },
  { href: "/chat", label: "Chats", desc: "Buyer/seller messaging" },
  { href: "/support", label: "Support", desc: "FAQ & inquiries" },
];

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const current = readUser();
    if (!current) {
      router.replace("/login");
      return;
    }
    setUser(current);
  }, [router]);

  if (!user) return <p className="text-muted">Loading profile...</p>;

  return (
    <div className="space-y-8">
      <section className="panel flex flex-wrap items-center gap-5 p-6">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand text-2xl font-bold text-white">
          {user.nickname.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-3xl font-bold">{user.nickname}</h1>
            <MockBadge />
          </div>
          <p className="text-sm text-muted">{user.email}</p>
          <p className="text-sm text-muted">
            Status {user.status} · Membership {user.membershipTf ? "ON" : "OFF"}
          </p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="panel p-5 transition hover:-translate-y-0.5 hover:border-brand/40"
          >
            <p className="font-semibold">{link.label}</p>
            <p className="mt-1 text-sm text-muted">{link.desc}</p>
          </Link>
        ))}
      </section>

      <p className="text-xs text-muted">
        Account / bank / destination CRUD UIs are partially mocked. Settlement payout is admin-only
        mock data.
      </p>
    </div>
  );
}
