---
id: TASK-8
title: Create Vercel project and link repo
status: Done
assignee: []
created_date: '2026-07-03 12:34'
updated_date: '2026-07-03 13:27'
labels:
  - m2
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
vercel link, set env vars for production/preview, note VERCEL_ORG_ID and VERCEL_PROJECT_ID for GitHub secrets. Disable Vercel git auto-deploys (GHA owns deploys) and create an automation bypass secret for e2e.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Vercel project album-shelf created and linked (team dlg03s-projects). No Git integration (CLI-created, link null) so GH Actions owns deploys. Framework preset fixed to nextjs via API. Env vars DATABASE_URL, AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET set for Production+Preview. Protection bypass generated via API. Production domain: album-shelf-seven.vercel.app. VERCEL_TOKEN creation tracked under TASK-9.
<!-- SECTION:NOTES:END -->
