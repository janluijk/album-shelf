import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth, signIn, signOut } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, users } from "@/lib/db/schema";
import { isValidGranularity } from "@/lib/ratings";
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
      <div className="flex w-full max-w-xs items-center gap-3 text-xs uppercase tracking-wider text-[var(--muted)]">
        <span className="h-px flex-1 bg-[var(--card-border)]" />
        or
        <span className="h-px flex-1 bg-[var(--card-border)]" />
      </div>
      <form
        action={async (formData: FormData) => {
          "use server";
          await signIn("resend", formData);
        }}
        className="flex w-full max-w-xs flex-col gap-3"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          className="rounded-lg border border-[var(--card-border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="submit"
          className="rounded-lg border border-[var(--card-border)] px-5 py-2.5 text-sm font-medium hover:border-[var(--accent)]"
        >
          Email me a sign-in link
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
          <Link
            href="/settings"
            aria-label="Settings"
            className="hover:text-[var(--accent)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
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
      <Shelf initialAlbums={userAlbums} ratingGranularity={ratingGranularity} />
    </main>
  );
}
