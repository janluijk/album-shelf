---
id: TASK-14
title: Move auth.ts Drizzle adapter to lazy init
status: Done
assignee: []
created_date: '2026-07-03 13:55'
updated_date: '2026-07-06 12:09'
labels:
  - m2
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
src/auth.ts constructs DrizzleAdapter(getDb()) at module scope, contradicting the lazy-init convention and forcing workflows to pass DATABASE_URL at build time. Investigate NextAuth v5 lazy config (function form) so builds need no database env at all.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
auth.ts now passes NextAuth a config *function* (`NextAuth(() => ({...}))`) instead of a config object. NextAuth only invokes the function per request (handlers) or when auth()/signIn()/signOut() run, so DrizzleAdapter(getDb()) is no longer constructed at module import — `next build` never touches the database. Verified: build succeeds with DATABASE_URL and AUTH_SECRET unset (the old module-scope form failed with "No database connection string was provided to neon()"). Removed the now-unnecessary build-time DATABASE_URL/AUTH_SECRET from ci.yml, and DATABASE_URL from the vercel build steps in preview.yml/production.yml; migration steps still pass it. AGENTS.md updated (debt note removed).
<!-- SECTION:NOTES:END -->
