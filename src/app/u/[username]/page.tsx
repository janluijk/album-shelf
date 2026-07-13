import Image from "next/image";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { partitionAlbums } from "@/lib/albums";
import { isValidGranularity } from "@/lib/ratings";
import { isValidLegend, legendEntries } from "@/lib/ratingLegend";
import StarRating from "@/components/StarRating";
import ProfileAlbumGrid from "@/components/ProfileAlbumGrid";

const recentActivityLimit = 5;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });
  if (!user) notFound();

  if (!user.shelfPublic) {
    const session = await auth();
    const isOwner = session?.user?.id === user.id;
    if (!isOwner) notFound();
  }

  const userAlbums = await db.query.albums.findMany({
    where: eq(albums.userId, user.id),
  });
  const { history } = partitionAlbums(userAlbums);
  const ratingMode = isValidGranularity(user.ratingGranularity)
    ? user.ratingGranularity
    : "integer";
  const legend = isValidLegend(user.ratingLegend)
    ? legendEntries(user.ratingLegend)
    : [];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">@{user.username}</h1>
        <p className="text-sm text-[var(--muted)]">
          {history.length} album
          {history.length === 1 ? "" : "s"} listened
        </p>
      </header>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr_220px]">
        <aside className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 md:sticky md:top-6">
          <div className="flex flex-col items-center gap-4">
            {user.image ? (
              <Image
                src={user.image}
                alt={`@${user.username} avatar`}
                width={150}
                height={150}
                className="h-36 w-36 rounded-full object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-36 w-36 items-center justify-center rounded-full border border-[var(--card-border)] text-5xl uppercase text-[var(--muted)]"
              >
                {user.username?.charAt(0) ?? "?"}
              </div>
            )}
            <p className="text-sm font-medium">@{user.username}</p>
            {user.bio && (
              <p className="w-full whitespace-pre-line break-words text-sm text-[var(--foreground)]">
                {user.bio}
              </p>
            )}
          </div>
        </aside>
        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Recent activity
          </h2>
          {history.length === 0 && (
            <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
          )}
          <ProfileAlbumGrid
            history={history.slice(0, recentActivityLimit)}
            ratingMode={ratingMode}
            viewAll={
              history.length > recentActivityLimit
                ? {
                    href: `/u/${user.username}/history`,
                    count: history.length,
                  }
                : undefined
            }
          />
        </section>
        {legend.length > 0 && (
          <aside className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 md:col-span-2 lg:sticky lg:top-6 lg:col-span-1">
            <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
              My rating legend
            </h2>
            <dl className="space-y-1.5 text-sm">
              {legend.map((entry) => (
                <div key={entry.stars} className="flex items-center gap-3">
                  <dt className="shrink-0">
                    <StarRating value={entry.stars} />
                  </dt>
                  <dd className="text-[var(--muted)]">{entry.label}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>
    </main>
  );
}
