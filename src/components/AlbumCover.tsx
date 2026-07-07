import Image from "next/image";

type AlbumCoverProps = {
  coverUrl: string | null;
  title: string;
};

export default function AlbumCover({ coverUrl, title }: AlbumCoverProps) {
  if (!coverUrl) {
    return (
      <div
        aria-hidden
        className="flex aspect-square w-full items-center justify-center rounded-xl border border-[var(--card-border)] text-3xl text-[var(--muted)]"
      >
        ♪
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl">
      <Image
        src={coverUrl}
        alt={`${title} cover art`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
        className="object-cover"
      />
    </div>
  );
}
