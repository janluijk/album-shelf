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
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[var(--card-border)] text-[var(--muted)]"
      >
        ♪
      </div>
    );
  }

  return (
    <Image
      src={coverUrl}
      alt={`${title} cover art`}
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 rounded-md object-cover"
    />
  );
}
