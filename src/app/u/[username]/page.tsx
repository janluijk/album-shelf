import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { partitionAlbums } from "@/lib/albums";
import { isValidGranularity } from "@/lib/ratings";
import CoverThumb from "@/components/CoverThumb";
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
          Listened
        </h2>
        {history.length === 0 && (
          <p className="text-sm text-[var(--muted)]">Nothing here yet.</p>
        )}
        <ul className="space-y-3">
          {history.map((album) => (
            <li key={album.id}>
              <div className="flex items-center gap-3">
                <CoverThumb coverUrl={album.coverUrl} title={album.title} />
                <div className="flex-1">
                  <span className="text-sm font-medium">{album.title}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {" "}
                    — {album.artist}
                  </span>
                  <div className="text-xs text-[var(--muted)]">
                    {formatDate(album.listenedOn!)}
                  </div>
                </div>
                <StarRating value={album.rating} mode={ratingMode} />
              </div>
              {album.note && (
                <p className="mt-1 text-xs italic text-[var(--muted)]">
                  {album.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
