import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/");

  const db = getDb();
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) redirect("/");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Back to shelf
        </Link>
      </header>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-4">
          Account
        </h2>
        <dl className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[var(--muted)]">Username</dt>
            <dd>
              {user.username ? (
                <Link
                  href={`/u/${user.username}`}
                  className="hover:text-[var(--accent)]"
                >
                  @{user.username}
                </Link>
              ) : (
                <span className="text-[var(--muted)]">—</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[var(--muted)]">Email</dt>
            <dd>{user.email ?? "—"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
