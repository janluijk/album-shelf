export type RymRow = {
  line: number;
  title: string;
  artist: string;
  rating: number | null;
  releaseYear: number | null;
  listenedOn: string | null;
};

export type RymRowError = {
  line: number;
  message: string;
};

export type RymParseResult =
  | { ok: true; rows: RymRow[]; errors: RymRowError[] }
  | { ok: false; error: string };

const requiredColumns = ["Title", "Rating", "Last Name"];

export function parseCsv(text: string): string[][] {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let inQuotes = false;
  let index = 0;

  const pushField = () => {
    record.push(field);
    field = "";
  };
  const pushRecord = () => {
    pushField();
    records.push(record);
    record = [];
  };

  while (index < text.length) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 2;
        continue;
      }
      if (char === '"') {
        inQuotes = false;
        index += 1;
        continue;
      }
      field += char;
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      index += 1;
      continue;
    }
    if (char === ",") {
      pushField();
      index += 1;
      continue;
    }
    if (char === "\r" && text[index + 1] === "\n") {
      pushRecord();
      index += 2;
      continue;
    }
    if (char === "\n" || char === "\r") {
      pushRecord();
      index += 1;
      continue;
    }
    field += char;
    index += 1;
  }
  const hasTrailingContent = field.length > 0 || record.length > 0;
  if (hasTrailingContent) pushRecord();

  return records.filter(
    (row) => !(row.length === 1 && row[0].trim() === ""),
  );
}

export function mergeArtistName(
  firstName: string,
  lastName: string,
  firstNameLocalized: string,
  lastNameLocalized: string,
): string {
  const plain = [firstName, lastName].map((part) => part.trim()).filter(Boolean);
  if (plain.length > 0) return plain.join(" ");
  return [firstNameLocalized, lastNameLocalized]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

export function convertRymRating(value: string): number | null {
  const rating = Number(value.trim());
  const isRated = Number.isFinite(rating) && rating >= 1 && rating <= 10;
  if (!isRated) return null;
  const stars = Math.round(rating) / 2;
  return stars < 2 ? 1 : stars;
}

export function parseRymDate(value: string): string | null {
  const match = value
    .trim()
    .match(/^([12][0-9]{3})[-/]([0-9]{1,2})[-/]([0-9]{1,2})$/);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`);
  const isReal =
    !Number.isNaN(date.getTime()) &&
    date.getUTCMonth() + 1 === Number(month) &&
    date.getUTCDate() === Number(day);
  if (!isReal) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function parseRymReleaseYear(value: string): number | null {
  const match = value.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
  return match ? Number(match[1]) : null;
}

export function parseRymCsv(text: string): RymParseResult {
  const records = parseCsv(text);
  if (records.length === 0) return { ok: false, error: "The file is empty" };

  const header = records[0].map((column) => column.trim());
  const missing = requiredColumns.filter(
    (column) => !header.includes(column),
  );
  if (missing.length > 0) {
    return {
      ok: false,
      error: `This does not look like a RateYourMusic export — missing column${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`,
    };
  }

  const column = (row: string[], name: string): string => {
    const position = header.indexOf(name);
    return position === -1 ? "" : (row[position] ?? "");
  };

  const rows: RymRow[] = [];
  const errors: RymRowError[] = [];
  records.slice(1).forEach((record, offset) => {
    const line = offset + 2;
    const title = column(record, "Title").trim();
    const artist = mergeArtistName(
      column(record, "First Name"),
      column(record, "Last Name"),
      column(record, "First Name localized"),
      column(record, "Last Name localized"),
    );
    if (!title || !artist) {
      const missingField = !title ? "title" : "artist";
      errors.push({ line, message: `Missing ${missingField}` });
      return;
    }
    rows.push({
      line,
      title,
      artist,
      rating: convertRymRating(column(record, "Rating")),
      releaseYear: parseRymReleaseYear(column(record, "Release_Date")),
      listenedOn: parseRymDate(column(record, "Purchase Date")),
    });
  });

  const hasNothingToImport = rows.length === 0;
  if (hasNothingToImport) {
    return { ok: false, error: "No importable rows found in the file" };
  }
  return { ok: true, rows, errors };
}

export type ShelfEntry = {
  id: number;
  title: string;
  artist: string;
};

function albumKey(title: string, artist: string): string {
  return `${title.trim().toLowerCase()}::${artist.trim().toLowerCase()}`;
}

export function findDuplicates<T extends ShelfEntry>(
  rows: RymRow[],
  shelf: T[],
): Map<number, T> {
  const byKey = new Map(
    shelf.map((album) => [albumKey(album.title, album.artist), album]),
  );
  const duplicates = new Map<number, T>();
  for (const row of rows) {
    const match = byKey.get(albumKey(row.title, row.artist));
    if (match) duplicates.set(row.line, match);
  }
  return duplicates;
}

export function dedupeRows(rows: RymRow[]): RymRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = albumKey(row.title, row.artist);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const maxImportBatchSize = 5;

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    chunks.push(items.slice(start, start + size));
  }
  return chunks;
}
