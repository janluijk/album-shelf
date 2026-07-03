import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums, type Album } from "@/lib/db/schema";
import { isValidRating } from "@/lib/albums";

const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

async function findOwnedAlbum(id: number, userId: string) {
  const db = getDb();
  return db.query.albums.findFirst({
    where: and(eq(albums.id, id), eq(albums.userId, userId)),
  });
}

function parseUpdates(body: Record<string, unknown>): Partial<Album> | null {
  const updates: Partial<Album> = {};

  if ("rating" in body) {
    const validRating = body.rating === null || isValidRating(body.rating);
    if (!validRating) return null;
    updates.rating = body.rating as number | null;
  }

  if ("note" in body) {
    const validNote = body.note === null || typeof body.note === "string";
    if (!validNote) return null;
    updates.note = body.note as string | null;
  }

  if ("position" in body) {
    const validPosition =
      typeof body.position === "number" &&
      Number.isInteger(body.position) &&
      body.position >= 1;
    if (!validPosition) return null;
    updates.position = body.position as number;
  }

  if ("listenedOn" in body) {
    const validDate =
      body.listenedOn === null ||
      (typeof body.listenedOn === "string" && dateFormat.test(body.listenedOn));
    if (!validDate) return null;
    updates.listenedOn = body.listenedOn as string | null;
  }

  return updates;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const albumId = Number(id);
  const existing = await findOwnedAlbum(albumId, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const updates = parseUpdates(body);
  const hasUpdates = updates !== null && Object.keys(updates).length > 0;
  if (!hasUpdates) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  const db = getDb();
  const [updated] = await db
    .update(albums)
    .set(updates)
    .where(and(eq(albums.id, albumId), eq(albums.userId, userId)))
    .returning();
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const albumId = Number(id);
  const existing = await findOwnedAlbum(albumId, userId);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const db = getDb();
  await db
    .delete(albums)
    .where(and(eq(albums.id, albumId), eq(albums.userId, userId)));
  return NextResponse.json({ ok: true });
}
