import { getApiMode } from "@/lib/api/config";
import type { PlatformAdapters } from "../types";

/**
 * Stage 1: UI calls `lib/api/*` → same-origin `/api/*` Route Handlers → in-memory store.
 * This module documents the swap point for Stage 2 (real gateway).
 */
export function createMockAdapters(): PlatformAdapters {
  const base = "";
  return {
    auth: {
      login: (email, password) =>
        fetch(`${base}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }).then((r) => r.json()),
      signup: (input) =>
        fetch(`${base}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }).then((r) => r.json()),
    },
    products: {
      list: (params) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v) qs.set(k, v);
        });
        return fetch(`${base}/api/products?${qs}`).then((r) => r.json());
      },
      get: (id) => fetch(`${base}/api/products/${id}`).then((r) => r.json()),
      create: (input) =>
        fetch(`${base}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }).then((r) => r.json()),
      update: (id, input) =>
        fetch(`${base}/api/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }).then((r) => r.json()),
      remove: (id) =>
        fetch(`${base}/api/products/${id}`, { method: "DELETE" }).then((r) => r.json()),
    },
  };
}

export function createRealAdapters(): PlatformAdapters {
  throw new Error(
    `Real adapters are not implemented in Stage 1. Set NEXT_PUBLIC_API_MODE=mock (current=${getApiMode()}).`
  );
}

export function getAdapters(): PlatformAdapters {
  return getApiMode() === "real" ? createRealAdapters() : createMockAdapters();
}
