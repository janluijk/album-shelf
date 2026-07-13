import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { isValidGranularity } from "@/lib/ratings";
import HistoryShelf from "@/components/HistoryShelf";

export default async function HistoryPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/");

  const db = getDb();
  const [userAlbums, user] = await Promise.all([
    db.query.albums.findMany({ where: eq(albums.userId, userId) }),
    db.query.users.findFirst({ where: eq(users.id, userId) }),
  ]);
  const ratingGranularity = isValidGranularity(user?.ratingGranularity)
    ? user.ratingGranularity
    : "integer";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Listening history</h1>
        <Link
          href="/"
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← Back to shelf
        </Link>
      </header>
      <HistoryShelf
        initialAlbums={userAlbums}
        ratingGranularity={ratingGranularity}
      />
    </main>
  );
}
