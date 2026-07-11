"use client";

import { useState } from "react";
import {
  GRANULARITY_LABELS,
  RATING_GRANULARITIES,
  type RatingGranularity,
} from "@/lib/ratings";
import { useNotify } from "@/components/ToastProvider";

const GRANULARITY_EXAMPLES: Record<RatingGranularity, string> = {
  integer: "★★★★",
  half: "★★★★½",
  decimal: "4.3",
};

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
      <div
        role="radiogroup"
        aria-label="Rating mode"
        className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      >
        {RATING_GRANULARITIES.map((option) => {
          const selected = mode === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(option)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--card-border)] hover:border-[var(--muted)]"
              }`}
            >
              <span className="block text-sm font-medium">
                {GRANULARITY_LABELS[option]}
              </span>
              <span
                className={`mt-1 block text-xs ${selected ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
              >
                {GRANULARITY_EXAMPLES[option]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--muted)]">
        How you rate albums: whole stars, half stars, or decimal form.
      </p>
    </div>
  );
}
