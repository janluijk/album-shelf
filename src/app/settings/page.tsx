import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import UsernameForm from "@/components/UsernameForm";
import BioForm from "@/components/BioForm";
import RatingModeForm from "@/components/RatingModeForm";
import VisibilityForm from "@/components/VisibilityForm";
import { isValidGranularity } from "@/lib/ratings";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/");

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) redirect("/");

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Back to shelf
        </Link>
      </header>
      <div className="space-y-4">
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Account
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Name</dt>
              <dd>{user.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Email</dt>
              <dd>{user.email ?? "—"}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Username
          </h2>
          <UsernameForm initialUsername={user.username} />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Visibility
          </h2>
          <VisibilityForm initialPublic={user.shelfPublic} />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Bio
          </h2>
          <BioForm initialBio={user.bio} />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Ratings
          </h2>
          <RatingModeForm
            initialMode={
              isValidGranularity(user.ratingGranularity)
                ? user.ratingGranularity
                : "integer"
            }
          />
        </section>
      </div>
    </main>
  );
}
