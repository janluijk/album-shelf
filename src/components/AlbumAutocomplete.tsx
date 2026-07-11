"use client";

import { useEffect, useId, useRef, useState } from "react";
import { minSearchLength, type AlbumSearchResult } from "@/lib/albumSearch";

const debounceMs = 400;

type AlbumAutocompleteProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSelect: (result: AlbumSearchResult) => void;
};

export default function AlbumAutocomplete({
  value,
  onChangeText,
  onSelect,
}: AlbumAutocompleteProps) {
  const listboxId = useId();
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(new Map<string, AlbumSearchResult[]>());
  const [results, setResults] = useState<AlbumSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  async function search(query: string) {
    const cached = cacheRef.current.get(query);
    if (cached) {
      setResults(cached);
      setLoading(false);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const response = await fetch(
      `/api/albums/search?q=${encodeURIComponent(query)}`,
      { signal: controller.signal },
    ).catch(() => null);
    if (controller.signal.aborted) return;
    setLoading(false);
    if (!response?.ok) {
      setResults(null);
      setError("Search is unavailable right now — you can still add manually.");
      return;
    }
    const { results: found } = await response.json();
    cacheRef.current.set(query, found);
    setResults(found);
  }

  function handleChange(next: string) {
    onChangeText(next);
    setError(null);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    const query = next.trim();
    if (query.length < minSearchLength) {
      abortRef.current?.abort();
      setResults(null);
      setLoading(false);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    timerRef.current = window.setTimeout(() => void search(query), debounceMs);
  }

  function select(result: AlbumSearchResult) {
    setOpen(false);
    onSelect(result);
  }

  const showDropdown = open && (loading || error !== null || results !== null);

  return (
    <div className="relative flex-1 min-w-0">
      <input
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onFocus={() => {
          if (results !== null || loading) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        placeholder="Search album or artist"
        aria-label="Album title"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        role="combobox"
        className="w-full bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      {showDropdown && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg border border-[var(--card-border)] bg-[var(--card)] shadow-lg"
        >
          {loading && (
            <p className="p-3 text-xs text-[var(--muted)]">Searching…</p>
          )}
          {!loading && error && (
            <p className="p-3 text-xs text-[var(--muted)]">{error}</p>
          )}
          {!loading && !error && results?.length === 0 && (
            <p className="p-3 text-xs text-[var(--muted)]">
              No albums found — you can still add it manually.
            </p>
          )}
          {!loading &&
            !error &&
            results?.map((result) => (
              <button
                key={result.id}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => {
                  event.preventDefault();
                  select(result);
                }}
                className="flex w-full items-center gap-3 p-2 text-left hover:bg-[var(--accent)]/10"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-[var(--card-border)] text-sm text-[var(--muted)]">
                  ♪
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.coverUrl}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">{result.title}</span>
                  <span className="block truncate text-xs text-[var(--muted)]">
                    {result.artist}
                    {result.releaseYear && ` · ${result.releaseYear}`}
                  </span>
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
