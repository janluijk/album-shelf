import NextAuth from "next-auth";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
  type User,
} from "@/lib/db/schema";
import { deriveUsername } from "@/lib/usernames";

async function availableUsername(
  name: string | null | undefined,
  email: string | null | undefined,
): Promise<string> {
  const db = getDb();
  const base = deriveUsername(name, email);
  let candidate = base;
  let suffix = 1;
  while (
    await db.query.users.findFirst({ where: eq(users.username, candidate) })
  ) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

type AdapterSchema = NonNullable<
  Parameters<typeof DrizzleAdapter<ReturnType<typeof getDb>>>[1]
>;

function buildAdapter(): Adapter {
  const db = getDb();
  const schemaWithoutName = {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  } as unknown as AdapterSchema;
  return {
    ...DrizzleAdapter(db, schemaWithoutName),
    async createUser(user: AdapterUser) {
      const username = await availableUsername(user.name, user.email);
      const [created] = await db
        .insert(users)
        .values({
          id: user.id,
          username,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        })
        .returning();
      return {
        ...created,
        name: null,
        email: created.email ?? user.email,
      };
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: buildAdapter(),
  providers: [
    GitHub,
    Resend({
      from: process.env.EMAIL_FROM ?? "Album Shelf <onboarding@resend.dev>",
    }),
  ],
  pages: {
    verifyRequest: "/check-email",
    error: "/auth-error",
  },
  redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.username = (user as User).username;
      return session;
    },
  },
}));
