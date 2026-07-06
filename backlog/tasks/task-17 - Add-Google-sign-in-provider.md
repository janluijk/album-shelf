---
id: TASK-17
title: Add Google sign-in provider
status: Done
assignee: []
created_date: '2026-07-03 14:26'
updated_date: '2026-07-06 12:40'
labels:
  - m3
dependencies: []
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
GitHub-only sign-in excludes non-developer friends. Add the Google provider to src/auth.ts (register OAuth client in Google Cloud console, set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET locally and in Vercel). Consider email magic links as a follow-up. Part of opening the app up for M3 accounts/sharing.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added the Google provider to src/auth.ts (Auth.js auto-reads AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET, same convention as GitHub) and a "Sign in with Google" button on the landing page. Documented the env vars in .env.example, README (with callback URLs) and AGENTS.md. Kept the safe default for account linking (no allowDangerousEmailAccountLinking): a Google sign-in whose email already exists via GitHub will not auto-merge — it errors with OAuthAccountNotLinked. Fine for new (friend) accounts; can enable same-email linking later if desired (both providers verify email).

Provisioning still required before it works (owner action, not code): create a Google Cloud OAuth client, add redirect URIs http://localhost:3000/api/auth/callback/google (dev) and https://album-shelf-seven.vercel.app/api/auth/callback/google (prod), and set AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET in the local .env and in Vercel (production + preview). Previews reuse the production callback via the redirect proxy, so no per-preview Google config is needed.
<!-- SECTION:NOTES:END -->
