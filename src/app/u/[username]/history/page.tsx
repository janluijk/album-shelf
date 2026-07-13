import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { partitionAlbums } from "@/lib/albums";
import { isValidGranularity } from "@/lib/ratings";
import ProfileAlbumGrid from "@/components/ProfileAlbumGrid";

export default async function ProfileHistoryPage({
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
    <main className="mx-auto w-full max-w-5xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">@{user.username}</h1>
          <p className="text-sm text-[var(--muted)]">
            {history.length} album
            {history.length === 1 ? "" : "s"} listened
          </p>
        </div>
        <Link
          href={`/u/${user.username}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Back to profile
        </Link>
      </header>
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Listening history
        </h2>
        <ProfileAlbumGrid history={history} ratingMode={ratingMode} />
      </section>
    </main>
  );
}
