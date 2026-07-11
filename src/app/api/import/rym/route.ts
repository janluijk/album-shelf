import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums } from "@/lib/db/schema";
import { isValidRating } from "@/lib/albums";
import { lookupAlbumMetadata } from "@/lib/coverArt";
import { maxImportBatchSize } from "@/lib/rymImport";

type ImportItem = {
  title: string;
  artist: string;
  rating: number | null;
  releaseYear: number | null;
  listenedOn: string | null;
  action: "create" | "update";
  albumId?: number;
};

const isoDatePattern = /^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$/;

type ImportResult = {
  status: "created" | "updated" | "error";
  message?: string;
};

function parseItem(value: unknown): ImportItem | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  const title = typeof item.title === "string" ? item.title.trim() : "";
  const artist = typeof item.artist === "string" ? item.artist.trim() : "";
  const rating =
    item.rating === null || item.rating === undefined
      ? null
      : isValidRating(item.rating)
        ? item.rating
        : undefined;
  const releaseYear =
    item.releaseYear === null || item.releaseYear === undefined
      ? null
      : Number.isInteger(item.releaseYear)
        ? (item.releaseYear as number)
        : undefined;
  const listenedOn =
    item.listenedOn === null || item.listenedOn === undefined
      ? null
      : typeof item.listenedOn === "string" &&
          isoDatePattern.test(item.listenedOn)
        ? item.listenedOn
        : undefined;
  const isCreate = item.action === "create";
  const isUpdate =
    item.action === "update" && Number.isInteger(item.albumId);
  const isValid =
    title.length > 0 &&
    artist.length > 0 &&
    rating !== undefined &&
    releaseYear !== undefined &&
    listenedOn !== undefined &&
    (isCreate || isUpdate);
  if (!isValid) return null;
  return {
    title,
    artist,
    rating,
    releaseYear,
    listenedOn,
    action: isCreate ? "create" : "update",
    albumId: isUpdate ? (item.albumId as number) : undefined,
  };
}

async function importItem(
  userId: string,
  item: ImportItem,
  fallbackListenedOn: string,
): Promise<ImportResult> {
  const db = getDb();
  if (item.action === "update") {
    const [updated] = await db
      .update(albums)
      .set({ rating: item.rating })
      .where(and(eq(albums.id, item.albumId!), eq(albums.userId, userId)))
      .returning({ id: albums.id });
    if (!updated) return { status: "error", message: "Album not found" };
    return { status: "updated" };
  }

  const metadata = await lookupAlbumMetadata(item.title, item.artist);
  await db.insert(albums).values({
    userId,
    title: item.title,
    artist: item.artist,
    rating: item.rating,
    coverUrl: metadata.coverUrl,
    releaseYear: item.releaseYear ?? metadata.releaseYear,
    listenedOn: item.listenedOn ?? fallbackListenedOn,
  });
  return { status: "created" };
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const rawItems = Array.isArray(body?.items) ? body.items : null;
  if (
    !rawItems ||
    rawItems.length === 0 ||
    rawItems.length > maxImportBatchSize
  ) {
    return NextResponse.json(
      { error: `Provide 1-${maxImportBatchSize} items per request` },
      { status: 400 },
    );
  }

  const fallbackListenedOn = new Date().toISOString().slice(0, 10);
  const results: ImportResult[] = [];
  for (const rawItem of rawItems) {
    const item = parseItem(rawItem);
    if (!item) {
      results.push({ status: "error", message: "Invalid import row" });
      continue;
    }
    const result = await importItem(userId, item, fallbackListenedOn).catch(() => ({
      status: "error" as const,
      message: "Import failed",
    }));
    results.push(result);
  }
  return NextResponse.json({ results });
}
