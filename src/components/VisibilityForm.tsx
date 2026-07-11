"use client";

import { useState } from "react";

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
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="radio"
          name="shelf-visibility"
          checked={isPublic}
          onChange={() => choose(true)}
          className="accent-[var(--accent)]"
        />
        Public
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="radio"
          name="shelf-visibility"
          checked={!isPublic}
          onChange={() => choose(false)}
          className="accent-[var(--accent)]"
        />
        Private
      </label>
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
