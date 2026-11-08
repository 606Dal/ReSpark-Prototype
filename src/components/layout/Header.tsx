"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MockBadge } from "@/components/common/MockBadge";
import { clearSession, readUser } from "@/lib/auth/session";
import type { User } from "@/types";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const sync = () => setUser(readUser());
    sync();
    window.addEventListener("respark-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("respark-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-[#f7fbf8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="display text-2xl font-extrabold tracking-tight text-brand-deep">
            Re<span className="text-spark">Spark</span>
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <MockBadge />
            {user ? (
              <button
                className="btn btn-ghost px-3 py-2 text-sm"
                onClick={() => {
                  clearSession();
                  router.push("/");
                }}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn btn-primary px-3 py-2 text-sm">
                Login
              </Link>
            )}
          </div>
        </div>

        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/products?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <input
            className="input"
            placeholder="Search cameras, bags, gadgets..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-3 text-sm font-semibold md:flex">
          <Link href="/products" className="hover:text-brand">
            Browse
          </Link>
          <Link href="/sell" className="hover:text-brand">
            Sell
          </Link>
          <Link href="/chat" className="hover:text-brand">
            Chat
          </Link>
          <Link href="/mypage" className="hover:text-brand">
            My Page
          </Link>
          <Link href="/support" className="hover:text-brand">
            Support
          </Link>
          <MockBadge />
          {user ? (
            <>
              <span className="text-muted">{user.nickname}</span>
              <button
                className="btn btn-ghost px-3 py-2"
                onClick={() => {
                  clearSession();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="btn btn-ghost px-3 py-2">
                Sign up
              </Link>
              <Link href="/login" className="btn btn-primary px-3 py-2">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
