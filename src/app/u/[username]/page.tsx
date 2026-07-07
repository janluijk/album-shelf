import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { partitionAlbums } from "@/lib/albums";
import { isValidGranularity } from "@/lib/ratings";
import { isValidLegend, legendEntries } from "@/lib/ratingLegend";
import AlbumCover from "@/components/AlbumCover";
import StarRating from "@/components/StarRating";

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {user.name ?? user.username}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          @{user.username} · {history.length} album
          {history.length === 1 ? "" : "s"} listened
        </p>
        {user.bio && (
          <p className="mt-3 whitespace-pre-line text-sm text-[var(--foreground)]">
            {user.bio}
          </p>
        )}
      </header>
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Recent activity
        </h2>
        {history.length === 0 && (
          <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
        )}
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {history.map((album) => (
            <li key={album.id}>
              <AlbumCover coverUrl={album.coverUrl} title={album.title} />
              <div className="mt-2">
                <p className="truncate text-sm font-medium">{album.title}</p>
                <p className="truncate text-xs text-[var(--muted)]">
                  {album.artist}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
                  <StarRating value={album.rating} mode={ratingMode} />
                  <span className="text-xs text-[var(--muted)]">
                    {formatDate(album.listenedOn!)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {legend.length > 0 && (
        <section className="mt-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
          <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
            Rating legend
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
        </section>
      )}
    </main>
  );
}
