import Link from "next/link";

type ViewAllTileProps = {
  href: string;
  count: number;
};

export default function ViewAllTile({ href, count }: ViewAllTileProps) {
  return (
    <Link
      href={href}
      className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border border-[var(--card-border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
      <span className="text-xs uppercase tracking-wider">
        View all {count}
      </span>
    </Link>
  );
}
