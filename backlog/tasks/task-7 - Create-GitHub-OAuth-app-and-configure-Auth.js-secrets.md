---
id: TASK-7
title: Create GitHub OAuth app and configure Auth.js secrets
status: Done
assignee: []
created_date: '2026-07-03 12:33'
updated_date: '2026-07-03 13:27'
labels:
  - m2
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
OAuth app callback: https://<domain>/api/auth/callback/github (plus localhost:3000 app for dev). Set AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET locally and in Vercel.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Two GitHub OAuth apps created: dev (localhost:3000) with credentials in local .env, production (album-shelf-seven.vercel.app) with credentials in Vercel env. Separate AUTH_SECRETs generated for .env and Vercel.
<!-- SECTION:NOTES:END -->
