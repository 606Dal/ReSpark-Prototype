import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import type { Locale } from "./config";

const dictionaries = { en, ko } as const;

export type Messages = typeof en;

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}

type NestedValue = string | { [key: string]: NestedValue };

export function t(
  messages: Messages,
  path: string,
  vars?: Record<string, string | number>
): string {
  const parts = path.split(".");
  let cur: NestedValue = messages as unknown as NestedValue;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return path;
    cur = cur[p];
  }
  if (typeof cur !== "string") return path;
  if (!vars) return cur;
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replaceAll(`{${k}}`, String(v)),
    cur
  );
}
