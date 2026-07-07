import { describe, expect, it } from "vitest";
import {
  buildSearchUrl,
  coverArtUrl,
  escapeLucene,
  pickReleaseGroupIds,
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

describe("pickReleaseGroupIds", () => {
  it("returns the ids of confident matches in order", () => {
    const response = {
      "release-groups": [
        { id: "abc-123", score: 100 },
        { id: "def-456", score: 94 },
      ],
    };
    expect(pickReleaseGroupIds(response)).toEqual(["abc-123", "def-456"]);
  });

  it("filters out low-confidence matches", () => {
    const response = {
      "release-groups": [
        { id: "abc-123", score: 100 },
        { id: "def-456", score: 60 },
      ],
    };
    expect(pickReleaseGroupIds(response)).toEqual(["abc-123"]);
  });

  it("handles empty and missing result lists", () => {
    expect(pickReleaseGroupIds({ "release-groups": [] })).toEqual([]);
    expect(pickReleaseGroupIds({})).toEqual([]);
  });
});

describe("coverArtUrl", () => {
  it("builds the Cover Art Archive front thumbnail url", () => {
    expect(coverArtUrl("abc-123")).toBe(
      "https://coverartarchive.org/release-group/abc-123/front-250",
    );
  });
});
