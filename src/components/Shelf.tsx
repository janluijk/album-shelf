"use client";

import { useState } from "react";
import type { Album } from "@/lib/db/schema";
import { partitionAlbums, swapWithNeighbor } from "@/lib/albums";
import CoverThumb from "@/components/CoverThumb";
import StarRating from "@/components/StarRating";
import type { RatingGranularity } from "@/lib/ratings";

type ShelfProps = {
  initialAlbums: Album[];
  ratingGranularity: RatingGranularity;
};

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function Shelf({ initialAlbums, ratingGranularity }: ShelfProps) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const { queue, history } = partitionAlbums(albums);

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

  function moveAlbum(id: number, direction: "up" | "down") {
    const swaps = swapWithNeighbor(queue, id, direction);
    if (!swaps) return;
    swaps.forEach((swap) => patchAlbum(swap.id, { position: swap.position }));
  }

  function removeAlbum(id: number) {
    setAlbums((current) => current.filter((album) => album.id !== id));
    void fetch(`/api/albums/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Queue
        </h2>
        {queue.length === 0 && (
          <p className="text-sm text-[var(--muted)] mb-3">
            Nothing queued. Add an album below.
          </p>
        )}
        <ul className="space-y-2 mb-5">
          {queue.map((album, index) => (
            <li key={album.id} className="group flex items-center gap-3">
              <CoverThumb coverUrl={album.coverUrl} title={album.title} />
              <div className="flex-1">
                <span className="text-sm font-medium">{album.title}</span>
                <span className="text-sm text-[var(--muted)]">
                  {" "}
                  — {album.artist}
                </span>
              </div>
              {index === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    patchAlbum(album.id, { listenedOn: today() })
                  }
                  className="rounded-lg bg-[var(--accent)] text-white px-3 py-1.5 text-xs font-medium"
                >
                  Mark as listened
                </button>
              )}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveAlbum(album.id, "up")}
                  disabled={index === 0}
                  aria-label={`Move ${album.title} up`}
                  className="text-[var(--muted)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--muted)]"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveAlbum(album.id, "down")}
                  disabled={index === queue.length - 1}
                  aria-label={`Move ${album.title} down`}
                  className="text-[var(--muted)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:text-[var(--muted)]"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeAlbum(album.id)}
                aria-label={`Remove ${album.title}`}
                className="text-[var(--muted)] opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Album"
            className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
          <input
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder="Artist"
            className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
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

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
        <h2 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3">
          Listened
        </h2>
        {history.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            Albums you mark as listened show up here.
          </p>
        )}
        <ul className="space-y-3">
          {history.map((album) => (
            <li key={album.id} className="group">
              <div className="flex items-center gap-3">
                <CoverThumb coverUrl={album.coverUrl} title={album.title} />
                <div className="flex-1">
                  <span className="text-sm font-medium">{album.title}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {" "}
                    — {album.artist}
                  </span>
                  <div className="text-xs text-[var(--muted)]">
                    {formatDate(album.listenedOn!)}
                  </div>
                </div>
                <StarRating
                  value={album.rating}
                  mode={ratingGranularity}
                  onChange={(rating) => patchAlbum(album.id, { rating })}
                />
                <button
                  type="button"
                  onClick={() => removeAlbum(album.id)}
                  aria-label={`Remove ${album.title}`}
                  className="text-[var(--muted)] opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
              <input
                defaultValue={album.note ?? ""}
                placeholder="Add a note…"
                onBlur={(event) => {
                  const note = event.target.value.trim() || null;
                  if (note === album.note) return;
                  patchAlbum(album.id, { note });
                }}
                className="mt-1 w-full bg-transparent border border-transparent focus:border-[var(--card-border)] rounded-lg px-2 py-1 text-xs italic text-[var(--muted)] outline-none"
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
