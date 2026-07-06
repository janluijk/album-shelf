"use client";

import { useEffect, useRef, useState } from "react";
import {
  GRANULARITY_LABELS,
  RATING_GRANULARITIES,
  type RatingGranularity,
} from "@/lib/ratings";

type RatingModeFormProps = {
  initialMode: RatingGranularity;
};

export default function RatingModeForm({ initialMode }: RatingModeFormProps) {
  const [mode, setMode] = useState<RatingGranularity>(initialMode);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    };
  }, []);

  async function choose(next: RatingGranularity) {
    if (next === mode || saving) return;
    const previous = mode;
    setMode(next);
    setSaving(true);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratingGranularity: next }),
    });
    setSaving(false);
    if (!response.ok) {
      setMode(previous);
      return;
    }
    setNotice(true);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(false), 6000);
  }

  return (
    <div className="space-y-2">
      {RATING_GRANULARITIES.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-2 text-sm"
        >
          <input
            type="radio"
            name="rating-mode"
            checked={mode === option}
            onChange={() => choose(option)}
            className="accent-[var(--accent)]"
          />
          {GRANULARITY_LABELS[option]}
        </label>
      ))}
      <p className="text-xs text-[var(--muted)]">
        How you rate albums: whole stars, half stars, or type a decimal from 1.0
        to 5.0 (the input appears when you hover the stars).
      </p>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-4 right-4 z-50 max-w-xs rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 text-xs text-[var(--muted)] shadow-lg transition-all duration-300 ${
          notice
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <p className="mb-1 font-medium text-[var(--foreground)]">
          Ratings are kept exactly
        </p>
        Switching the mode only changes how ratings look — whole stars round
        down, half stars round to the nearest ½, and decimal restores the exact
        value. Nothing you&apos;ve rated is lost.
      </div>
    </div>
  );
}
