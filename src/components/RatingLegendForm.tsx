"use client";

import { useState } from "react";
import {
  isValidLegend,
  legendLabelMaxLength,
  legendMaxIntervals,
  type LegendInterval,
} from "@/lib/ratingLegend";

type LegendRow = {
  min: string;
  max: string;
  label: string;
};

type RatingLegendFormProps = {
  initialLegend: LegendInterval[];
};

function toRows(legend: LegendInterval[]): LegendRow[] {
  return legend.map((entry) => ({
    min: String(entry.min),
    max: String(entry.max),
    label: entry.label,
  }));
}

function toLegend(rows: LegendRow[]): LegendInterval[] {
  return rows.map((row) => ({
    min: Number(row.min),
    max: Number(row.max),
    label: row.label,
  }));
}

export default function RatingLegendForm({
  initialLegend,
}: RatingLegendFormProps) {
  const [rows, setRows] = useState<LegendRow[]>(toRows(initialLegend));
  const [saved, setSaved] = useState<LegendInterval[]>(initialLegend);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const candidate = toLegend(rows);
  const isUnchanged = JSON.stringify(candidate) === JSON.stringify(saved);

  function updateRow(index: number, patch: Partial<LegendRow>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
    setError(null);
  }

  function addRow() {
    setRows((current) => [...current, { min: "", max: "", label: "" }]);
    setError(null);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, i) => i !== index));
    setError(null);
  }

  async function save() {
    if (isUnchanged || saving) return;
    if (!isValidLegend(candidate)) {
      setError(
        "Use non-overlapping intervals between 1 and 5 (one decimal at most) with a short description each.",
      );
      return;
    }
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratingLegend: candidate }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save rating legend");
      return;
    }
    const updated: { ratingLegend: LegendInterval[] | null } =
      await response.json();
    const next = updated.ratingLegend ?? [];
    setSaved(next);
    setRows(toRows(next));
  }

  return (
    <div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={row.min}
              onChange={(event) => updateRow(index, { min: event.target.value })}
              inputMode="decimal"
              placeholder="1"
              aria-label={`Interval ${index + 1} from`}
              className="w-14 bg-transparent border border-[var(--card-border)] rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-[var(--accent)]"
            />
            <span className="text-xs text-[var(--muted)]">–</span>
            <input
              value={row.max}
              onChange={(event) => updateRow(index, { max: event.target.value })}
              inputMode="decimal"
              placeholder="1.5"
              aria-label={`Interval ${index + 1} to`}
              className="w-14 bg-transparent border border-[var(--card-border)] rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-[var(--accent)]"
            />
            <input
              value={row.label}
              onChange={(event) =>
                updateRow(index, { label: event.target.value })
              }
              maxLength={legendLabelMaxLength}
              placeholder="did not finish"
              aria-label={`Interval ${index + 1} description`}
              className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              aria-label={`Remove interval ${index + 1}`}
              className="shrink-0 cursor-pointer rounded-lg border border-[var(--card-border)] px-3 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={addRow}
          disabled={rows.length >= legendMaxIntervals}
          className="cursor-pointer rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-60"
        >
          Add interval
        </button>
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
      <p className="mt-2 text-xs text-[var(--muted)]">
        Describe what your ratings mean, e.g. 1–1.5: did not finish. Shown on
        your public shelf as a legend.
      </p>
    </div>
  );
}
