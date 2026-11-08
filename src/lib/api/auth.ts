import type { AuthSession, User } from "@/types";
import { apiFetch } from "./client";

export async function login(email: string, password: string) {
  return apiFetch<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(input: {
  email: string;
  password: string;
  nickname: string;
}) {
  return apiFetch<AuthSession>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getMe(token: string) {
  return apiFetch<User>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
