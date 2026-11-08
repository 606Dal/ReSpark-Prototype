"use client";

import type { AuthSession, User } from "@/types";

const KEY = "respark.mock.session";

export function saveSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("respark-auth"));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("respark-auth"));
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function readUser(): User | null {
  return readSession()?.user ?? null;
}
