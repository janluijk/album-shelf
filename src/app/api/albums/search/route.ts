import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  buildAlbumSearchUrl,
  isSearchableQuery,
  minSearchLength,
  parseAlbumSearchResults,
  rankAlbumSearchResults,
} from "@/lib/albumSearch";

const userAgent = "album-shelf/0.1 (https://github.com/janluijk/album-shelf)";
const requestTimeoutMs = 5000;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const query = {
    title: params.get("q")?.trim() ?? "",
    artist: params.get("artist")?.trim() ?? "",
  };
  if (!isSearchableQuery(query)) {
    return NextResponse.json(
      { error: `Type at least ${minSearchLength} characters` },
      { status: 400 },
    );
  }

  const response = await fetch(buildAlbumSearchUrl(query), {
    headers: { "User-Agent": userAgent },
    signal: AbortSignal.timeout(requestTimeoutMs),
  }).catch(() => null);
  if (!response?.ok) {
    return NextResponse.json(
      { error: "Album search is unavailable right now" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    results: rankAlbumSearchResults(
      parseAlbumSearchResults(await response.json()),
      query,
    ),
  });
}
