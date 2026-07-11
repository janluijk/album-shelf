"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DevShelfResetProps = {
  albumCount: number;
};

export default function DevShelfReset({ albumCount }: DevShelfResetProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function reset() {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/dev/reset-shelf", { method: "POST" });
    setBusy(false);
    if (!response.ok) {
      setMessage("Reset failed");
      return;
    }
    const { deleted } = await response.json();
    setMessage(`Deleted ${deleted} album${deleted === 1 ? "" : "s"}`);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        Your shelf currently holds{" "}
        <span className="font-medium">{albumCount}</span> album
        {albumCount === 1 ? "" : "s"} (queue and history combined).
      </p>
      <button
        type="button"
        onClick={reset}
        disabled={busy || albumCount === 0}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Resetting…" : "Delete all my albums"}
      </button>
      {message && <p className="text-xs text-[var(--muted)]">{message}</p>}
    </div>
  );
}
