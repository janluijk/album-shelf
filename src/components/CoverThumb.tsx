import Image from "next/image";

type CoverThumbProps = {
  coverUrl: string | null;
  title: string;
};

export default function CoverThumb({ coverUrl, title }: CoverThumbProps) {
  if (!coverUrl) {
    return (
      <div
        aria-hidden
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-[var(--card-border)] text-[var(--muted)]"
      >
        ♪
      </div>
    );
  }

  return (
    <Image
      src={coverUrl}
      alt={`${title} cover art`}
      width={56}
      height={56}
      className="h-14 w-14 shrink-0 rounded-md object-cover"
    />
  );
}
