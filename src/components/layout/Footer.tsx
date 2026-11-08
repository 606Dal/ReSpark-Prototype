import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-[#0f2a21] text-[#d7e8df]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="display text-2xl font-bold text-white">
            Re<span className="text-spark">Spark</span>
          </p>
          <p className="mt-2 text-sm text-[#a9c3b7]">
            Global secondhand marketplace prototype. Stage 1 mock APIs only.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Company</p>
          <p className="mt-2">ReSpark Demo Co.</p>
          <p>support@respark.test</p>
          <p>+82-2-0000-0000</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Links</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link href="/support">Customer center</Link>
            <Link href="/admin/login">Admin console</Link>
            <Link href="/products">Product catalog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
