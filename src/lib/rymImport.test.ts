import { describe, expect, it } from "vitest";
import {
  chunk,
  convertRymRating,
  dedupeRows,
  findDuplicates,
  mergeArtistName,
  parseCsv,
  parseRymCsv,
  parseRymReleaseYear,
  type RymRow,
} from "./rymImport";

const header =
  "RYM Album,First Name,Last Name,First Name localized,Last Name localized,Title,Release_Date,Rating,Ownership,Purchase Date,Media Type";

function csv(...rows: string[]): string {
  return [header, ...rows].join("\n");
}

describe("parseCsv", () => {
  it("splits fields on commas and rows on newlines", () => {
    expect(parseCsv("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("keeps commas and newlines inside quoted fields", () => {
    expect(parseCsv('"a,b","c\nd",e')).toEqual([["a,b", "c\nd", "e"]]);
  });

  it("unescapes doubled quotes", () => {
    expect(parseCsv('"say ""hi""",x')).toEqual([['say "hi"', "x"]]);
  });

  it("handles CRLF line endings and skips blank lines", () => {
    expect(parseCsv("a,b\r\n\r\nc,d\r\n")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });
});

describe("mergeArtistName", () => {
  it("joins first and last name", () => {
    expect(mergeArtistName("David", "Bowie", "", "")).toBe("David Bowie");
  });

  it("uses a single part when the other is empty", () => {
    expect(mergeArtistName("", "Radiohead", "", "")).toBe("Radiohead");
  });

  it("falls back to localized names", () => {
    expect(mergeArtistName("", "", "фиолетовый", "туман")).toBe(
      "фиолетовый туман",
    );
  });
});

describe("convertRymRating", () => {
  it("halves the 1-10 scale to stars", () => {
    expect(convertRymRating("10")).toBe(5);
    expect(convertRymRating("7")).toBe(3.5);
    expect(convertRymRating("2")).toBe(1);
  });

  it("clamps a 1/10 rating to the 1-star minimum", () => {
    expect(convertRymRating("1")).toBe(1);
  });

  it("treats zero, blanks and junk as unrated", () => {
    expect(convertRymRating("0")).toBeNull();
    expect(convertRymRating("")).toBeNull();
    expect(convertRymRating("11")).toBeNull();
    expect(convertRymRating("great")).toBeNull();
  });
});

describe("parseRymReleaseYear", () => {
  it("extracts the year from RYM date formats", () => {
    expect(parseRymReleaseYear("1977")).toBe(1977);
    expect(parseRymReleaseYear("5/12/2001")).toBe(2001);
  });

  it("returns null when no year is present", () => {
    expect(parseRymReleaseYear("")).toBeNull();
    expect(parseRymReleaseYear("unknown")).toBeNull();
  });
});

describe("parseRymCsv", () => {
  it("parses rows into title, artist, rating and year", () => {
    const result = parseRymCsv(
      csv("1,David,Bowie,,,Low,1977,9,,,"),
    );
    expect(result).toEqual({
      ok: true,
      rows: [
        {
          line: 2,
          title: "Low",
          artist: "David Bowie",
          rating: 4.5,
          releaseYear: 1977,
        },
      ],
      errors: [],
    });
  });

  it("rejects files missing RYM columns", () => {
    const result = parseRymCsv("Album,Artist\nLow,Bowie");
    expect(result.ok).toBe(false);
  });

  it("rejects empty files", () => {
    expect(parseRymCsv("").ok).toBe(false);
    expect(parseRymCsv(header).ok).toBe(false);
  });

  it("collects per-row errors for rows missing title or artist", () => {
    const result = parseRymCsv(
      csv("1,David,Bowie,,,Low,1977,9,,,", "2,,,,,Nameless,1990,5,,,"),
    );
    if (!result.ok) throw new Error("expected ok");
    expect(result.rows).toHaveLength(1);
    expect(result.errors).toEqual([{ line: 3, message: "Missing artist" }]);
  });
});

const shelf = [
  { id: 1, title: "Low", artist: "David Bowie" },
  { id: 2, title: "OK Computer", artist: "Radiohead" },
];

function row(title: string, artist: string, line = 2): RymRow {
  return { line, title, artist, rating: null, releaseYear: null };
}

describe("findDuplicates", () => {
  it("matches case-insensitively on title and artist", () => {
    const duplicates = findDuplicates([row("low", "DAVID BOWIE")], shelf);
    expect(duplicates.get(2)).toEqual(shelf[0]);
  });

  it("does not match different albums", () => {
    expect(findDuplicates([row("Heroes", "David Bowie")], shelf).size).toBe(0);
  });
});

describe("dedupeRows", () => {
  it("drops repeated albums within the import", () => {
    const rows = [row("Low", "David Bowie", 2), row("low", "David Bowie", 3)];
    expect(dedupeRows(rows)).toHaveLength(1);
  });
});

describe("chunk", () => {
  it("splits items into fixed-size batches", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns no batches for no items", () => {
    expect(chunk([], 3)).toEqual([]);
  });
});
