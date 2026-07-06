import { describe, expect, it } from "vitest";
import {
  buildSearchUrl,
  coverArtUrl,
  escapeLucene,
  pickReleaseGroupId,
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
    expect(url.searchParams.get("limit")).toBe("1");
  });
});

describe("pickReleaseGroupId", () => {
  it("returns the id of a confident match", () => {
    const response = {
      "release-groups": [{ id: "abc-123", score: 100 }],
    };
    expect(pickReleaseGroupId(response)).toBe("abc-123");
  });

  it("rejects low-confidence matches", () => {
    const response = {
      "release-groups": [{ id: "abc-123", score: 60 }],
    };
    expect(pickReleaseGroupId(response)).toBeNull();
  });

  it("handles empty and missing result lists", () => {
    expect(pickReleaseGroupId({ "release-groups": [] })).toBeNull();
    expect(pickReleaseGroupId({})).toBeNull();
  });
});

describe("coverArtUrl", () => {
  it("builds the Cover Art Archive front thumbnail url", () => {
    expect(coverArtUrl("abc-123")).toBe(
      "https://coverartarchive.org/release-group/abc-123/front-250",
    );
  });
});
