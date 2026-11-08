"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { clearSession, readUser } from "@/lib/auth/session";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/trades", label: "Trades" },
  { href: "/admin/settlements", label: "Settlements" },
  { href: "/admin/reports", label: "Reports" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    const user = readUser();
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        Checking admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10241c] text-[#e7f2ec]">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-56 shrink-0 space-y-4">
          <div>
            <p className="display text-xl font-bold">
              Re<span className="text-spark">Spark</span> Admin
            </p>
            <div className="mt-2">
              <MockBadge label="MOCK ADMIN" />
            </div>
          </div>
          <nav className="space-y-1 text-sm font-semibold">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 ${active ? "bg-brand text-white" : "hover:bg-white/10"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button
            className="btn btn-ghost w-full border-white/20 text-sm text-white"
            onClick={() => {
              clearSession();
              router.push("/admin/login");
            }}
          >
            Logout
          </button>
          <Link href="/" className="block text-xs text-[#9fbfb1] hover:text-white">
            ← Back to marketplace
          </Link>
        </aside>
        <main className="min-w-0 flex-1 rounded-2xl bg-[#f4f8f6] p-6 text-ink text-muted">
          {children}
        </main>
      </div>
    </div>
  );
}
