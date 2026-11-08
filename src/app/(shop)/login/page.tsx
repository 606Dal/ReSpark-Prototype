"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("buyer@respark.test");
  const [password, setPassword] = useState("buyer1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password);
      saveSession(res.data);
      router.push(res.data.user.role === "ADMIN" ? "/admin" : "/mypage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">Login</h1>
          <MockBadge />
        </div>
        <p className="text-sm text-muted">
          Email/password mock auth. Social login (LINE/Google/X/Apple) is not connected.
        </p>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="panel space-y-2 p-4 text-sm text-muted">
        <p className="font-semibold text-ink">Demo accounts</p>
        <p>buyer@respark.test / buyer1234</p>
        <p>seller@respark.test / seller1234</p>
        <p>admin@respark.test / admin1234</p>
      </div>

      <p className="text-sm">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-brand">
          Sign up
        </Link>
      </p>
    </div>
  );
}
