---
id: TASK-24
title: Account creation with email magic-link sign-in
status: Done
assignee: []
created_date: '2026-07-06 12:50'
updated_date: '2026-07-09 16:49'
labels:
  - m3
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let people create an account with just an email, verifying ownership before the account is usable — no third-party provider required. Approach decided with the user (2026-07-09): Auth.js email magic-link flow via Resend, magic link only — no password and no 2FA (inbox access is the credential; 2FA was descoped).
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented email magic-link sign-in via the Auth.js Resend provider. Added the Resend provider to src/auth.ts (from address via EMAIL_FROM, defaulting to Album Shelf <onboarding@resend.dev>) plus pages config: verifyRequest -> /check-email, error -> /auth-error. Landing page gained an email form (server action signIn("resend", formData)) below the GitHub button. New pages: /check-email (link-sent state) and /auth-error (Verification = expired/used link, AccessDenied, generic fallback, all with a retry link). Username assignment on first sign-in reuses the existing createUser event. Docs: .env.example and README updated with AUTH_RESEND_KEY and EMAIL_FROM. Deployment note: AUTH_RESEND_KEY must be added to Vercel env (production + preview) and local .env before the flow works — sender onboarding@resend.dev works without domain verification. 2FA was descoped per user decision (magic link only).
<!-- SECTION:NOTES:END -->
