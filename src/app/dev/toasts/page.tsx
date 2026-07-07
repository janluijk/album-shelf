import { notFound } from "next/navigation";
import ToastPlayground from "@/components/ToastPlayground";

export default function ToastsDevPage() {
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Toast playground</h1>
        <p className="text-sm text-[var(--muted)]">
          Development-only page for exercising every notification variant. Not
          available in production.
        </p>
      </header>
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Variants
        </h2>
        <ToastPlayground />
      </section>
    </main>
  );
}
