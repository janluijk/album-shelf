"use client";

import { useEffect, useRef } from "react";
import type { Album } from "@/lib/db/schema";
import type { RatingGranularity } from "@/lib/ratings";
import AlbumCover from "@/components/AlbumCover";
import StarRating from "@/components/StarRating";

type AlbumReviewModalProps = {
  album: Album;
  ratingMode: RatingGranularity;
  onClose: () => void;
  onRate?: (rating: number) => void;
  onSaveNote?: (note: string | null) => void;
};

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AlbumReviewModal({
  album,
  ratingMode,
  onClose,
  onRate,
  onSaveNote,
}: AlbumReviewModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "button, a[href], textarea, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-[modal-fade_200ms_ease-out]"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${album.title} by ${album.artist}`}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 animate-[modal-pop_200ms_ease-out]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{album.title}</h2>
            <p className="text-sm text-[var(--muted)]">
              {album.artist}
              {album.releaseYear && ` · ${album.releaseYear}`}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg border border-[var(--card-border)] px-2.5 py-1 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            ✕
          </button>
        </div>
        <div className="mx-auto mt-4 max-w-xs">
          <AlbumCover coverUrl={album.coverUrl} title={album.title} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <StarRating
            value={album.rating}
            mode={ratingMode}
            onChange={onRate}
          />
          {album.listenedOn && (
            <span className="text-xs text-[var(--muted)]">
              Listened {formatDate(album.listenedOn)}
            </span>
          )}
        </div>
        {onSaveNote ? (
          <textarea
            defaultValue={album.note ?? ""}
            placeholder="Add a note…"
            rows={3}
            onBlur={(event) => {
              const note = event.target.value.trim() || null;
              if (note === album.note) return;
              onSaveNote(note);
            }}
            className="mt-3 w-full resize-none rounded-lg border border-[var(--card-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        ) : (
          album.note && (
            <p className="mt-3 whitespace-pre-line border-t border-[var(--card-border)] pt-3 text-sm text-[var(--foreground)]">
              {album.note}
            </p>
          )
        )}
      </div>
    </div>
  );
}
