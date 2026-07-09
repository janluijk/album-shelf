import Link from "next/link";

const messages: Record<string, { title: string; body: string }> = {
  Verification: {
    title: "Sign-in link expired",
    body: "This sign-in link is invalid or has already been used. Links only work once and expire after a while.",
  },
  AccessDenied: {
    title: "Access denied",
    body: "You do not have permission to sign in with this account.",
  },
};

const fallback = {
  title: "Something went wrong",
  body: "We could not sign you in. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = (error && messages[error]) || fallback;

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
        <h1 className="text-2xl font-semibold">{message.title}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{message.body}</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white"
        >
          Request a new link
        </Link>
      </div>
    </main>
  );
}
