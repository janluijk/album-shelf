"use client";

import type { Album } from "@/lib/db/schema";
import type { RatingGranularity } from "@/lib/ratings";
import AlbumCover from "@/components/AlbumCover";
import StarRating from "@/components/StarRating";
import ViewAllTile from "@/components/ViewAllTile";

type ListenedGridProps = {
  albums: Album[];
  ratingGranularity: RatingGranularity;
  onOpen: (id: number) => void;
  onRate: (id: number, rating: number) => void;
  onRemove: (id: number) => void;
  viewAll?: { href: string; count: number };
};

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function ListenedGrid({
  albums,
  ratingGranularity,
  onOpen,
  onRate,
  onRemove,
  viewAll,
}: ListenedGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {albums.map((album) => (
        <li key={album.id} className="group">
          <button
            type="button"
            onClick={() => onOpen(album.id)}
            aria-haspopup="dialog"
            className="block w-full cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
          >
            <AlbumCover coverUrl={album.coverUrl} title={album.title} />
          </button>
          <div className="mt-2">
            <div className="flex items-start justify-between gap-1">
              <p className="truncate text-sm font-medium">{album.title}</p>
              <button
                type="button"
                onClick={() => onRemove(album.id)}
                aria-label={`Remove ${album.title}`}
                className="shrink-0 text-[var(--muted)] opacity-0 transition group-hover:opacity-100 hover:text-[var(--accent)]"
              >
                ✕
              </button>
            </div>
            <p className="truncate text-xs text-[var(--muted)]">
              {album.artist}
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
              <StarRating
                value={album.rating}
                mode={ratingGranularity}
                onChange={(rating) => onRate(album.id, rating)}
              />
              <span className="text-xs text-[var(--muted)]">
                {formatDate(album.listenedOn!)}
              </span>
            </div>
          </div>
        </li>
      ))}
      {viewAll && (
        <li>
          <ViewAllTile href={viewAll.href} count={viewAll.count} />
        </li>
      )}
    </ul>
  );
}
