export type ApiMode = "mock" | "real";

export function getApiMode(): ApiMode {
  return process.env.NEXT_PUBLIC_API_MODE === "real" ? "real" : "mock";
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
}
