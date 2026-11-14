import { apiTranslator } from "./apiTranslator";
import { mockTranslator } from "./mockTranslator";
import type { Translator } from "./types";

export function getTranslator(): Translator {
  const mode = process.env.NEXT_PUBLIC_API_MODE ?? "mock";
  return mode === "real" ? apiTranslator : mockTranslator;
}
