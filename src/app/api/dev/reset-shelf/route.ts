import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { albums } from "@/lib/db/schema";

export async function POST() {
  const isProduction = process.env.VERCEL_ENV === "production";
  if (isProduction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deleted = await getDb()
    .delete(albums)
    .where(eq(albums.userId, userId))
    .returning({ id: albums.id });
  return NextResponse.json({ deleted: deleted.length });
}
