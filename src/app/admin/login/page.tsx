"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MockBadge } from "@/components/common/MockBadge";
import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@respark.test");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-[#10241c] px-4">
      <form
        className="w-full max-w-md space-y-4 rounded-2xl bg-[#f4f8f6] p-6 text-ink"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          try {
            const res = await login(email, password);
            if (res.data.user.role !== "ADMIN") {
              setError("Admin role required.");
              return;
            }
            saveSession(res.data);
            router.push("/admin");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        }}
      >
        <div className="flex items-center gap-2">
          <h1 className="display text-2xl font-bold">Admin login</h1>
          <MockBadge />
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Email</span>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-semibold">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button className="btn btn-primary w-full">Enter console</button>
        <p className="text-xs text-muted">admin@respark.test / admin1234</p>
      </form>
    </div>
  );
}
