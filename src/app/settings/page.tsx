import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import UsernameForm from "@/components/UsernameForm";
import BioForm from "@/components/BioForm";
import RatingModeForm from "@/components/RatingModeForm";
import VisibilityForm from "@/components/VisibilityForm";
import RatingLegendForm from "@/components/RatingLegendForm";
import RymImportForm from "@/components/RymImportForm";
import HelpTip from "@/components/HelpTip";
import { isValidLegend } from "@/lib/ratingLegend";
import { isValidGranularity } from "@/lib/ratings";
import { usernameRules } from "@/lib/usernames";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/");

  const db = getDb();
  const [user, shelf] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.query.albums.findMany({
      where: eq(albums.userId, userId),
      columns: { id: true, title: true, artist: true },
    }),
  ]);
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
              <dt className="text-[var(--muted)]">Email</dt>
              <dd>{user.email ?? "—"}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
            Username
            <HelpTip
              text={`Your public shelf lives at /u/${user.username ?? "…"}. Changing your username changes that link. ${usernameRules}`}
            />
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
          <h2 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
            Bio
            <HelpTip text="Shown on your public shelf. Leave empty to hide it." />
          </h2>
          <BioForm initialBio={user.bio} />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
            Ratings
            <HelpTip text="How you rate albums: whole stars, half stars, or decimal form. Switching only changes how ratings look — nothing you've rated is lost." />
          </h2>
          <RatingModeForm
            initialMode={
              isValidGranularity(user.ratingGranularity)
                ? user.ratingGranularity
                : "integer"
            }
          />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
            Rating legend
            <HelpTip text="Describe what each star rating means to you. Filled-in descriptions are shown as a legend on your public shelf; clear them all to remove the legend." />
          </h2>
          <RatingLegendForm
            initialLegend={
              isValidLegend(user.ratingLegend) ? user.ratingLegend : null
            }
          />
        </section>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--muted)]">
            Import from RateYourMusic
            <HelpTip text="Imports your rated RYM albums into listening history. Ratings are converted from RYM's 1-10 scale to stars (7/10 becomes 3.5 stars; anything below 2 stars becomes 1 star)." />
          </h2>
          <RymImportForm initialShelf={shelf} />
        </section>
      </div>
    </main>
  );
}
