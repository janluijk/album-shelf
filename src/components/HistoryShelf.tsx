"use client";

import { useState } from "react";
import type { Album } from "@/lib/db/schema";
import { partitionAlbums } from "@/lib/albums";
import AlbumReviewModal from "@/components/AlbumReviewModal";
import ListenedGrid from "@/components/ListenedGrid";
import type { RatingGranularity } from "@/lib/ratings";

const PAGE_SIZE = 20;

type HistoryShelfProps = {
  initialAlbums: Album[];
  ratingGranularity: RatingGranularity;
};

export default function HistoryShelf({
  initialAlbums,
  ratingGranularity,
}: HistoryShelfProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openAlbumId, setOpenAlbumId] = useState<number | null>(null);
  const { history } = partitionAlbums(albums);
  const openAlbum = albums.find((album) => album.id === openAlbumId) ?? null;
  const hasMore = history.length > visibleCount;

  function patchAlbum(id: number, updates: Partial<Album>) {
    setAlbums((current) =>
      current.map((album) =>
        album.id === id ? { ...album, ...updates } : album,
      ),
    );
    void fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  function removeAlbum(id: number) {
    setAlbums((current) => current.filter((album) => album.id !== id));
    void fetch(`/api/albums/${id}`, { method: "DELETE" });
  }

  return (
    <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Listened
        </h2>
        <span className="text-xs text-[var(--muted)]">
          {history.length} {history.length === 1 ? "album" : "albums"}
        </span>
      </div>
      {history.length === 0 && (
        <p className="text-sm text-[var(--muted)]">
          Albums you mark as listened show up here.
        </p>
      )}
      <ListenedGrid
        albums={history.slice(0, visibleCount)}
        ratingGranularity={ratingGranularity}
        onOpen={setOpenAlbumId}
        onRate={(id, rating) => patchAlbum(id, { rating })}
        onRemove={removeAlbum}
      />
      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
            className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium hover:border-[var(--accent)]"
          >
            Load more
          </button>
        </div>
      )}

      {openAlbum && (
        <AlbumReviewModal
          album={openAlbum}
          ratingMode={ratingGranularity}
          onClose={() => setOpenAlbumId(null)}
          onRate={(rating) => patchAlbum(openAlbum.id, { rating })}
          onSaveNote={(note) => patchAlbum(openAlbum.id, { note })}
        />
      )}
    </section>
  );
}
