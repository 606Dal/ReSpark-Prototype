"use client";

import { LocaleProvider } from "./LocaleProvider";
import { ToastProvider } from "@/components/common/Toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ToastProvider>{children}</ToastProvider>
    </LocaleProvider>
  );
}
