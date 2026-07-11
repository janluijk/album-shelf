import Link from "next/link";
import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function ShelvesPage() {
  const db = getDb();
  const listened = sql<number>`count(${albums.id}) filter (where ${albums.listenedOn} is not null)`;
  const shelves = await db
    .select({
      username: users.username,
      bio: users.bio,
      listened,
    })
    .from(users)
    .leftJoin(albums, eq(albums.userId, users.id))
    .where(sql`${users.shelfPublic} and ${isNotNull(users.username)}`)
    .groupBy(users.id)
    .orderBy(desc(listened), users.username);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Browse shelves</h1>
        <p className="text-sm text-[var(--muted)]">
          Public shelves from everyone on Album Shelf.
        </p>
      </header>
      {shelves.length === 0 && (
        <p className="text-sm text-[var(--muted)]">No public shelves yet.</p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {shelves.map((shelf) => (
          <li key={shelf.username}>
            <Link
              href={`/u/${shelf.username}`}
              className="block h-full rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--accent)]"
            >
              <p className="text-sm font-medium">@{shelf.username}</p>
              <p className="text-xs text-[var(--muted)]">
                {Number(shelf.listened)} album
                {Number(shelf.listened) === 1 ? "" : "s"} listened
              </p>
              {shelf.bio && (
                <p className="mt-2 line-clamp-2 text-xs text-[var(--muted)]">
                  {shelf.bio}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
