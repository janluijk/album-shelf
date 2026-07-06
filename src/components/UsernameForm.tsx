"use client";

import { useState } from "react";
import { isValidUsername, usernameRules } from "@/lib/usernames";

type UsernameFormProps = {
  initialUsername: string | null;
};

export default function UsernameForm({ initialUsername }: UsernameFormProps) {
  const [username, setUsername] = useState(initialUsername ?? "");
  const [draft, setDraft] = useState(initialUsername ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const trimmed = draft.trim();
  const isUnchanged = trimmed === username;

  async function save() {
    if (isUnchanged || saving) return;
    if (!isValidUsername(trimmed)) {
      setError(`Invalid username. Use ${usernameRules}`);
      return;
    }
    setSaving(true);
    setError(null);
    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: trimmed }),
    });
    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not save username");
      return;
    }
    const updated: { username: string } = await response.json();
    setUsername(updated.username);
    setDraft(updated.username);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          placeholder="username"
          aria-label="Username"
          className="flex-1 min-w-0 bg-transparent border border-[var(--card-border)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={save}
          disabled={isUnchanged || saving}
          className="shrink-0 rounded-lg bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-[var(--accent)]">{error}</p>}
      <p className="mt-2 text-xs text-[var(--muted)]">
        Your public shelf lives at /u/{username || "…"}. Changing your username
        changes that link. {usernameRules}
      </p>
    </div>
  );
}
