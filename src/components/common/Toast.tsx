"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastItem = { id: number; message: string; tone?: "ok" | "err" | "info" };

const ToastCtx = createContext<{
  push: (message: string, tone?: ToastItem["tone"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((message: string, tone: ToastItem["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border px-3 py-2 text-sm shadow-lg ${
              t.tone === "err"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : t.tone === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-line bg-white text-ink"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast requires ToastProvider");
  return ctx;
}
