import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { isValidUsername, usernameRules } from "@/lib/usernames";

export async function PATCH(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!isValidUsername(body.username)) {
    return NextResponse.json(
      { error: `Invalid username. Use ${usernameRules}` },
      { status: 400 },
    );
  }

  const db = getDb();
  const taken = await db.query.users.findFirst({
    where: and(eq(users.username, body.username), ne(users.id, userId)),
  });
  if (taken) {
    return NextResponse.json(
      { error: "That username is already taken" },
      { status: 409 },
    );
  }

  const [updated] = await db
    .update(users)
    .set({ username: body.username })
    .where(eq(users.id, userId))
    .returning({ username: users.username });
  return NextResponse.json(updated);
}
