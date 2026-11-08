"use client";

import { useEffect, useState } from "react";
import { fetchAdminMembers } from "@/lib/api/admin";
import { formatDate } from "@/lib/format";
import type { User } from "@/types";

export default function AdminMembersPage() {
  const [q, setQ] = useState("");
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    fetchAdminMembers(q).then((res) => setMembers(res.data));
  }, [q]);

  return (
    <div className="space-y-4">
      <h1 className="display text-3xl font-bold">Members</h1>
      <input
        className="input max-w-md"
        placeholder="Search email / nickname / status"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#eef6f2] text-muted">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Nickname</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Reports</th>
              <th className="px-3 py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-line">
                <td className="px-3 py-2">{m.email}</td>
                <td className="px-3 py-2">{m.nickname}</td>
                <td className="px-3 py-2">{m.status}</td>
                <td className="px-3 py-2">{m.role}</td>
                <td className="px-3 py-2">{m.reportCount}</td>
                <td className="px-3 py-2">{formatDate(m.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
