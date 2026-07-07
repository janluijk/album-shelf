"use client";

import { useState } from "react";
import {
  GRANULARITY_LABELS,
  RATING_GRANULARITIES,
  type RatingGranularity,
} from "@/lib/ratings";
import { useNotify } from "@/components/ToastProvider";

type RatingModeFormProps = {
  initialMode: RatingGranularity;
};

export default function RatingModeForm({ initialMode }: RatingModeFormProps) {
  const [mode, setMode] = useState<RatingGranularity>(initialMode);
  const [saving, setSaving] = useState(false);
  const notify = useNotify();

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
      notify({
        title: "Could not save",
        message: "Your rating mode was not changed. Please try again.",
        variant: "error",
      });
      return;
    }
    notify({
      title: "Ratings are kept exactly",
      message:
        "Switching the mode only changes how ratings look — whole stars round down, half stars round to the nearest ½, and decimal restores the exact value. Nothing you've rated is lost.",
    });
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
        How you rate albums: whole stars, half stars, or decimal form.
      </p>
    </div>
  );
}
