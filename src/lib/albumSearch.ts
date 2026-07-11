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

export function buildAlbumSearchUrl(query: string): string {
  const params = new URLSearchParams({
    query: query.trim(),
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
