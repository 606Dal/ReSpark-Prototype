import type { ApiResponse } from "@/types";

const DEFAULT_BASE = "";

/**
 * Central HTTP client.
 * Stage 2: point NEXT_PUBLIC_API_BASE_URL at Spring API Gateway.
 */
export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("Invalid API response", res.status);
  }

  if (!res.ok || !payload.success) {
    throw new ApiError(payload.message || `Request failed (${res.status})`, res.status);
  }

  return payload;
}
