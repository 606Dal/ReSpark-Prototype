import { productStatusLabel, tradeStatusLabel } from "@/lib/format";

const productTone: Record<string, string> = {
  ON_SALE: "bg-emerald-100 text-emerald-800",
  RESERVED: "bg-sky-100 text-sky-800",
  SOLD: "bg-zinc-200 text-zinc-700",
};

const tradeTone: Record<string, string> = {
  IN_PROGRESS: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELED: "bg-rose-100 text-rose-800",
};

export function ProductStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${productTone[status] ?? "bg-zinc-100 text-zinc-700"}`}
    >
      {productStatusLabel(status)}
    </span>
  );
}

export function TradeStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${tradeTone[status] ?? "bg-zinc-100 text-zinc-700"}`}
    >
      {tradeStatusLabel(status)}
    </span>
  );
}
