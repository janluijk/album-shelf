"use client";

import { useState } from "react";
import {
  legendEntries,
  legendLabelMaxLength,
  legendStarCount,
  type RatingLegend,
} from "@/lib/ratingLegend";
import StarRating from "@/components/StarRating";
import { useNotify } from "@/components/ToastProvider";

type RatingLegendFormProps = {
  initialLegend: RatingLegend | null;
};

const emptyLegend = Array.from({ length: legendStarCount }, () => "");

export default function RatingLegendForm({
  initialLegend,
}: RatingLegendFormProps) {
  const [labels, setLabels] = useState<RatingLegend>(
    initialLegend ?? emptyLegend,
  );
  const [saved, setSaved] = useState<RatingLegend>(
    initialLegend ?? emptyLegend,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const notify = useNotify();

  const trimmed = labels.map((label) => label.trim());
  const isUnchanged =
    JSON.stringify(trimmed) === JSON.stringify(saved.map((l) => l.trim()));
  const isEmpty = legendEntries(trimmed).length === 0;

  function updateLabel(index: number, value: string) {
    setLabels((current) =>
      current.map((label, i) => (i === index ? value : label)),
    );
    setError(null);
  }

  async function save() {
    if (isUnchanged || saving) return;
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratingLegend: isEmpty ? null : trimmed }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save rating legend");
      return;
    }
    const updated: { ratingLegend: RatingLegend | null } =
      await response.json();
    const next = updated.ratingLegend ?? emptyLegend;
    setLabels(next);
    setSaved(next);
    notify({
      title: "Rating legend saved",
      message: isEmpty
        ? "Your legend was removed."
        : "Your legend is now shown on your public shelf.",
      variant: "success",
    });
  }

  return (
    <div>
      <div className="space-y-2">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center gap-3">
            <StarRating value={index + 1} />
            <input
              value={label}
              onChange={(event) => updateLabel(index, event.target.value)}
              maxLength={legendLabelMaxLength}
              placeholder={`what ${index + 1} star${index === 0 ? "" : "s"} means`}
              aria-label={`Description for ${index + 1} star${index === 0 ? "" : "s"}`}
              className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
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
      </div>
      {error && <p className="mt-2 text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
