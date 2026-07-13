import { describe, expect, it } from "vitest";
import {
  buildAlbumSearchUrl,
  isSearchableQuery,
  joinArtistCredit,
  maxSearchResults,
  parseAlbumSearchResults,
  rankAlbumSearchResults,
  sanitizeSearchQuery,
} from "./albumSearch";

describe("sanitizeSearchQuery", () => {
  it("strips lucene operators and collapses whitespace", () => {
    expect(sanitizeSearchQuery('AC/DC: "Back in Black"!')).toBe(
      "AC DC Back in Black",
    );
  });
});

describe("isSearchableQuery", () => {
  it("accepts combined title and artist length at the minimum", () => {
    expect(isSearchableQuery({ title: "o", artist: "k" })).toBe(true);
  });

  it("rejects queries below the minimum length", () => {
    expect(isSearchableQuery({ title: " o ", artist: "  " })).toBe(false);
  });
});

describe("buildAlbumSearchUrl", () => {
  it("targets the release-group search endpoint filtered to albums", () => {
    const url = new URL(
      buildAlbumSearchUrl({ title: "ok computer", artist: "" }),
    );
    expect(url.pathname).toBe("/ws/2/release-group/");
    expect(url.searchParams.get("query")).toBe(
      "(ok computer) AND primarytype:album",
    );
    expect(url.searchParams.get("fmt")).toBe("json");
  });

  it("trims the query", () => {
    const url = new URL(buildAlbumSearchUrl({ title: "  low  ", artist: "" }));
    expect(url.searchParams.get("query")).toBe("(low) AND primarytype:album");
  });

  it("combines fielded title and artist terms when both are given", () => {
    const url = new URL(
      buildAlbumSearchUrl({ title: "low", artist: "david bowie" }),
    );
    expect(url.searchParams.get("query")).toBe(
      "(releasegroup:(low) AND artist:(david bowie)) AND primarytype:album",
    );
  });

  it("searches by artist alone when the title is empty", () => {
    const url = new URL(buildAlbumSearchUrl({ title: "", artist: "bowie" }));
    expect(url.searchParams.get("query")).toBe(
      "artist:(bowie) AND primarytype:album",
    );
  });
});

describe("joinArtistCredit", () => {
  it("joins multiple artists with their join phrases", () => {
    expect(
      joinArtistCredit([
        { name: "David Bowie", joinphrase: " & " },
        { name: "Brian Eno" },
      ]),
    ).toBe("David Bowie & Brian Eno");
  });

  it("returns empty for missing credit", () => {
    expect(joinArtistCredit(undefined)).toBe("");
  });
});

describe("parseAlbumSearchResults", () => {
  const group = (id: string, title: string, artist: string, date?: string) => ({
    id,
    title,
    "first-release-date": date,
    "artist-credit": [{ name: artist }],
  });

  it("maps groups to results with year and cover url", () => {
    const results = parseAlbumSearchResults({
      "release-groups": [group("abc", "Low", "David Bowie", "1977-01-14")],
    });
    expect(results).toEqual([
      {
        id: "abc",
        title: "Low",
        artist: "David Bowie",
        releaseYear: 1977,
        coverUrl: "https://coverartarchive.org/release-group/abc/front-250",
      },
    ]);
  });

  it("dedupes identical title and artist pairs", () => {
    const results = parseAlbumSearchResults({
      "release-groups": [
        group("a", "Low", "David Bowie"),
        group("b", "low", "DAVID BOWIE"),
      ],
    });
    expect(results).toHaveLength(1);
  });

  it("skips groups without title or artist and caps the count", () => {
    const many = Array.from({ length: 30 }, (_, index) =>
      group(`id${index}`, `Album ${index}`, "Artist"),
    );
    const results = parseAlbumSearchResults({
      "release-groups": [{ id: "x", title: "No artist" }, ...many],
    });
    expect(results).toHaveLength(maxSearchResults);
    expect(results[0].title).toBe("Album 0");
  });

  it("handles an empty response", () => {
    expect(parseAlbumSearchResults({})).toEqual([]);
  });
});

describe("rankAlbumSearchResults", () => {
  const result = (id: string, title: string, artist: string) => ({
    id,
    title,
    artist,
    releaseYear: null,
    coverUrl: "",
  });

  it("puts exact artist and title matches first", () => {
    const ranked = rankAlbumSearchResults(
      [
        result("a", "Low Roar", "Someone Else"),
        result("b", "Low", "David Bowie"),
      ],
      { title: "low", artist: "david bowie" },
    );
    expect(ranked.map((entry) => entry.id)).toEqual(["b", "a"]);
  });

  it("scores prefix matches above non-matches", () => {
    const ranked = rankAlbumSearchResults(
      [
        result("a", "Something", "The Band"),
        result("b", "Low Roar", "The Band"),
      ],
      { title: "low", artist: "" },
    );
    expect(ranked.map((entry) => entry.id)).toEqual(["b", "a"]);
  });

  it("keeps the original order for equal scores", () => {
    const ranked = rankAlbumSearchResults(
      [result("a", "One", "X"), result("b", "Two", "Y")],
      { title: "", artist: "" },
    );
    expect(ranked.map((entry) => entry.id)).toEqual(["a", "b"]);
  });
});
