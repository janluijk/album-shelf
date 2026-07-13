"use client";

import { useState } from "react";
import type { Album } from "@/lib/db/schema";
import { partitionAlbums, reorderQueue } from "@/lib/albums";
import AlbumAutocomplete from "@/components/AlbumAutocomplete";
import AlbumCover from "@/components/AlbumCover";
import AlbumReviewModal from "@/components/AlbumReviewModal";
import ListenedGrid from "@/components/ListenedGrid";
import type { RatingGranularity } from "@/lib/ratings";

const RECENT_LISTENED_LIMIT = 5;

type ShelfProps = {
  initialAlbums: Album[];
  ratingGranularity: RatingGranularity;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Shelf({ initialAlbums, ratingGranularity }: ShelfProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const [openAlbumId, setOpenAlbumId] = useState<number | null>(null);
  const { queue, history } = partitionAlbums(albums);
  const openAlbum = albums.find((album) => album.id === openAlbumId) ?? null;

  async function addAlbum() {
    const canAdd = title.trim().length > 0 && artist.trim().length > 0;
    if (!canAdd) return;
    const response = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), artist: artist.trim() }),
    });
    if (!response.ok) return;
    const created: Album = await response.json();
    setAlbums((current) => [...current, created]);
    setTitle("");
    setArtist("");
  }

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

  function dropOnAlbum(targetId: number) {
    setDropTargetId(null);
    if (draggedId === null) return;
    const swaps = reorderQueue(queue, draggedId, targetId);
    swaps.forEach((swap) => patchAlbum(swap.id, { position: swap.position }));
  }

  function removeAlbum(id: number) {
    setAlbums((current) => current.filter((album) => album.id !== id));
    void fetch(`/api/albums/${id}`, { method: "DELETE" });
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Listened
        </h2>
        {history.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            Albums you mark as listened show up here.
          </p>
        )}
        <ListenedGrid
          albums={history.slice(0, RECENT_LISTENED_LIMIT)}
          ratingGranularity={ratingGranularity}
          onOpen={setOpenAlbumId}
          onRate={(id, rating) => patchAlbum(id, { rating })}
          onRemove={removeAlbum}
          viewAll={
            history.length > RECENT_LISTENED_LIMIT
              ? { href: "/history", count: history.length }
              : undefined
          }
        />
      </section>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Want to listen
        </h2>
        {queue.length === 0 && (
          <p className="text-sm text-[var(--muted)] mb-3">
            Your queue is empty. Add an album below.
          </p>
        )}
        <ul className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {queue.map((album) => (
            <li
              key={album.id}
              draggable
              onDragStart={() => setDraggedId(album.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setDropTargetId(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setDropTargetId(album.id);
              }}
              onDragLeave={() =>
                setDropTargetId((current) =>
                  current === album.id ? null : current,
                )
              }
              onDrop={(event) => {
                event.preventDefault();
                dropOnAlbum(album.id);
              }}
              className={`group cursor-grab rounded-xl transition ${
                draggedId === album.id ? "opacity-40" : ""
              } ${
                dropTargetId === album.id && draggedId !== album.id
                  ? "outline-2 outline-[var(--accent)]"
                  : ""
              }`}
            >
              <div className="grayscale opacity-60 transition group-hover:opacity-90">
                <AlbumCover coverUrl={album.coverUrl} title={album.title} />
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium">{album.title}</p>
                <p className="truncate text-xs text-[var(--muted)]">
                  {album.artist}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => patchAlbum(album.id, { listenedOn: today() })}
                  className="rounded-lg bg-[var(--accent)] text-white px-2.5 py-1 text-xs font-medium"
                >
                  Listened
                </button>
                <button
                  type="button"
                  onClick={() => removeAlbum(album.id)}
                  aria-label={`Remove ${album.title}`}
                  className="text-[var(--muted)] hover:text-[var(--accent)]"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder="Artist"
            aria-label="Artist"
            className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <AlbumAutocomplete
            title={title}
            artist={artist}
            onChangeTitle={setTitle}
            onSelect={(result) => {
              setTitle(result.title);
              setArtist(result.artist);
            }}
          />
          <button
            type="button"
            onClick={addAlbum}
            disabled={!title.trim() || !artist.trim()}
            className="shrink-0 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
          >
            Add
          </button>
        </div>
      </section>

      {openAlbum && (
        <AlbumReviewModal
          album={openAlbum}
          ratingMode={ratingGranularity}
          onClose={() => setOpenAlbumId(null)}
          onRate={(rating) => patchAlbum(openAlbum.id, { rating })}
          onSaveNote={(note) => patchAlbum(openAlbum.id, { note })}
        />
      )}
    </div>
  );
}
