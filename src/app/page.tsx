import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { getDb } from "@/lib/db";
import { albums } from "@/lib/db/schema";
import Shelf from "@/components/Shelf";

function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold">Album Shelf</h1>
      <p className="max-w-md text-center text-[var(--muted)]">
        Queue albums you want to hear, rate the ones you have, and share your
        shelf with friends.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium"
        >
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return <Landing />;

  const db = getDb();
  const userAlbums = await db.query.albums.findMany({
    where: eq(albums.userId, userId),
  });

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Album Shelf</h1>
        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
          {session.user.username && (
            <Link
              href={`/u/${session.user.username}`}
              className="hover:text-[var(--accent)]"
            >
              @{session.user.username}
            </Link>
          )}
          <Link href="/settings" className="hover:text-[var(--accent)]">
            Settings
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-[var(--card-border)] px-3 py-1.5"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <Shelf initialAlbums={userAlbums} />
    </main>
  );
}
