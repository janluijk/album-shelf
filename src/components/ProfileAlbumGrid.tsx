"use client";

import { useState } from "react";
import type { Album } from "@/lib/db/schema";
import type { RatingGranularity } from "@/lib/ratings";
import AlbumCover from "@/components/AlbumCover";
import StarRating from "@/components/StarRating";
import AlbumReviewModal from "@/components/AlbumReviewModal";
import ViewAllTile from "@/components/ViewAllTile";

type ProfileAlbumGridProps = {
  history: Album[];
  ratingMode: RatingGranularity;
  viewAll?: { href: string; count: number };
};

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileAlbumGrid({
  history,
  ratingMode,
  viewAll,
}: ProfileAlbumGridProps) {
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {history.map((album) => (
          <li key={album.id}>
            <button
              type="button"
              onClick={() => setOpenAlbum(album)}
              aria-haspopup="dialog"
              className="block w-full cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <AlbumCover coverUrl={album.coverUrl} title={album.title} />
              <div className="mt-2">
                <p className="truncate text-sm font-medium">{album.title}</p>
                <p className="truncate text-xs text-[var(--muted)]">
                  {album.artist}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
                  <StarRating value={album.rating} mode={ratingMode} />
                  <span className="text-xs text-[var(--muted)]">
                    {formatDate(album.listenedOn!)}
                  </span>
                </div>
              </div>
            </button>
          </li>
        ))}
        {viewAll && (
          <li>
            <ViewAllTile href={viewAll.href} count={viewAll.count} />
          </li>
        )}
      </ul>
      {openAlbum && (
        <AlbumReviewModal
          album={openAlbum}
          ratingMode={ratingMode}
          onClose={() => setOpenAlbum(null)}
        />
      )}
    </>
  );
}
