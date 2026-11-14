"use client";
import Link from "next/link";
import { MockBadge } from "@/components/common/MockBadge";
export default function Page() {
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center gap-2"><h1 className="display text-3xl font-bold">Forgot password</h1><MockBadge /></div>
      <form className="panel space-y-3 p-5" onSubmit={(e)=>{e.preventDefault(); alert("Mock verification flow complete.");}}>
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" placeholder="Verification code" />
        <input className="input" type="password" placeholder="New password" />
        <input className="input" type="password" placeholder="Confirm password" />
        <button className="btn btn-primary">Submit</button>
      </form>
      <Link href="/login" className="text-sm text-brand">Back</Link>
    </div>
  );
}
