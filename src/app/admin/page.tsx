"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchAdminMembers,
  fetchAdminProducts,
  fetchAdminSettlements,
  fetchAdminTrades,
} from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    products: 0,
    trades: 0,
    settlements: 0,
  });

  useEffect(() => {
    Promise.all([
      fetchAdminMembers(),
      fetchAdminProducts(),
      fetchAdminTrades(),
      fetchAdminSettlements(),
    ]).then(([m, p, t, s]) => {
      setStats({
        members: m.data.length,
        products: p.data.length,
        trades: t.data.length,
        settlements: s.data.length,
      });
    });
  }, []);

  const cards = [
    { href: "/admin/members", label: "Members", value: stats.members },
    { href: "/admin/products", label: "Products", value: stats.products },
    { href: "/admin/trades", label: "Trades", value: stats.trades },
    { href: "/admin/settlements", label: "Settlements", value: stats.settlements },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-3xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted">Stage-1 overview of mock marketplace entities.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="panel p-5 hover:border-brand/40">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="display mt-2 text-3xl font-bold text-brand">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
