"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  chunk,
  dedupeRows,
  findDuplicates,
  maxImportBatchSize,
  parseRymCsv,
  type RymRow,
  type RymRowError,
  type ShelfEntry,
} from "@/lib/rymImport";

type RymImportFormProps = {
  initialShelf: ShelfEntry[];
};

type Prepared = {
  fileName: string;
  rows: RymRow[];
  parseErrors: RymRowError[];
  duplicates: Map<number, ShelfEntry>;
};

type Progress = {
  done: number;
  total: number;
};

type Summary = {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
  cancelled: boolean;
};

type DuplicateAction = "skip" | "update";

export default function RymImportForm({ initialShelf }: RymImportFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<Prepared | null>(null);
  const [duplicateAction, setDuplicateAction] =
    useState<DuplicateAction>("skip");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [dragging, setDragging] = useState(false);

  async function loadFile(file: File | undefined) {
    if (!file) return;
    setFileError(null);
    setSummary(null);
    setPrepared(null);
    const parsed = parseRymCsv(await file.text());
    if (!parsed.ok) {
      setFileError(parsed.error);
      return;
    }
    const rows = dedupeRows(parsed.rows);
    setPrepared({
      fileName: file.name,
      rows,
      parseErrors: parsed.errors,
      duplicates: findDuplicates(rows, initialShelf),
    });
  }

  async function runImport() {
    if (!prepared || progress) return;
    const skipDuplicates = duplicateAction === "skip";
    const items = prepared.rows
      .filter((row) => !(skipDuplicates && prepared.duplicates.has(row.line)))
      .map((row) => {
        const duplicate = prepared.duplicates.get(row.line);
        return duplicate
          ? { ...row, action: "update" as const, albumId: duplicate.id }
          : { ...row, action: "create" as const };
      });
    const skipped = prepared.rows.length - items.length;

    cancelRef.current = false;
    setProgress({ done: 0, total: items.length });
    const outcome: Summary = {
      created: 0,
      updated: 0,
      skipped,
      errors: prepared.parseErrors.map(
        (error) => `Line ${error.line}: ${error.message}`,
      ),
      cancelled: false,
    };

    for (const batch of chunk(items, maxImportBatchSize)) {
      if (cancelRef.current) {
        outcome.cancelled = true;
        break;
      }
      const response = await fetch("/api/import/rym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: batch }),
      }).catch(() => null);
      if (!response?.ok) {
        batch.forEach((item) =>
          outcome.errors.push(`${item.artist} — ${item.title}: request failed`),
        );
      } else {
        const { results } = await response.json();
        batch.forEach((item, index) => {
          const result = results?.[index];
          if (result?.status === "created") outcome.created += 1;
          else if (result?.status === "updated") outcome.updated += 1;
          else {
            outcome.errors.push(
              `${item.artist} — ${item.title}: ${result?.message ?? "failed"}`,
            );
          }
        });
      }
      setProgress((current) =>
        current ? { ...current, done: current.done + batch.length } : current,
      );
    }

    setProgress(null);
    setPrepared(null);
    setSummary(outcome);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  function reset() {
    setPrepared(null);
    setSummary(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (progress) {
    return (
      <div className="space-y-3">
        <p className="text-sm">
          Importing {progress.done}/{progress.total} albums…
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card-border)]">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{
              width: `${progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%`,
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            cancelRef.current = true;
          }}
          className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm hover:border-[var(--accent)]"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (prepared) {
    const duplicateCount = prepared.duplicates.size;
    return (
      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium">{prepared.fileName}</span>:{" "}
          {prepared.rows.length} album{prepared.rows.length === 1 ? "" : "s"} to
          import
          {prepared.parseErrors.length > 0 &&
            `, ${prepared.parseErrors.length} row${prepared.parseErrors.length === 1 ? "" : "s"} skipped (missing data)`}
        </p>
        {duplicateCount > 0 && (
          <div className="space-y-2">
            <p>
              {duplicateCount} album{duplicateCount === 1 ? " is" : "s are"}{" "}
              already on your shelf:
            </p>
            <ul className="max-h-32 overflow-y-auto text-xs text-[var(--muted)]">
              {[...prepared.duplicates.values()].map((album) => (
                <li key={album.id}>
                  {album.artist} — {album.title}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="rym-duplicates"
                  checked={duplicateAction === "skip"}
                  onChange={() => setDuplicateAction("skip")}
                  className="accent-[var(--accent)]"
                />
                Skip them
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="rym-duplicates"
                  checked={duplicateAction === "update"}
                  onChange={() => setDuplicateAction("update")}
                  className="accent-[var(--accent)]"
                />
                Update their ratings from the import
              </label>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={runImport}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
          >
            Import
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm hover:border-[var(--accent)]"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void loadFile(event.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-6 text-sm text-[var(--muted)] ${dragging ? "border-[var(--accent)]" : "border-[var(--card-border)]"}`}
      >
        <span>Drop your RateYourMusic CSV export here or click to browse</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => void loadFile(event.target.files?.[0])}
          className="hidden"
          aria-label="RateYourMusic CSV export"
        />
      </label>
      {fileError && <p className="text-xs text-[var(--accent)]">{fileError}</p>}
      {summary && (
        <div className="space-y-1 text-sm">
          <p>
            {summary.cancelled ? "Import cancelled: " : "Import finished: "}
            {summary.created} added, {summary.updated} updated,{" "}
            {summary.skipped} skipped
            {summary.errors.length > 0 && `, ${summary.errors.length} failed`}
          </p>
          {summary.errors.length > 0 && (
            <ul className="max-h-32 overflow-y-auto text-xs text-[var(--muted)]">
              {summary.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="text-xs text-[var(--muted)]">
        Imports your rated RYM albums into listening history. Ratings are
        converted from RYM&apos;s 1-10 scale to stars (7/10 becomes 3.5 stars).
      </p>
    </div>
  );
}
