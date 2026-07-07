"use client";

import { useRef, useState } from "react";
import type { RatingGranularity } from "@/lib/ratings";
import {
  allowedCutsBetween,
  formatSegment,
  formatValue,
  isValidLegend,
  moveCut,
  normalizeLegend,
  removeCut,
  segmentRanges,
  snapToGrid,
  splitSegment,
  stepFor,
  type RatingLegend,
} from "@/lib/ratingLegend";
import { useNotify } from "@/components/ToastProvider";

type RatingLegendFormProps = {
  initialLegend: RatingLegend | null;
  mode: RatingGranularity;
};

const lowestTint = "#ffd9c2";

function tintFor(index: number, count: number): string {
  const share =
    count === 1 ? 100 : Math.round(10 + (90 * index) / (count - 1));
  return `color-mix(in oklch, var(--accent) ${share}%, ${lowestTint})`;
}

export default function RatingLegendForm({
  initialLegend,
  mode,
}: RatingLegendFormProps) {
  const [legend, setLegend] = useState<RatingLegend | null>(initialLegend);
  const [saved, setSaved] = useState<RatingLegend | null>(initialLegend);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const notify = useNotify();

  const step = stepFor(mode);
  const isUnchanged = JSON.stringify(legend) === JSON.stringify(saved);

  async function persist(next: RatingLegend | null) {
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratingLegend: next }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save rating legend");
      return;
    }
    const updated: { ratingLegend: RatingLegend | null } =
      await response.json();
    setLegend(updated.ratingLegend);
    setSaved(updated.ratingLegend);
    notify({
      title: "Rating legend saved",
      message: next
        ? "Your legend is now shown on your public shelf."
        : "Your legend was removed.",
      variant: "success",
    });
  }

  function save() {
    if (!legend || saving) return;
    const normalized = normalizeLegend(legend);
    if (!isValidLegend(normalized)) {
      setError("Give every segment a short description before saving.");
      return;
    }
    persist(normalized);
  }

  function update(next: RatingLegend | null) {
    setLegend(next);
    setError(null);
  }

  function dragCut(cutIndex: number, clientX: number) {
    const bar = barRef.current;
    if (!bar || !legend) return;
    const rect = bar.getBoundingClientRect();
    const raw = 1 + ((clientX - rect.left) / rect.width) * (4 + step);
    update(moveCut(legend, cutIndex, snapToGrid(raw, mode)));
  }

  if (!legend) {
    return (
      <div>
        <p className="text-xs text-[var(--muted)]">
          Describe what your ratings mean by cutting the 1–5 scale into labeled
          intervals, shown on your public shelf.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => update({ cuts: [], labels: [""] })}
            className="cursor-pointer rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Create legend
          </button>
          {saved && (
            <button
              type="button"
              onClick={() => persist(null)}
              disabled={saving}
              className="cursor-pointer rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
            >
              {saving ? "Removing…" : "Confirm removal"}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-[var(--accent)]">{error}</p>}
      </div>
    );
  }

  const span = 4 + step;
  const boundaries = [1, ...legend.cuts, 1 + span];
  const ranges = segmentRanges(legend, mode);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      <div className="relative mb-6 select-none">
        <div ref={barRef} className="flex h-9 overflow-hidden rounded-lg">
          {legend.labels.map((_, i) => (
            <div
              key={i}
              style={{
                width: `${((boundaries[i + 1] - boundaries[i]) / span) * 100}%`,
                background: tintFor(i, legend.labels.length),
              }}
            />
          ))}
        </div>
        {legend.cuts.map((cut, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Boundary at ${formatValue(cut, mode)}, use arrow keys to move`}
            onPointerDown={(event) =>
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            onPointerMove={(event) => {
              if (!event.currentTarget.hasPointerCapture(event.pointerId))
                return;
              dragCut(i, event.clientX);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft")
                update(moveCut(legend, i, cut - step));
              if (event.key === "ArrowRight")
                update(moveCut(legend, i, cut + step));
            }}
            style={{ left: `${((cut - 1) / span) * 100}%` }}
            className="absolute -top-1 h-11 w-3 -translate-x-1/2 cursor-ew-resize touch-none rounded-full border border-[var(--card-border)] bg-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          />
        ))}
        <div
          aria-hidden
          className="relative mt-1 h-4 text-xs text-[var(--muted)]"
        >
          {stars.map((star) => (
            <span
              key={star}
              style={{
                left:
                  star === 1
                    ? "0%"
                    : star === 5
                      ? "100%"
                      : `${((star - 1 + step / 2) / span) * 100}%`,
              }}
              className={`absolute ${
                star === 1
                  ? ""
                  : star === 5
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              }`}
            >
              {star}★
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {legend.labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              aria-hidden
              style={{ background: tintFor(i, legend.labels.length) }}
              className="h-4 w-4 shrink-0 rounded"
            />
            {i === 0 ? (
              <span className="w-24 shrink-0 text-xs text-[var(--muted)]">
                {ranges[i]
                  ? formatSegment({ ...ranges[i], label }, mode)
                  : "no values"}
              </span>
            ) : (
              <span className="flex w-24 shrink-0 items-center gap-1 text-xs text-[var(--muted)]">
                <select
                  value={legend.cuts[i - 1]}
                  aria-label={`Start of segment ${i + 1}`}
                  onChange={(event) =>
                    update(moveCut(legend, i - 1, Number(event.target.value)))
                  }
                  className="bg-transparent border border-[var(--card-border)] rounded px-1 py-0.5 text-xs outline-none focus:border-[var(--accent)]"
                >
                  {!allowedCutsBetween(legend, i - 1, mode).includes(
                    legend.cuts[i - 1],
                  ) && (
                    <option value={legend.cuts[i - 1]}>
                      {formatValue(legend.cuts[i - 1], "decimal")}
                    </option>
                  )}
                  {allowedCutsBetween(legend, i - 1, mode).map((value) => (
                    <option key={value} value={value}>
                      {formatValue(value, mode)}
                    </option>
                  ))}
                </select>
                <span>
                  –{ranges[i] ? formatValue(ranges[i].max, mode) : "…"}
                </span>
              </span>
            )}
            <input
              value={label}
              onChange={(event) =>
                update({
                  ...legend,
                  labels: legend.labels.map((current, labelIndex) =>
                    labelIndex === i ? event.target.value : current,
                  ),
                })
              }
              placeholder="what this range means"
              aria-label={`Description for segment ${i + 1}`}
              className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={() => {
                const next = splitSegment(legend, i, mode);
                if (next) update(next);
              }}
              disabled={splitSegment(legend, i, mode) === null}
              aria-label={`Split segment ${i + 1}`}
              className="shrink-0 cursor-pointer rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-40"
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => update(removeCut(legend, i - 1))}
              disabled={i === 0}
              aria-label={`Merge segment ${i + 1} into the previous one`}
              className="shrink-0 cursor-pointer rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-default disabled:opacity-40"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isUnchanged || saving}
          className="rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => update(null)}
          className="cursor-pointer rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Remove legend
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--accent)]">{error}</p>}
      <p className="mt-2 text-xs text-[var(--muted)]">
        Drag the handles (or use the dropdowns) to move boundaries — every
        rating always falls in exactly one interval. Ranges follow your rating
        mode.
      </p>
    </div>
  );
}
