const userAgent = "album-shelf/0.1 (https://github.com/janluijk/album-shelf)";
const requestTimeoutMs = 4000;

export function escapeLucene(value: string): string {
  return value.replace(/[\\"]/g, "\\$&");
}

export function buildSearchUrl(title: string, artist: string): string {
  const query = `releasegroup:"${escapeLucene(title)}" AND artist:"${escapeLucene(artist)}"`;
  const params = new URLSearchParams({ query, fmt: "json", limit: "5" });
  return `https://musicbrainz.org/ws/2/release-group/?${params.toString()}`;
}

export type ReleaseGroup = {
  id: string;
  score?: number;
  "first-release-date"?: string;
};

export type ReleaseGroupSearchResponse = {
  "release-groups"?: ReleaseGroup[];
};

export function pickConfidentReleaseGroups(
  response: ReleaseGroupSearchResponse,
): ReleaseGroup[] {
  return (response["release-groups"] ?? []).filter(
    (group) => (group.score ?? 0) >= 90,
  );
}

export function parseReleaseYear(value: string | undefined): number | null {
  const year = Number(value?.slice(0, 4));
  const isPlausibleYear =
    Number.isInteger(year) && year >= 1000 && year <= 2999;
  return isPlausibleYear ? year : null;
}

export function coverArtUrl(releaseGroupId: string): string {
  return `https://coverartarchive.org/release-group/${releaseGroupId}/front-250`;
}

export type AlbumMetadata = {
  coverUrl: string | null;
  releaseYear: number | null;
};

export async function lookupAlbumMetadata(
  title: string,
  artist: string,
): Promise<AlbumMetadata> {
  try {
    const searchResponse = await fetch(buildSearchUrl(title, artist), {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (!searchResponse.ok) return { coverUrl: null, releaseYear: null };

    const groups = pickConfidentReleaseGroups(await searchResponse.json());
    const releaseYear =
      groups
        .map((group) => parseReleaseYear(group["first-release-date"]))
        .find((year) => year !== null) ?? null;

    for (const group of groups) {
      const candidateUrl = coverArtUrl(group.id);
      const coverResponse = await fetch(candidateUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
      if (coverResponse.ok) return { coverUrl: candidateUrl, releaseYear };
    }
    return { coverUrl: null, releaseYear };
  } catch {
    return { coverUrl: null, releaseYear: null };
  }
}
