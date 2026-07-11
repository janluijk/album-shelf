import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums } from "@/lib/db/schema";
import DevShelfReset from "@/components/DevShelfReset";

export default async function DevResetPage() {
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction) notFound();

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/");

  const userAlbums = await getDb().query.albums.findMany({
    where: eq(albums.userId, userId),
    columns: { id: true },
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Test reset</h1>
        <Link
          href="/settings"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Settings
        </Link>
      </header>
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Reset shelf to a clean state
        </h2>
        <DevShelfReset albumCount={userAlbums.length} />
        <p className="mt-3 text-xs text-[var(--muted)]">
          Removes every album on your shelf so you can rerun an import from
          scratch. Only available on dev and preview deployments.
        </p>
      </section>
    </main>
  );
}
