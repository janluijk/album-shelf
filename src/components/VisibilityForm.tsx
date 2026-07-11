"use client";

import { useState } from "react";

const OPTIONS = [
  { value: true, label: "Public", description: "Anyone can view your shelf" },
  { value: false, label: "Private", description: "Only you can view it" },
];

type VisibilityFormProps = {
  initialPublic: boolean;
};

export default function VisibilityForm({ initialPublic }: VisibilityFormProps) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function choose(next: boolean) {
    if (next === isPublic || saving) return;
    const previous = isPublic;
    setIsPublic(next);
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shelfPublic: next }),
    });
    setSaving(false);
    if (!response.ok) {
      setIsPublic(previous);
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save visibility");
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label="Shelf visibility"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {OPTIONS.map((option) => {
          const selected = isPublic === option.value;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(option.value)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)]/10"
                  : "border-[var(--card-border)] hover:border-[var(--muted)]"
              }`}
            >
              <span className="block text-sm font-medium">{option.label}</span>
              <span
                className={`mt-1 block text-xs ${selected ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
              >
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
