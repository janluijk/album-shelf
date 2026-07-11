---
id: TASK-10
title: 'Pipeline shakedown: first PR through preview + Neon branch + e2e + AI review'
status: In Progress
assignee: []
created_date: '2026-07-03 12:34'
updated_date: '2026-07-03 13:51'
labels:
  - m2
dependencies: []
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Open a trivial PR and verify every workflow: CI, preview deploy on a Neon branch, Playwright against the preview URL, Claude review comment, cleanup on merge, production deploy.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Shakedown mostly complete. Production Deploy green after workflow fix (DATABASE_URL env added to build step, commit e32e420) - live at https://album-shelf-seven.vercel.app. PR #1 chain verified: CI green, Neon branch preview/pr-1 created, preview deployed, Playwright e2e passed, preview URL commented. db_url_with_pooler output worked fine. REMAINING: (1) Claude Review job exits green but posts no review comment - Claude execution result has is_error:true after 10 turns (API key works, .27 billed); likely needs workflow prompt fix to explicitly post via gh pr comment or track_progress:true. (2) Manual verification: sign in on production, add+rate album, check /u/<username> renders publicly.
<!-- SECTION:NOTES:END -->
