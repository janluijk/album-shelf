import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 text-center">
        <h1 className="text-2xl font-semibold">Check your email</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          A sign-in link has been sent to your email address. Click the link in
          the email to sign in — you can close this tab.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Nothing arrived? Check your spam folder or{" "}
          <Link href="/" className="text-[var(--accent)] hover:underline">
            request a new link
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
