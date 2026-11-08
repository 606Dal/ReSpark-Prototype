import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Client-heavy mock UI; opt out of instant-nav validation for stage-1. */
export const instant = false;

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <Footer />
    </>
  );
}
