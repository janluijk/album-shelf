"use client";

import { useState } from "react";
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
    if (!response.ok) setMode(previous);
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
    </div>
  );
}
