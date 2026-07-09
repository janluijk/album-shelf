import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isValidUsername, usernameRules } from "@/lib/usernames";
import { isValidGranularity } from "@/lib/ratings";
import { bioMaxLength, isValidBio, normalizeBio } from "@/lib/bio";
import {
  isValidLegend,
  normalizeLegend,
  type RatingLegend,
} from "@/lib/ratingLegend";

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const body = await request.json();
  const updates: {
    username?: string;
    ratingGranularity?: string;
    bio?: string | null;
    ratingLegend?: RatingLegend | null;
  } = {};

  if ("username" in body) {
    if (!isValidUsername(body.username)) {
      return NextResponse.json(
        { error: `Invalid username. Use ${usernameRules}` },
        { status: 400 },
      );
    }
    const taken = await db.query.users.findFirst({
      where: and(eq(users.username, body.username), ne(users.id, userId)),
    });
    if (taken) {
      return NextResponse.json(
        { error: "That username is already taken" },
        { status: 409 },
      );
    }
    updates.username = body.username;
  }

  if ("ratingGranularity" in body) {
    if (!isValidGranularity(body.ratingGranularity)) {
      return NextResponse.json({ error: "Invalid rating mode" }, { status: 400 });
    }
    updates.ratingGranularity = body.ratingGranularity;
  }

  if ("bio" in body) {
    if (!isValidBio(body.bio)) {
      return NextResponse.json(
        { error: `Bio must be text of at most ${bioMaxLength} characters` },
        { status: 400 },
      );
    }
    updates.bio = normalizeBio(body.bio);
  }

  if ("ratingLegend" in body) {
    if (body.ratingLegend !== null && !isValidLegend(body.ratingLegend)) {
      return NextResponse.json(
        {
          error:
            "Invalid rating legend. Provide a short description for each star rating from 1 to 5.",
        },
        { status: 400 },
      );
    }
    updates.ratingLegend =
      body.ratingLegend === null ? null : normalizeLegend(body.ratingLegend);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid updates" }, { status: 400 });
  }

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, userId))
    .returning({
      username: users.username,
      ratingGranularity: users.ratingGranularity,
      bio: users.bio,
      ratingLegend: users.ratingLegend,
    });
  return NextResponse.json(updated);
}
