---
id: TASK-24
title: Account creation with email verification and 2FA support
status: To Do
assignee: []
created_date: '2026-07-06 12:50'
updated_date: '2026-07-09 16:38'
labels:
  - m3
dependencies: []
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let people create an account with just an email, verifying ownership before the account is usable — no third-party provider required. Include 2FA (two-factor authentication) as an optional security feature during account setup and login.

Preferred approach: Auth.js's email (magic-link) flow, which fits the current setup — the schema already has the `verificationToken` table and `user.emailVerified`. Flow: enter email -> receive a one-time verification/sign-in link -> clicking it verifies the address and creates or authenticates the account.

For 2FA support, integrate TOTP (Time-based One-Time Password) via a library like `speakeasy` or `otplib`. Users can optionally enable 2FA during account setup or in account settings:
- Generate a QR code for scanning into an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
- Store the encrypted secret in the database
- Require TOTP verification on login if enabled
- Provide backup codes for account recovery

Requires an email-sending integration (e.g. Resend or SMTP) with credentials in the local `.env` and in Vercel (production + preview). Add the provider to src/auth.ts, a request-link form on the landing page, the "check your email" / expired-or-invalid-link states, and 2FA enrollment/verification UI.

Assign a username on first sign-in via deriveUsername, same as the OAuth path.
<!-- SECTION:DESCRIPTION:END -->
