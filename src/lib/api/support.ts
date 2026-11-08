import type { FaqItem, Inquiry, Notice } from "@/types";
import { apiFetch } from "./client";

export async function fetchNotices() {
  return apiFetch<Notice[]>("/api/notices");
}

export async function fetchFaq() {
  return apiFetch<FaqItem[]>("/api/faq");
}

export async function createInquiry(input: {
  userId: number;
  description: string;
}) {
  return apiFetch<Inquiry>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
