---
id: TASK-24
title: Account creation with email verification
status: To Do
assignee: []
created_date: '2026-07-06 12:50'
labels:
  - m3
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let people create an account with just an email, verifying ownership before the account is usable — no third-party provider required. Preferred approach: Auth.js's email (magic-link) flow, which fits the current setup — the schema already has the `verificationToken` table and `user.emailVerified`. Flow: enter email -> receive a one-time verification/sign-in link -> clicking it verifies the address and creates or authenticates the account. Assign a username on first sign-in via deriveUsername, same as the OAuth path.

Requires an email-sending integration (e.g. Resend or SMTP) with credentials in the local `.env` and in Vercel (production + preview). Add the provider to src/auth.ts, a request-link form on the landing page, and the "check your email" / expired-or-invalid-link states.

Alternative, if password login is specifically wanted: email + password via a Credentials provider with hashed passwords and a separate verification email — more work and it does not pair cleanly with database sessions, so magic links are recommended unless passwords are a hard requirement.
<!-- SECTION:DESCRIPTION:END -->
