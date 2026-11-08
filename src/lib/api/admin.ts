import type {
  Inquiry,
  Product,
  Purchase,
  Report,
  Settlement,
  User,
} from "@/types";
import { apiFetch } from "./client";

export async function fetchAdminMembers(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetch<User[]>(`/api/admin/members${qs}`);
}

export async function fetchAdminProducts() {
  return apiFetch<Product[]>("/api/admin/products");
}

export async function fetchAdminTrades() {
  return apiFetch<Purchase[]>("/api/admin/trades");
}

export async function fetchAdminSettlements() {
  return apiFetch<Settlement[]>("/api/admin/settlements");
}

export async function fetchAdminReports() {
  return apiFetch<Report[]>("/api/admin/reports");
}

export async function fetchAdminInquiries() {
  return apiFetch<Inquiry[]>("/api/admin/inquiries");
}
