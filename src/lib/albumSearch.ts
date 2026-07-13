import { coverArtUrl, parseReleaseYear } from "@/lib/coverArt";

export const minSearchLength = 2;
export const maxSearchResults = 8;

export type AlbumSearchResult = {
  id: string;
  title: string;
  artist: string;
  releaseYear: number | null;
  coverUrl: string;
};

type ArtistCredit = {
  name?: string;
  joinphrase?: string;
};

type SearchGroup = {
  id: string;
  title?: string;
  score?: number;
  "first-release-date"?: string;
  "artist-credit"?: ArtistCredit[];
};

export type AlbumSearchResponse = {
  "release-groups"?: SearchGroup[];
};

export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[+\-!(){}[\]^"~*?:\\/&|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type AlbumSearchQuery = {
  title: string;
  artist: string;
};

export function isSearchableQuery(query: AlbumSearchQuery): boolean {
  return (query.title.trim() + query.artist.trim()).length >= minSearchLength;
}

export function buildAlbumSearchUrl(query: AlbumSearchQuery): string {
  const title = sanitizeSearchQuery(query.title);
  const artist = sanitizeSearchQuery(query.artist);
  const hasBoth = title.length > 0 && artist.length > 0;
  const term = hasBoth
    ? `(releasegroup:(${title}) AND artist:(${artist}))`
    : artist.length > 0
      ? `artist:(${artist})`
      : `(${title})`;
  const params = new URLSearchParams({
    query: `${term} AND primarytype:album`,
    fmt: "json",
    limit: String(maxSearchResults * 2),
  });
  return `https://musicbrainz.org/ws/2/release-group/?${params.toString()}`;
}

export function joinArtistCredit(credit: ArtistCredit[] | undefined): string {
  if (!credit) return "";
  return credit
    .map((part) => `${part.name ?? ""}${part.joinphrase ?? ""}`)
    .join("")
    .trim();
}

export function parseAlbumSearchResults(
  response: AlbumSearchResponse,
): AlbumSearchResult[] {
  const seen = new Set<string>();
  const results: AlbumSearchResult[] = [];
  for (const group of response["release-groups"] ?? []) {
    const title = group.title?.trim() ?? "";
    const artist = joinArtistCredit(group["artist-credit"]);
    if (!title || !artist) continue;
    const key = `${title.toLowerCase()}::${artist.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      id: group.id,
      title,
      artist,
      releaseYear: parseReleaseYear(group["first-release-date"]),
      coverUrl: coverArtUrl(group.id),
    });
    if (results.length === maxSearchResults) break;
  }
  return results;
}

function fieldMatchScore(value: string, term: string): number {
  if (!term) return 0;
  const normalized = value.toLowerCase();
  if (normalized === term) return 2;
  if (normalized.startsWith(term)) return 1;
  return 0;
}

export function rankAlbumSearchResults(
  results: AlbumSearchResult[],
  query: AlbumSearchQuery,
): AlbumSearchResult[] {
  const title = query.title.trim().toLowerCase();
  const artist = query.artist.trim().toLowerCase();
  return results
    .map((result, index) => ({
      result,
      index,
      score:
        fieldMatchScore(result.title, title) +
        fieldMatchScore(result.artist, artist),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.result);
}
