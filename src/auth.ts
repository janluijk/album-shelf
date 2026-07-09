import NextAuth from "next-auth";
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

async function assignUsername(userId: string, name: string | null | undefined, email: string | null | undefined) {
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
  await db.update(users).set({ username: candidate }).where(eq(users.id, userId));
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
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
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      await assignUsername(user.id, user.name, user.email);
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.username = (user as User).username;
      return session;
    },
  },
}));
