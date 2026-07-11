"use client";

import { useState } from "react";
import { bioMaxLength } from "@/lib/bio";

type BioFormProps = {
  initialBio: string | null;
};

export default function BioForm({ initialBio }: BioFormProps) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [draft, setDraft] = useState(initialBio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmed = draft.trim();
  const isUnchanged = trimmed === bio;
  const isTooLong = trimmed.length > bioMaxLength;

  async function save() {
    if (isUnchanged || isTooLong || saving) return;
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: draft }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save bio");
      return;
    }
    const updated: { bio: string | null } = await response.json();
    setBio(updated.bio ?? "");
    setDraft(updated.bio ?? "");
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setError(null);
        }}
        rows={3}
        placeholder="Tell visitors about your taste in music…"
        aria-label="Bio"
        className="w-full resize-y bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
      />
      <div className="mt-2 flex items-center justify-between gap-4">
        <p
          className={`text-xs ${
            isTooLong ? "text-[var(--accent)]" : "text-[var(--muted)]"
          }`}
        >
          {trimmed.length}/{bioMaxLength} characters
        </p>
        <button
          type="button"
          onClick={save}
          disabled={isUnchanged || isTooLong || saving}
          className="shrink-0 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
