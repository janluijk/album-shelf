const userAgent = "album-shelf/0.1 (https://github.com/janluijk/album-shelf)";
const requestTimeoutMs = 4000;

export function escapeLucene(value: string): string {
  return value.replace(/[\\"]/g, "\\$&");
}

export function buildSearchUrl(title: string, artist: string): string {
  const query = `releasegroup:"${escapeLucene(title)}" AND artist:"${escapeLucene(artist)}"`;
  const params = new URLSearchParams({ query, fmt: "json", limit: "1" });
  return `https://musicbrainz.org/ws/2/release-group/?${params.toString()}`;
}

export type ReleaseGroupSearchResponse = {
  "release-groups"?: { id: string; score?: number }[];
};

export function pickReleaseGroupId(
  response: ReleaseGroupSearchResponse,
): string | null {
  const first = response["release-groups"]?.[0];
  const isConfidentMatch = !!first && (first.score ?? 0) >= 90;
  if (!isConfidentMatch) return null;
  return first.id;
}

export function coverArtUrl(releaseGroupId: string): string {
  return `https://coverartarchive.org/release-group/${releaseGroupId}/front-250`;
}

export async function lookupCoverUrl(
  title: string,
  artist: string,
): Promise<string | null> {
  try {
    const searchResponse = await fetch(buildSearchUrl(title, artist), {
      headers: { "User-Agent": userAgent },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (!searchResponse.ok) return null;

    const releaseGroupId = pickReleaseGroupId(await searchResponse.json());
    if (!releaseGroupId) return null;

    const candidateUrl = coverArtUrl(releaseGroupId);
    const coverResponse = await fetch(candidateUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (!coverResponse.ok) return null;

    return candidateUrl;
  } catch {
    return null;
  }
}
