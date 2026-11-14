"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { signup } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [terms, setTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailOk, setEmailOk] = useState("");

  // Random nickname after mount — Math.random() in useState breaks Next prerender
  useEffect(() => {
    setNickname(`Spark${Math.floor(Math.random() * 9000 + 1000)}`);
  }, []);

  function passwordOk(pw: string) {
    if (pw.length < 10 || pw.length > 20) return false;
    let kinds = 0;
    if (/\d/.test(pw)) kinds++;
    if (/[A-Z]/.test(pw)) kinds++;
    if (/[a-z]/.test(pw)) kinds++;
    if (/[!~\-*^]/.test(pw)) kinds++;
    return kinds >= 3;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms) {
      setError("Required terms must be accepted.");
      return;
    }
    if (!passwordOk(password)) {
      setError("Password must be 10–20 chars with at least 3 of: number, upper, lower, symbol (!~-*^).");
      return;
    }
    if (!verifyCode.trim()) {
      setError("Enter mock verification code (any 4+ digits).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await signup({ email, password, nickname });
      saveSession(res.data);
      void marketing;
      router.push("/");
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

      <div className="panel space-y-3 p-4">
        <p className="text-sm font-semibold">Social sign up (mock)</p>
        <div className="grid grid-cols-2 gap-2">
          {["LINE", "Google", "X", "Apple"].map((p) => (
            <button
              key={p}
              type="button"
              className="btn btn-ghost text-sm"
              onClick={() => alert(`${p} OAuth is mock-only. No real provider.`)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <form className="panel space-y-4 p-6" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Nickname (random)</span>
          <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          <span className="text-xs text-muted">Nickname is generated randomly on sign up.</span>
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Email</span>
          <div className="flex gap-2">
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button
              type="button"
              className="btn btn-ghost whitespace-nowrap"
              onClick={() =>
                setEmailOk(email.includes("@") ? "Email is available (mock)." : "Invalid email format.")
              }
            >
              Check
            </button>
          </div>
          {emailOk && <span className="text-xs text-muted">{emailOk}</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost text-sm"
            onClick={() => alert("Mock verification code sent. Enter any 4+ digits.")}
          >
            Send code
          </button>
          <input
            className="input"
            placeholder="Verification code"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
          />
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="text-xs text-muted">10–20 chars · 3+ of number/upper/lower/symbol</span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>I agree to the required terms (mock).</span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
          <span>I agree to marketing use of personal data (optional).</span>
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
