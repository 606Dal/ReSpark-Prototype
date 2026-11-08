export function MockBadge({ label = "MOCK" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[#fff1e6] px-2 py-0.5 text-[11px] font-bold tracking-wide text-spark">
      {label}
    </span>
  );
}
