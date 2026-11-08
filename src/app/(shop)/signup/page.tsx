"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { signup } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms) {
      setError("Required terms must be accepted.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await signup({ email, password, nickname });
      saveSession(res.data);
      router.push("/mypage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="display text-3xl font-bold">Sign up</h1>
          <MockBadge />
        </div>
        <p className="text-sm text-muted">
          Homepage signup mock. Social OAuth providers are not connected.
        </p>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Nickname</span>
          <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>I agree to the required terms (mock).</span>
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Login
        </Link>
      </p>
    </div>
  );
}
