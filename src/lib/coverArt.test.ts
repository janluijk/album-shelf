import { describe, expect, it } from "vitest";
import {
  buildSearchUrl,
  coverArtUrl,
  escapeLucene,
  parseReleaseYear,
  pickConfidentReleaseGroups,
} from "./coverArt";

describe("escapeLucene", () => {
  it("escapes quotes and backslashes", () => {
    expect(escapeLucene('The "Best" Of')).toBe('The \\"Best\\" Of');
    expect(escapeLucene("AC\\DC")).toBe("AC\\\\DC");
  });

  it("leaves plain text untouched", () => {
    expect(escapeLucene("OK Computer")).toBe("OK Computer");
  });
});

describe("buildSearchUrl", () => {
  it("targets the MusicBrainz release-group endpoint with a scoped query", () => {
    const url = new URL(buildSearchUrl("OK Computer", "Radiohead"));
    expect(url.origin + url.pathname).toBe(
      "https://musicbrainz.org/ws/2/release-group/",
    );
    expect(url.searchParams.get("query")).toBe(
      'releasegroup:"OK Computer" AND artist:"Radiohead"',
    );
    expect(url.searchParams.get("fmt")).toBe("json");
    expect(url.searchParams.get("limit")).toBe("5");
  });
});

describe("pickConfidentReleaseGroups", () => {
  it("returns confident matches in order", () => {
    const response = {
      "release-groups": [
        { id: "abc-123", score: 100 },
        { id: "def-456", score: 94 },
      ],
    };
    expect(pickConfidentReleaseGroups(response).map((g) => g.id)).toEqual([
      "abc-123",
      "def-456",
    ]);
  });

  it("filters out low-confidence matches", () => {
    const response = {
      "release-groups": [
        { id: "abc-123", score: 100 },
        { id: "def-456", score: 60 },
      ],
    };
    expect(pickConfidentReleaseGroups(response).map((g) => g.id)).toEqual([
      "abc-123",
    ]);
  });

  it("handles empty and missing result lists", () => {
    expect(pickConfidentReleaseGroups({ "release-groups": [] })).toEqual([]);
    expect(pickConfidentReleaseGroups({})).toEqual([]);
  });
});

describe("parseReleaseYear", () => {
  it("parses the year from a full date", () => {
    expect(parseReleaseYear("1997-06-16")).toBe(1997);
  });

  it("parses a year-only date", () => {
    expect(parseReleaseYear("1966")).toBe(1966);
  });

  it("rejects missing and malformed dates", () => {
    expect(parseReleaseYear(undefined)).toBe(null);
    expect(parseReleaseYear("")).toBe(null);
    expect(parseReleaseYear("????")).toBe(null);
    expect(parseReleaseYear("12")).toBe(null);
  });
});

describe("coverArtUrl", () => {
  it("builds the Cover Art Archive front thumbnail url", () => {
    expect(coverArtUrl("abc-123")).toBe(
      "https://coverartarchive.org/release-group/abc-123/front-250",
    );
  });
});
