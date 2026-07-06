import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums } from "@/lib/db/schema";
import { nextPosition } from "@/lib/albums";
import { lookupCoverUrl } from "@/lib/coverArt";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const artist = typeof body.artist === "string" ? body.artist.trim() : "";
  const isValid = title.length > 0 && artist.length > 0;
  if (!isValid) {
    return NextResponse.json(
      { error: "Title and artist are required" },
      { status: 400 },
    );
  }

  const db = getDb();
  const [existing, coverUrl] = await Promise.all([
    db.query.albums.findMany({ where: eq(albums.userId, userId) }),
    lookupCoverUrl(title, artist),
  ]);
  const [created] = await db
    .insert(albums)
    .values({ userId, title, artist, coverUrl, position: nextPosition(existing) })
    .returning();
  return NextResponse.json(created, { status: 201 });
}
